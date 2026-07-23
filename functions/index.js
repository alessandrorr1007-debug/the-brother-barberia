const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function: Check slot availability with atomic Firestore transaction
 */
exports.checkAndReserveBooking = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Debes estar autenticado para agendar una cita.");
  }

  const { barberId, barberName, serviceName, servicePrice, date, time, notes } = data;
  const userId = context.auth.uid;
  const username = context.auth.token.name || "Cliente";

  const bookingRef = db.collection("bookings").doc();
  const slotDocId = `${barberId}_${date}_${time}`;
  const slotRef = db.collection("slots").doc(slotDocId);

  try {
    return await db.runTransaction(async (transaction) => {
      const slotDoc = await transaction.get(slotRef);

      if (slotDoc.exists && slotDoc.data().reserved === true) {
        throw new functions.https.HttpsError(
          "already-exists",
          `El horario ${time} del ${date} con ${barberName} ya no se encuentra disponible.`
        );
      }

      // 1. Lock the slot
      transaction.set(slotRef, {
        barberId,
        date,
        time,
        reserved: true,
        reservedBy: userId,
        reservedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Create booking record
      const bookingData = {
        id: "TB-" + Math.floor(10000 + Math.random() * 90000),
        userId,
        username,
        barberId,
        barberName,
        serviceName,
        servicePrice,
        date,
        time,
        notes,
        status: "Confirmada",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.set(bookingRef, bookingData);

      return { success: true, booking: bookingData };
    });
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Cloud Function: Handle 3-cancellation penalty trigger
 */
exports.onBookingCancelled = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (beforeData.status !== "Cancelada" && afterData.status === "Cancelada") {
      const userId = afterData.userId;
      const userRef = db.collection("users").doc(userId);

      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) return;

        const currentCount = (userDoc.data().cancellationCount || 0) + 1;

        if (currentCount >= 3) {
          const blockUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          transaction.update(userRef, {
            cancellationCount: 0,
            blockedUntil: blockUntil.toISOString()
          });
        } else {
          transaction.update(userRef, {
            cancellationCount: currentCount
          });
        }
      });
    }
  });
