import React, { useState } from 'react';
import {
  Calendar, Users, Scissors, DollarSign, BarChart3, ShieldCheck, UserPlus,
  Edit3, Trash2, Unlock, AlertTriangle, CheckCircle, Plus, Eye, FileText, Info, ShieldAlert
} from 'lucide-react';

export default function AdminPanel({
  currentUser,
  usersDb,
  setUsersDb,
  userBookings,
  setUserBookings,
  servicesDb,
  setServicesDb,
  barbersDb,
  setBarbersDb,
  webContent,
  setWebContent
}) {
  const [adminTab, setAdminTab] = useState('overview');

  // New Barber Form State
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberUsername, setNewBarberUsername] = useState('');
  const [newBarberPhone, setNewBarberPhone] = useState('');
  const [newBarberTempPass, setNewBarberTempPass] = useState('barber123');
  const [newBarberSpecialty, setNewBarberSpecialty] = useState('Corte Clásico, Fade');
  const [barberMsg, setBarberMsg] = useState('');

  // Edit Service State
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editServTitle, setEditServTitle] = useState('');
  const [editServPrice, setEditServPrice] = useState('');
  const [editServDesc, setEditServDesc] = useState('');

  // Edit Web Content State
  const [aboutHistoryText, setAboutHistoryText] = useState(webContent?.history || 'The Brother nace de la pasión de Maicol...');
  const [scheduleText, setScheduleText] = useState(webContent?.schedule || 'Lunes a Sábado: 9am - 9pm');

  // Financial Estimation Report Filters
  const [revBarberFilter, setRevBarberFilter] = useState('all');
  const [revPeriodFilter, setRevPeriodFilter] = useState('all');

  // HANDLERS: Create Barber Account
  const handleCreateBarber = (e) => {
    e.preventDefault();
    if (!newBarberUsername || !newBarberName || !newBarberPhone) return;

    if (usersDb.some(u => u.username.toLowerCase() === newBarberUsername.trim().toLowerCase())) {
      alert('Ese usuario ya existe.');
      return;
    }

    const barberId = newBarberUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const newBarberUser = {
      username: newBarberUsername.trim(),
      password: newBarberTempPass,
      role: 'barber',
      barberId: barberId,
      name: newBarberName,
      phone: newBarberPhone,
      verified: true,
      mustChangePassword: true
    };

    const newBarberProfile = {
      id: barberId,
      name: newBarberName,
      nickname: 'Master Barber',
      role: 'Barbero Senior',
      isOwner: false,
      experience: '5+ Años',
      image: '/assets/barber_senior.jpg',
      specialties: newBarberSpecialty.split(',').map(s => s.trim()),
      bio: `Barbero profesional con especialidad en ${newBarberSpecialty}.`
    };

    setUsersDb(prev => [...prev, newBarberUser]);
    setBarbersDb(prev => [...prev, newBarberProfile]);

    setBarberMsg(`¡Cuenta de barbero creada! Usuario: @${newBarberUsername} | Clave Temporal: ${newBarberTempPass}`);
    setNewBarberName('');
    setNewBarberUsername('');
    setNewBarberPhone('');
    setTimeout(() => setBarberMsg(''), 4000);
  };

  const handleDeleteBarber = (username, barberId) => {
    if (window.confirm(`¿Seguro que deseas eliminar la cuenta de barbero @${username}?`)) {
      setUsersDb(prev => prev.filter(u => u.username !== username));
      setBarbersDb(prev => prev.filter(b => b.id !== barberId));
    }
  };

  // MASTER UNBLOCK HANDLER (TEMPORARY OR PERMANENT)
  const handleUnblockClient = (username) => {
    setUsersDb(prev => prev.map(u => u.username === username ? {
      ...u,
      cancellationCount: 0,
      cancellationCycles: 0,
      noShowCount: 0,
      blockedUntil: null,
      blockedPermanent: false,
      blockReason: null
    } : u));
    alert(`Cliente @${username} ha sido DESBLOQUEADO por el Administrador. Ya puede reservar con normalidad.`);
  };

  const handleStartEditService = (s) => {
    setEditingServiceId(s.id);
    setEditServTitle(s.title);
    setEditServPrice(s.price);
    setEditServDesc(s.description);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    setServicesDb(prev => prev.map(s => s.id === editingServiceId ? {
      ...s,
      title: editServTitle,
      price: editServPrice,
      description: editServDesc
    } : s));
    setEditingServiceId(null);
  };

  // Metrics & Financial Calculations
  const totalBookings = userBookings.length;
  const completedBookingsList = userBookings.filter(b => b.status === 'Completada' || b.status === 'Atendida');
  const cancelledBookings = userBookings.filter(b => b.status === 'Cancelada').length;
  const barberAccounts = usersDb.filter(u => u.role === 'barber');

  // Filtered Blocked Clients List (Both Temporary and Permanent)
  const allBlockedClients = usersDb.filter(u => 
    u.blockedPermanent === true || 
    (u.blockedUntil && new Date().getTime() < new Date(u.blockedUntil).getTime())
  );

  // Filtered Completed Bookings for Revenue Calculation
  const filteredCompletedBookings = completedBookingsList.filter(b => {
    if (revBarberFilter === 'maicol' && !b.barberName.includes('Maicol')) return false;
    if (revBarberFilter === 'diego' && !b.barberName.includes('Diego')) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    if (revPeriodFilter === 'today' && b.date !== todayStr) return false;
    return true;
  });

  const totalEstimatedRevenue = filteredCompletedBookings.reduce((sum, b) => {
    const numericPrice = parseInt((b.servicePrice || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + numericPrice;
  }, 0);

  const serviceBreakdown = {};
  filteredCompletedBookings.forEach(b => {
    const sName = b.serviceName || 'Corte General';
    const numericPrice = parseInt((b.servicePrice || '0').replace(/[^0-9]/g, ''), 10) || 0;
    if (!serviceBreakdown[sName]) {
      serviceBreakdown[sName] = { count: 0, total: 0 };
    }
    serviceBreakdown[sName].count += 1;
    serviceBreakdown[sName].total += numericPrice;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: 'var(--bg-dark)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setAdminTab('overview')}
          style={{
            flex: 1, minWidth: '100px', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: adminTab === 'overview' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: adminTab === 'overview' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          📊 Citas
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          style={{
            flex: 1, minWidth: '120px', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', border: 'none',
            background: adminTab === 'reports' ? 'rgba(197, 160, 89, 0.25)' : 'transparent',
            color: 'var(--gold-primary)', border: '1px solid var(--border-gold)'
          }}
        >
          💰 Ingresos Web
        </button>

        <button
          onClick={() => setAdminTab('barbers')}
          style={{
            flex: 1, minWidth: '95px', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: adminTab === 'barbers' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: adminTab === 'barbers' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          💈 Barberos ({barberAccounts.length})
        </button>

        <button
          onClick={() => setAdminTab('services')}
          style={{
            flex: 1, minWidth: '95px', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: adminTab === 'services' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
            color: adminTab === 'services' ? 'var(--gold-primary)' : 'var(--text-muted)'
          }}
        >
          ✂️ Precios
        </button>

        <button
          onClick={() => setAdminTab('clients')}
          style={{
            flex: 1, minWidth: '95px', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: adminTab === 'clients' ? 'rgba(255, 85, 85, 0.2)' : 'transparent',
            color: adminTab === 'clients' ? '#FF5555' : 'var(--text-muted)'
          }}
        >
          🚫 Bloqueados ({allBlockedClients.length})
        </button>
      </div>

      {/* CLIENTS TAB (TEMPORARY & PERMANENT BLOCKS) */}
      {adminTab === 'clients' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
            Gestión de Clientes Bloqueados (Temporales & Permanentes)
          </h4>

          {allBlockedClients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', background: 'var(--bg-dark)', borderRadius: '10px' }}>
              ✓ No hay ningún cliente bloqueado actualmente.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allBlockedClients.map(u => {
                const isPerm = u.blockedPermanent === true;
                return (
                  <div key={u.username} style={{ background: 'var(--bg-dark)', padding: '16px 18px', borderRadius: '10px', border: isPerm ? '1px solid #FF5555' : '1px solid #FFAA00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: isPerm ? '#FF5555' : '#FFAA00', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldAlert size={18} />
                        <span>@{u.username} ({u.phone})</span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '99px', background: isPerm ? '#FF5555' : '#FFAA00', color: '#0A0A0C', textTransform: 'uppercase', fontWeight: 800 }}>
                          {isPerm ? '🛑 Bloqueo Permanente' : '⏳ Temporal (1 Semana)'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        📌 <strong>Motivo:</strong> {u.blockReason || (isPerm ? 'Incumplimiento de términos' : '3 Cancelaciones acumuladas')}
                      </div>

                      {!isPerm && u.blockedUntil && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', marginTop: '2px' }}>
                          📅 Expira el: {new Date(u.blockedUntil).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <button onClick={() => handleUnblockClient(u.username)} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                      <Unlock size={14} />
                      <span>Desbloquear Cliente</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REPORTS TAB */}
      {adminTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{totalBookings}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Citas Totales</div>
            </div>
            <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#25D366' }}>{completedBookingsList.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Atendidas</div>
            </div>
            <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF5555' }}>{cancelledBookings}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Canceladas</div>
            </div>
            <div style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{usersDb.filter(u => u.role === 'client').length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clientes</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} />
                  <span>Cálculo de Ingresos Estimados (Reservas Web)</span>
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Basado en citas marcadas como completadas/atendidas.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={revBarberFilter}
                  onChange={e => setRevBarberFilter(e.target.value)}
                  style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8rem' }}
                >
                  <option value="all">Todos los Barberos</option>
                  <option value="maicol">Solo Maicol</option>
                  <option value="diego">Solo Diego</option>
                </select>

                <select
                  value={revPeriodFilter}
                  onChange={e => setRevPeriodFilter(e.target.value)}
                  style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8rem' }}
                >
                  <option value="all">Todo el Historial</option>
                  <option value="today">Solo Hoy</option>
                </select>
              </div>
            </div>

            <div style={{ background: 'rgba(197, 160, 89, 0.12)', border: '1px dashed var(--border-gold)', padding: '16px 20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Monto Estimado Generado:
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                  S/ {totalEstimatedRevenue} SOL
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                Citas Atendidas: <strong>{filteredCompletedBookings.length}</strong>
              </div>
            </div>

            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>Desglose por Servicio Reservado:</h5>
            {Object.keys(serviceBreakdown).length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No hay citas completadas en el filtro seleccionado.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {Object.entries(serviceBreakdown).map(([servName, data]) => (
                  <div key={servName} style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>{servName}</strong>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({data.count} atendidas)</span>
                    </div>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: 800 }}>S/ {data.total}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
              <Info size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Aviso de Negocio:</strong> Los pagos se abonan directamente a cada barbero en la barbería (efectivo / Yape). Esta cifra representa un <em>cálculo estimado basado en las citas agendadas por la web</em>. No incluye clientes atendidos de forma directa en el local sin reserva previa.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
            Agenda Completa del Negocio (Todos los Barberos)
          </h4>

          {userBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No hay reservas registradas.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userBookings.slice(0, 15).map(b => (
                <div key={b.id} style={{ background: 'var(--bg-dark)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {b.serviceName} ({b.servicePrice})
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      💈 <strong>Barbero:</strong> {b.barberName} | 👤 <strong>Cliente:</strong> @{b.username} | 📅 {b.date} {b.time}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '99px', fontWeight: 700, background: b.status === 'Confirmada' ? 'rgba(37,211,102,0.15)' : 'rgba(255,85,85,0.15)', color: b.status === 'Confirmada' ? '#25D366' : '#FF5555' }}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BARBERS TAB */}
      {adminTab === 'barbers' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
            Gestión de Barberos del Negocio
          </h4>

          <form onSubmit={handleCreateBarber} style={{ background: 'var(--bg-dark)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-gold)', marginBottom: '20px' }}>
            <h5 style={{ color: 'var(--gold-primary)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={16} />
              <span>Crear Nueva Cuenta de Barbero</span>
            </h5>

            {barberMsg && (
              <div style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid #25D366', color: '#25D366', padding: '10px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '12px' }}>
                {barberMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nombre Real</label>
                <input type="text" required placeholder="Ej: Carlos Silva" value={newBarberName} onChange={e => setNewBarberName(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Usuario</label>
                <input type="text" required placeholder="Ej: barber_carlos" value={newBarberUsername} onChange={e => setNewBarberUsername(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Teléfono Celular</label>
                <input type="tel" required placeholder="Ej: 987 000 111" value={newBarberPhone} onChange={e => setNewBarberPhone(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contraseña Temporal</label>
                <input type="text" required value={newBarberTempPass} onChange={e => setNewBarberTempPass(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              <Plus size={16} />
              <span>Registrar Barbero</span>
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {barberAccounts.map(b => (
              <div key={b.username} style={{ background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{b.name} (@{b.username})</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📱 {b.phone} | Status: {b.mustChangePassword ? '⚠️ Debe cambiar clave' : '✓ Activo'}</div>
                </div>
                {b.username !== 'barber_maicol' && (
                  <button onClick={() => handleDeleteBarber(b.username, b.barberId)} style={{ background: 'rgba(255,85,85,0.1)', border: '1px solid #FF5555', color: '#FF5555', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES TAB */}
      {adminTab === 'services' && (
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
            Editar Servicios & Precios en la Web (Soles S/)
          </h4>

          {editingServiceId ? (
            <form onSubmit={handleSaveService} style={{ background: 'var(--bg-dark)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-gold)', marginBottom: '20px' }}>
              <h5 style={{ color: 'var(--gold-primary)', fontWeight: 800, marginBottom: '10px' }}>Editar Servicio</h5>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nombre del Servicio</label>
                <input type="text" value={editServTitle} onChange={e => setEditServTitle(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precio (en S/)</label>
                <input type="text" value={editServPrice} onChange={e => setEditServPrice(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Descripción</label>
                <textarea rows="2" value={editServDesc} onChange={e => setEditServDesc(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setEditingServiceId(null)} className="btn btn-secondary" style={{ flex: 1, padding: '8px' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>Guardar en la Web</button>
              </div>
            </form>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {servicesDb.map(s => (
              <div key={s.id} style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{s.title} — <span style={{ color: 'var(--gold-primary)' }}>{s.price}</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.description}</div>
                </div>
                <button onClick={() => handleStartEditService(s)} style={{ background: 'rgba(197, 160, 89, 0.12)', border: '1px solid var(--border-gold)', color: 'var(--gold-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit3 size={14} />
                  <span>Editar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
