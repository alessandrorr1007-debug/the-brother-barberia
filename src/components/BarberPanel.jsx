import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, User,
  Phone, Scissors, Edit3, Save, Lock, ShieldAlert, History
} from 'lucide-react';

export default function BarberPanel({
  currentUser,
  userBookings,
  setUserBookings,
  barbersDb,
  setBarbersDb,
  usersDb,
  setUsersDb,
  blockedTimes,
  setBlockedTimes
}) {
  const [activeTab, setActiveTab] = useState('agenda');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Cancel Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Block Time Form State
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('11:00 AM');
  const [blockReasonText, setBlockReasonText] = useState('Motivo Personal / Descanso');

  // Change Password Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Edit Public Profile State
  const myProfile = barbersDb.find(b => b.id === currentUser.barberId) || {
    id: currentUser.barberId || 'maicol',
    name: currentUser.name || 'Barbero',
    nickname: 'Especialista',
    role: 'Barbero',
    experience: '5+ Años',
    bio: 'Barbero profesional de The Brother.',
    specialties: ['Corte Clásico', 'Fade']
  };

  const [editBio, setEditBio] = useState(myProfile.bio);
  const [editExp, setEditExp] = useState(myProfile.experience);
  const [editSpecs, setEditSpecs] = useState(myProfile.specialties.join(', '));
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter Bookings ASSIGNED EXCLUSIVELY TO THIS BARBER
  const myBarberName = currentUser.name || 'Maicol';
  const myAssignedBookings = userBookings.filter(b => {
    if (currentUser.barberId === 'maicol' || currentUser.username.includes('maicol')) {
      return b.barberName.includes('Maicol') || b.barberName.includes('Cualquier');
    }
    if (currentUser.barberId === 'diego' || currentUser.username.includes('diego')) {
      return b.barberName.includes('Diego');
    }
    return b.barberName.toLowerCase().includes(myBarberName.toLowerCase());
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const filteredBookings = myAssignedBookings.filter(b => {
    if (filterPeriod === 'today') return b.date === todayStr;
    return true;
  });

  // HANDLER: Mark as Completed
  const handleMarkCompleted = (bookingId) => {
    setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completada' } : b));
  };

  // HANDLER: Mark as NO-SHOW (CLIENT NO LLEGÓ) WITH 3-TIMES PERMANENT BLOCK RULE
  const handleMarkNoShow = (bookingId, clientUsername) => {
    if (!window.confirm(`¿Marcar cita como 'CLIENTE NO LLEGÓ' (No-Show)?`)) return;

    setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'No-Show' } : b));

    // Update client user no-show count
    setUsersDb(prev => prev.map(u => {
      if (u.username.toLowerCase() === clientUsername.toLowerCase()) {
        const newNoShowCount = (u.noShowCount || 0) + 1;

        if (newNoShowCount >= 3) {
          alert(`🛑 ATENCIÓN: El cliente @${clientUsername} ha acumulado 3 NO-SHOWS (No asistió). Su cuenta ha sido BLOQUEADA DE FORMA PERMANENTE para agendar citas.`);
          return {
            ...u,
            noShowCount: newNoShowCount,
            blockedPermanent: true,
            blockReason: '3+ No-Shows (No asistió a sus citas agendadas)'
          };
        } else {
          alert(`Cita registrada como 'No-Show'. El cliente @${clientUsername} acumula ${newNoShowCount} de 3 faltas antes del bloqueo permanente.`);
          return {
            ...u,
            noShowCount: newNoShowCount
          };
        }
      }
      return u;
    }));
  };

  // HANDLER: Barber Cancel Cita with reason
  const handleOpenCancelModal = (booking) => {
    setCancelModalBooking(booking);
    setCancelReason('');
  };

  const handleConfirmCancelWithReason = (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setUserBookings(prev => prev.map(b => b.id === cancelModalBooking.id ? {
      ...b,
      status: 'Cancelada',
      cancelReason: cancelReason.trim()
    } : b));

    setCancelModalBooking(null);
  };

  // HANDLER: Block Personal Time
  const handleAddBlockTime = (e) => {
    e.preventDefault();
    if (!blockDate) return;

    const newBlock = {
      id: 'BLOCK-' + Date.now(),
      barberId: currentUser.barberId || 'maicol',
      date: blockDate,
      time: blockTime,
      reason: blockReasonText
    };

    setBlockedTimes(prev => [...prev, newBlock]);
    setBlockDate('');
    alert('Horario bloqueado en tu agenda.');
  };

  // HANDLER: Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    setUsersDb(prev => prev.map(u => u.username === currentUser.username ? {
      ...u,
      password: newPassword,
      mustChangePassword: false
    } : u));

    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  // HANDLER: Save Public Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...myProfile,
      bio: editBio,
      experience: editExp,
      specialties: editSpecs.split(',').map(s => s.trim())
    };

    setBarbersDb(prev => prev.map(b => b.id === myProfile.id ? updatedProfile : b));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Barber Must Change Password Warning Banner */}
      {currentUser.mustChangePassword && (
        <div style={{ background: 'rgba(255, 170, 0, 0.12)', border: '1px solid #FFAA00', padding: '14px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle color="#FFAA00" size={22} />
            <div>
              <div style={{ fontWeight: 800, color: '#FFAA00', fontSize: '0.9rem' }}>Primer Inicio de Sesión</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Por seguridad, por favor cambia tu contraseña temporal.</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('password')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            Cambiar Clave
          </button>
        </div>
      )}

      {/* Panel Navigation Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'var(--bg-dark)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('agenda')}
          style={{
            flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'agenda' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'agenda' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          📅 Mi Agenda ({filteredBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('block_time')}
          style={{
            flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'block_time' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'block_time' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          🚫 Bloquear Horario
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'profile' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          👤 Mi Perfil Web
        </button>

        <button
          onClick={() => setActiveTab('password')}
          style={{
            flex: 1, minWidth: '100px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'password' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'password' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          🔑 Seguridad
        </button>
      </div>

      {/* AGENDA TAB */}
      {activeTab === 'agenda' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Citas Asignadas A Mí
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setFilterPeriod('all')} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: filterPeriod === 'all' ? 'var(--gold-primary)' : 'transparent', color: filterPeriod === 'all' ? '#0A0A0C' : 'var(--text-muted)' }}>
                Todas
              </button>
              <button onClick={() => setFilterPeriod('today')} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: filterPeriod === 'today' ? 'var(--gold-primary)' : 'transparent', color: filterPeriod === 'today' ? '#0A0A0C' : 'var(--text-muted)' }}>
                Solo Hoy
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', background: 'var(--bg-dark)', borderRadius: '10px' }}>
              No tienes citas agendadas en este filtro.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredBookings.map(b => (
                <div key={b.id} style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '10px', border: b.status === 'Confirmada' ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 800 }}>{b.id}</span>
                      <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{b.serviceName} ({b.servicePrice})</h5>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, background: b.status === 'Confirmada' ? 'rgba(37, 211, 102, 0.15)' : b.status === 'Completada' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255, 85, 85, 0.15)', color: b.status === 'Confirmada' ? '#25D366' : b.status === 'Completada' ? 'var(--gold-primary)' : '#FF5555' }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>👤 <strong>Cliente:</strong> @{b.username}</div>
                    <div>📅 <strong>Fecha:</strong> {b.date} {b.time}</div>
                  </div>

                  {b.status === 'Confirmada' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)' }}>
                      <button onClick={() => handleMarkCompleted(b.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                        <CheckCircle2 size={14} />
                        <span>Marcar Atendida</span>
                      </button>
                      
                      <button onClick={() => handleMarkNoShow(b.id, b.username)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 85, 85, 0.12)', border: '1px solid #FF5555', color: '#FF5555', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
                        <XCircle size={14} />
                        <span>No Llegó (No-Show)</span>
                      </button>

                      <button onClick={() => handleOpenCancelModal(b)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                        Cancelar con Motivo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CANCEL REASON MODAL */}
      {cancelModalBooking && (
        <form onSubmit={handleConfirmCancelWithReason} style={{ background: 'var(--bg-dark)', padding: '18px', borderRadius: '10px', border: '1px solid #FF5555' }}>
          <h5 style={{ color: '#FF5555', fontWeight: 800, marginBottom: '8px' }}>Cancelar Cita {cancelModalBooking.id}</h5>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Ingresa la razón de cancelación:</label>
          <input type="text" required value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Ej: Imprevisto de fuerza mayor / Cliente solicitó cambio" style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '12px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setCancelModalBooking(null)} className="btn btn-secondary" style={{ flex: 1 }}>Volver</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#FF5555' }}>Confirmar Cancelación</button>
          </div>
        </form>
      )}

      {/* BLOCK TIME TAB */}
      {activeTab === 'block_time' && (
        <form onSubmit={handleAddBlockTime} style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>Bloquear Horario Personal en Mi Agenda</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Fecha</label>
              <input type="date" required value={blockDate} onChange={e => setBlockDate(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Hora</label>
              <select value={blockTime} onChange={e => setBlockTime(e.target.value)} style={{ width: '100%', padding: '11px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }}>
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Motivo</label>
            <input type="text" value={blockReasonText} onChange={e => setBlockReasonText(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Registrar Bloqueo de Horario</button>
        </form>
      )}

      {/* EDIT PROFILE TAB */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>Editar Mi Perfil Público (Sección Nuestros Barberos)</h4>
          {profileSaved && <div style={{ color: '#25D366', fontSize: '0.85rem', marginBottom: '10px' }}>✓ Perfil actualizado en la web pública.</div>}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Años de Experiencia</label>
            <input type="text" value={editExp} onChange={e => setEditExp(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Especialidades (separadas por coma)</label>
            <input type="text" value={editSpecs} onChange={e => setEditSpecs(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Biografía Pública</label>
            <textarea rows="3" value={editBio} onChange={e => setEditBio(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Guardar Cambios en la Web</button>
        </form>
      )}

      {/* CHANGE PASSWORD TAB */}
      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword} style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>Cambiar Mi Contraseña</h4>
          {passSuccess && <div style={{ color: '#25D366', fontSize: '0.85rem', marginBottom: '10px' }}>✓ Contraseña actualizada correctamente.</div>}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nueva Contraseña</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Confirmar Nueva Contraseña</label>
            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Actualizar Contraseña</button>
        </form>
      )}

    </div>
  );
}
