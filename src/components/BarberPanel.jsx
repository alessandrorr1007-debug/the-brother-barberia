import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle, AlertTriangle, UserCheck, ShieldAlert,
  Edit3, Key, Lock, Phone, User, FileText, Check, Plus, Trash2, Scissors
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
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'today' | 'week' | 'all'

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Cancel Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Block Schedule State
  const [blockDate, setBlockDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [blockTime, setBlockTime] = useState('12:00 PM');
  const [blockReason, setBlockReason] = useState('Descanso personal');

  // Edit Barber Profile State
  const currentBarberProfile = barbersDb.find(b => b.id === currentUser.barberId) || {
    id: currentUser.barberId || 'maicol',
    name: currentUser.name,
    nickname: 'Barbero',
    experience: '5+ Años',
    bio: 'Experto en barbería boutique.',
    specialties: ['Corte Clásico', 'Fade']
  };

  const [editBio, setEditBio] = useState(currentBarberProfile.bio);
  const [editSpecialties, setEditSpecialties] = useState(currentBarberProfile.specialties.join(', '));
  const [editExperience, setEditExperience] = useState(currentBarberProfile.experience);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Filter Bookings FOR THIS BARBER ONLY (Strict No-Peeking Enforcement)
  const myBarberNameKey = currentUser.barberId === 'maicol' ? 'Maicol' : 'Diego';
  const myBookings = userBookings.filter(b => b.barberName.includes(myBarberNameKey));

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = myBookings.filter(b => {
    if (filterPeriod === 'today') return b.date === todayStr;
    return true;
  });

  const pendingBookings = filteredBookings.filter(b => b.status === 'Confirmada');
  const attendedBookings = filteredBookings.filter(b => b.status === 'Completada');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'Cancelada' || b.status === 'No-Show');

  // HANDLERS
  const handleMarkStatus = (bookingId, newStatus) => {
    setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const handleConfirmCancelWithReason = (e) => {
    e.preventDefault();
    if (!cancelReason) return;
    setUserBookings(prev => prev.map(b => b.id === cancelModalBooking.id ? {
      ...b,
      status: 'Cancelada',
      cancelReason: cancelReason
    } : b));
    setCancelModalBooking(null);
    setCancelReason('');
  };

  const handleAddBlockedTime = (e) => {
    e.preventDefault();
    const newBlock = {
      id: 'BLK-' + Date.now(),
      barberId: currentUser.barberId,
      date: blockDate,
      time: blockTime,
      reason: blockReason
    };
    setBlockedTimes(prev => [...prev, newBlock]);
    alert('Horario personal bloqueado correctamente.');
  };

  const handleRemoveBlockedTime = (id) => {
    setBlockedTimes(prev => prev.filter(b => b.id !== id));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (oldPassword !== currentUser.password) {
      alert('La contraseña actual no es correcta.');
      return;
    }
    const updatedUser = { ...currentUser, password: newPassword, mustChangePassword: false };
    setUsersDb(prev => prev.map(u => u.username === currentUser.username ? updatedUser : u));
    setPassSuccess('Contraseña actualizada correctamente.');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPassSuccess(''), 3000);
  };

  const handleSaveBarberProfile = (e) => {
    e.preventDefault();
    const specs = editSpecialties.split(',').map(s => s.trim()).filter(Boolean);
    const updatedProfile = {
      ...currentBarberProfile,
      bio: editBio,
      experience: editExperience,
      specialties: specs
    };
    setBarbersDb(prev => prev.map(b => b.id === currentBarberProfile.id ? updatedProfile : b));
    setProfileSuccess('Perfil público actualizado correctamente.');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const myBlockedTimes = blockedTimes.filter(b => b.barberId === currentUser.barberId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Password Change Alert for New Barber */}
      {currentUser.mustChangePassword && (
        <div style={{ background: 'rgba(255, 170, 0, 0.12)', border: '1px solid #FFAA00', padding: '12px 16px', borderRadius: '10px', color: '#FFAA00', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span><strong>Primer Inicio de Sesión:</strong> Se requiere que cambies tu contraseña temporal por seguridad.</span>
          </div>
          <button onClick={() => setActiveTab('security')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            Cambiar Ahora
          </button>
        </div>
      )}

      {/* Barber Navigation Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'var(--bg-dark)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('agenda')}
          style={{
            flex: 1, minWidth: '100px', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'agenda' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'agenda' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          📅 Mi Agenda ({pendingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1, minWidth: '100px', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'history' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'history' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          📜 Atendidas ({attendedBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('block_time')}
          style={{
            flex: 1, minWidth: '110px', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'block_time' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'block_time' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          🚫 Bloquear Horario
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1, minWidth: '100px', padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'profile' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          👤 Perfil Público
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: activeTab === 'security' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: activeTab === 'security' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          🔒 Seguridad
        </button>
      </div>

      {/* TAB 1: AGENDA DE CITAS DEL BARBERO */}
      {activeTab === 'agenda' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Agenda Personal de {currentUser.name}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setFilterPeriod('all')}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', background: filterPeriod === 'all' ? 'var(--gold-primary)' : 'var(--bg-dark)', color: filterPeriod === 'all' ? '#0A0A0C' : 'var(--text-muted)', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterPeriod('today')}
                style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', background: filterPeriod === 'today' ? 'var(--gold-primary)' : 'var(--bg-dark)', color: filterPeriod === 'today' ? '#0A0A0C' : 'var(--text-muted)', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Hoy
              </button>
            </div>
          </div>

          {pendingBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', background: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <Calendar size={32} color="var(--gold-primary)" style={{ opacity: 0.5, marginBottom: '8px' }} />
              <div>No tienes citas pendientes agendadas.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '10px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{b.id}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(197, 160, 89, 0.15)', color: 'var(--gold-primary)', padding: '3px 10px', borderRadius: '99px', fontWeight: 700 }}>
                      Pendiente
                    </span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {b.serviceName} <span style={{ color: 'var(--gold-primary)' }}>({b.servicePrice})</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div>👤 <strong>Cliente:</strong> {b.username}</div>
                    <div>📱 <strong>Celular:</strong> +51 987654321</div>
                    <div>📅 <strong>Fecha:</strong> {b.date}</div>
                    <div>⏰ <strong>Hora:</strong> {b.time}</div>
                  </div>

                  {/* Actions for Barber */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => handleMarkStatus(b.id, 'Completada')}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#25D366', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={14} />
                      <span>Completada</span>
                    </button>

                    <button
                      onClick={() => handleMarkStatus(b.id, 'No-Show')}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(255, 170, 0, 0.15)', border: '1px solid #FFAA00', color: '#FFAA00', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <XCircle size={14} />
                      <span>No Llegó (No-Show)</span>
                    </button>

                    <button
                      onClick={() => setCancelModalBooking(b)}
                      style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(255, 85, 85, 0.1)', border: '1px solid rgba(255, 85, 85, 0.3)', color: '#FF5555', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cancel Reason Modal */}
          {cancelModalBooking && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <form onSubmit={handleConfirmCancelWithReason} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid #FF5555', width: '100%', maxWidth: '420px' }}>
                <h4 style={{ color: '#FF5555', fontWeight: 800, marginBottom: '10px' }}>Cancelar Cita ({cancelModalBooking.id})</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                  Especifica el motivo de la cancelación para registrarlo en el sistema.
                </p>
                <textarea
                  rows="3"
                  placeholder="Ej: Emergencia del barbero / Inclemencia climática"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px', marginBottom: '14px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setCancelModalBooking(null)} className="btn btn-secondary" style={{ flex: 1, padding: '8px' }}>Volver</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '8px', background: '#FF5555', color: '#FFF' }}>Confirmar Cancelación</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORIAL DE CITAS ATENDIDAS */}
      {activeTab === 'history' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
            Historial de Citas Atendidas / Finalizadas
          </h4>
          {attendedBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', background: 'var(--bg-dark)', borderRadius: '10px' }}>
              No tienes citas completadas registradas en el historial.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {attendedBookings.map(b => (
                <div key={b.id} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{b.serviceName} ({b.servicePrice})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente: {b.username} | 📅 {b.date} {b.time}</div>
                  </div>
                  <span style={{ color: '#25D366', fontWeight: 800, fontSize: '0.8rem' }}>✓ Completada</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BLOQUEAR HORARIOS PERSONALES */}
      {activeTab === 'block_time' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
            Bloquear Horario Personal (Ausencia / Descanso)
          </h4>
          <form onSubmit={handleAddBlockedTime} style={{ background: 'var(--bg-dark)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Fecha a Bloquear</label>
                <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Hora</label>
                <input type="text" value={blockTime} onChange={(e) => setBlockTime(e.target.value)} placeholder="Ej: 12:00 PM o Todo el Día" style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Motivo (Opcional)</label>
              <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Ej: Capacitación / Asunto personal" style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              <Plus size={16} />
              <span>Guardar Bloqueo de Horario</span>
            </button>
          </form>

          {/* List of Blocked Times */}
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>Mis Horarios Bloqueados</h5>
          {myBlockedTimes.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No tienes horarios bloqueados.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myBlockedTimes.map(blk => (
                <div key={blk.id} style={{ background: 'var(--bg-dark)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    📅 <strong>{blk.date}</strong> a las <strong>{blk.time}</strong> — <em>{blk.reason}</em>
                  </div>
                  <button onClick={() => handleRemoveBlockedTime(blk.id)} style={{ background: 'none', border: 'none', color: '#FF5555', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERFIL PÚBLICO DEL BARBERO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveBarberProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Editar Perfil Público en "Nuestros Barberos"
          </h4>

          {profileSuccess && (
            <div style={{ background: 'rgba(37, 211, 102, 0.12)', border: '1px solid #25D366', color: '#25D366', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
              ✓ {profileSuccess}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Años de Experiencia</label>
            <input type="text" value={editExperience} onChange={(e) => setEditExperience(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Biografía / Presentación Corta</label>
            <textarea rows="3" value={editBio} onChange={(e) => setEditBio(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Especialidades (Separadas por coma)</label>
            <input type="text" value={editSpecialties} onChange={(e) => setEditSpecialties(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Edit3 size={16} />
            <span>Guardar Cambios en la Web</span>
          </button>
        </form>
      )}

      {/* TAB 5: SEGURIDAD (CAMBIO DE CONTRASEÑA) */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Cambiar Contraseña de Barbero
          </h4>

          {passSuccess && (
            <div style={{ background: 'rgba(37, 211, 102, 0.12)', border: '1px solid #25D366', color: '#25D366', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
              ✓ {passSuccess}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contraseña Actual</label>
            <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nueva Contraseña</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', color: 'var(--text-main)', borderRadius: '6px' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Key size={16} />
            <span>Actualizar Contraseña</span>
          </button>
        </form>
      )}

    </div>
  );
}
