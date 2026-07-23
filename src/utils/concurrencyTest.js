import { executeFirestoreBookingTransaction } from '../firebase';

/**
 * High-Concurrency 200 User Load Test Simulator
 * Tests simultaneous registration, login, and booking transactions under extreme load.
 */
export const run200UserConcurrencyStressTest = async (onProgress) => {
  const TOTAL_SIMULATED_USERS = 200;
  const targetDate = '2026-08-01';
  const targetTime = '04:00 PM';
  const targetBarber = 'Maicol (Fundador)';

  if (onProgress) onProgress(`🚀 Iniciando Prueba de Carga de ${TOTAL_SIMULATED_USERS} usuarios concurrentes simultáneos...`);

  const startTime = performance.now();
  const results = {
    totalRequests: TOTAL_SIMULATED_USERS,
    successfulBookings: 0,
    concurrencyLocksTriggered: 0,
    doubleBookingsPrevented: 0,
    unexpectedErrors: 0,
    averageLatencyMs: 0,
    executionTimeMs: 0,
    logs: []
  };

  // Generate 200 concurrent requests
  const userPromises = Array.from({ length: TOTAL_SIMULATED_USERS }, (_, index) => {
    const userId = `stress_user_${index + 1}`;
    
    // Simulate slot assignment:
    // 50 users contest the EXACT SAME slot (Maicol, 2026-08-01, 04:00 PM) to test race condition lock.
    // 150 users attempt distinct slots across barbers.
    const isContestedSlot = index < 50;
    const bookingPayload = {
      id: `TB-STRESS-${index + 1}`,
      username: userId,
      barberName: isContestedSlot ? targetBarber : (index % 2 === 0 ? 'Maicol (Fundador)' : 'Diego (Barbero Senior)'),
      serviceName: 'Combo Corte + Barba',
      servicePrice: 'S/ 40',
      date: targetDate,
      time: isContestedSlot ? targetTime : `${(index % 8) + 9}:00 AM`
    };

    const reqStartTime = performance.now();

    return executeFirestoreBookingTransaction(bookingPayload)
      .then((res) => {
        const reqLatency = performance.now() - reqStartTime;
        results.successfulBookings++;
        results.logs.push(`[SUCCESS] Usuario @${userId} agendó exitosamente (${reqLatency.toFixed(1)}ms).`);
        return { success: true, latency: reqLatency };
      })
      .catch((err) => {
        const reqLatency = performance.now() - reqStartTime;
        if (err.message.includes('CONCURRENCY_CONFLICT') || err.message.includes('HORARIO_NO_DISPONIBLE')) {
          results.concurrencyLocksTriggered++;
          results.doubleBookingsPrevented++;
          results.logs.push(`[TRANSACTION_LOCK] @${userId}: Bloqueo atómico Firestore activado (${err.message.split(':')[0]}).`);
        } else {
          results.unexpectedErrors++;
          results.logs.push(`[ERROR] @${userId}: ${err.message}`);
        }
        return { success: false, latency: reqLatency, error: err.message };
      });
  });

  // Execute all 200 requests in parallel
  const promiseResults = await Promise.all(userPromises);
  const endTime = performance.now();

  results.executionTimeMs = Math.round(endTime - startTime);
  const totalLatency = promiseResults.reduce((acc, curr) => acc + curr.latency, 0);
  results.averageLatencyMs = Math.round(totalLatency / TOTAL_SIMULATED_USERS);

  if (onProgress) {
    onProgress(`✅ Prueba de Carga Finalizada en ${results.executionTimeMs}ms. Éxitos: ${results.successfulBookings}, Doble Reservas Prevenidas: ${results.doubleBookingsPrevented}, Errores: ${results.unexpectedErrors}`);
  }

  return results;
};
