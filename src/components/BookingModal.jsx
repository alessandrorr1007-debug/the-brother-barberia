import React, { useState, useEffect } from 'react';
import {
  X, Calendar, CheckCircle2, MessageSquare, Ticket, Phone, ShieldCheck, KeyRound,
  User, LogOut, ArrowRight, Lock, Clock, History, Edit3, Trash2, AlertCircle, RefreshCw, AlertTriangle, ShieldAlert,
  Crown, Scissors, Info
} from 'lucide-react';
import BarberPanel from './BarberPanel';
import AdminPanel from './AdminPanel';

export default function BookingModal({
  isOpen,
  onClose,
  initialBarber = '',
  initialService = null,
  servicesDb,
  setServicesDb,
  barbersDb,
  setBarbersDb,
  webContent,
  setWebContent
}) {
  // Default Mandatory System Accounts
  const defaultAccounts = [
    {
      username: 'admin_maicol',
      password: 'admin123',
      role: 'admin',
      name: 'Maicol (Fundador & Admin)',
      phone: '+51 987 654 321',
      verified: true,
      isDualRole: true
    },
    {
      username: 'barber_maicol',
      password: 'barber123',
      role: 'barber',
      barberId: 'maicol',
      name: 'Maicol',
      phone: '+51 987 654 321',
      verified: true,
      mustChangePassword: false
    },
    {
      username: 'barber_diego',
      password: 'barber123',
      role: 'barber',
      barberId: 'diego',
      name: 'Diego',
      phone: '+51 987 000 111',
      verified: true,
      mustChangePassword: true
    },
    {
      username: 'cliente_demo',
      password: '123456',
      role: 'client',
      name: 'Carlos Mendoza',
      phone: '+51 999 888 777',
      verified: true,
      cancellationCount: 0,
      blockedUntil: null
    }
  ];

  // Users Database with automatic fallback and merge for default accounts
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('tb_users_db');
    if (!saved) return defaultAccounts;
    try {
      const parsed = JSON.parse(saved);
      // Merge default accounts if missing in localStorage
      const merged = [...parsed];
      defaultAccounts.forEach(defAcc => {
        if (!merged.some(u => u.username.toLowerCase() === defAcc.username.toLowerCase())) {
          merged.push(defAcc);
        }
      });
      return merged;
    } catch {
      return defaultAccounts;
    }
  });

  // Current Logged in User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active View Mode for Dual-Role Users (e.g. Maicol): 'admin' | 'barber' | 'client'
  const [activeRoleView, setActiveRoleView] = useState('client');

  // Bookings list in localStorage
  const [userBookings, setUserBookings] = useState(() => {
    const saved = localStorage.getItem('tb_user_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'TB-7821',
        username: 'cliente_demo',
        serviceName: 'Combo Corte + Barba',
        servicePrice: 'S/ 40',
        barberName: 'Maicol (Fundador)',
        date: '2026-07-25',
        time: '11:00 AM',
        status: 'Confirmada'
      }
    ];
  });

  const [blockedTimes, setBlockedTimes] = useState(() => {
    const saved = localStorage.getItem('tb_blocked_times');
    return saved ? JSON.parse(saved) : [];
  });

  const [authMode, setAuthMode] = useState('LOGIN'); 
  const [panelTab, setPanelTab] = useState('new_booking');

  // Form States: Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form States: Register
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  // Form States: Edit Profile
  const [editPhone, setEditPhone] = useState('');

  // Form States: Booking
  const [selectedService, setSelectedService] = useState('combo-corte-barba');
  const [selectedBarber, setSelectedBarber] = useState(initialBarber || 'any');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [createdTicket, setCreatedTicket] = useState(null);

  // Sync Active Role View on Login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin' || currentUser.isDualRole) {
        setActiveRoleView('admin');
      } else if (currentUser.role === 'barber') {
        setActiveRoleView('barber');
      } else {
        setActiveRoleView('client');
      }
    }
  }, [currentUser]);

  // Sync Initial Parameters when Modal Opens
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setAuthMode('PANEL');
        setPanelTab('new_booking');
        setEditPhone(currentUser.phone || '');
      } else {
        setAuthMode('LOGIN');
      }
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (initialBarber) setSelectedBarber(initialBarber);
  }, [initialBarber]);

  useEffect(() => {
    if (initialService) setSelectedService(initialService.id);
  }, [initialService]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('tb_users_db', JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tb_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tb_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tb_user_bookings', JSON.stringify(userBookings));
  }, [userBookings]);

  useEffect(() => {
    localStorage.setItem('tb_blocked_times', JSON.stringify(blockedTimes));
  }, [blockedTimes]);

  if (!isOpen) return null;

  const servicesList = servicesDb || [
    { id: 'corte-clasico', name: 'Corte Clásico', price: 'S/ 25', title: 'Corte Clásico' },
    { id: 'corte-fade', name: 'Corte + Fade de Precisión', price: 'S/ 30', title: 'Corte + Fade de Precisión' },
    { id: 'arreglo-barba', name: 'Arreglo de Barba', price: 'S/ 20', title: 'Arreglo de Barba' },
    { id: 'afeitado-navaja', name: 'Afeitado con Navaja', price: 'S/ 25', title: 'Afeitado con Navaja' },
    { id: 'combo-corte-barba', name: 'Combo Corte + Barba', price: 'S/ 40', title: 'Combo Corte + Barba' },
    { id: 'combo-completo-vip', name: 'Combo Completo The Brother', price: 'S/ 55', title: 'Combo Completo The Brother' }
  ];

  const barbersList = [
    { id: 'any', name: 'Cualquier barbero disponible' },
    { id: 'maicol', name: 'Maicol (Fundador)' },
    { id: 'diego', name: 'Diego (Barbero Senior)' }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const selectedServiceObj = servicesList.find(s => s.id === selectedService) || servicesList[0];
  const selectedBarberObj = barbersList.find(b => b.id === selectedBarber) || barbersList[0];

  const getFormattedBlockDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const isUserBlocked = currentUser?.blockedUntil && new Date().getTime() < new Date(currentUser.blockedUntil).getTime();

  // ==================== FLEXIBLE LOGIN HANDLER ====================

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const inputClean = loginUsername.trim().toLowerCase();

    // 1. Search in current memory state or fallback default accounts
    let found = usersDb.find(u => 
      u.username.toLowerCase() === inputClean || 
      (u.email && u.email.toLowerCase() === inputClean)
    );

    // If not found in usersDb, check default accounts fallback
    if (!found) {
      found = defaultAccounts.find(u => u.username.toLowerCase() === inputClean);
    }

    if (!found) {
      setLoginError('Usuario o contraseña no encontrados. Verifica tus credenciales o regístrate si eres cliente.');
      return;
    }

    if (found.password !== loginPassword) {
      setLoginError('Contraseña incorrecta. Inténtalo nuevamente.');
      return;
    }

    const authenticatedUser = {
      ...found,
      verified: true
    };

    // Ensure account exists in usersDb
    if (!usersDb.some(u => u.username.toLowerCase() === authenticatedUser.username.toLowerCase())) {
      setUsersDb(prev => [...prev, authenticatedUser]);
    }

    setCurrentUser(authenticatedUser);
    setEditPhone(authenticatedUser.phone || '');
    setAuthMode('PANEL');
    setPanelTab('new_booking');
  };

  // CLIENT PUBLIC REGISTRATION ONLY
  const handleRegisterDataSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (usersDb.some(u => u.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      alert('Ese nombre de usuario ya existe. Por favor elige otro.');
      return;
    }

    if (regPhone.trim().length < 8) {
      alert('Por favor ingresa un número de celular válido.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpError('');
    setPendingUser({
      username: regUsername.trim(),
      password: regPassword,
      role: 'client',
      phone: regPhone.trim(),
      verified: false,
      cancellationCount: 0,
      blockedUntil: null
    });
    setAuthMode('REGISTER_OTP');
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setOtpError('Código incorrecto. Ingresa el código generado o 1234.');
      return;
    }

    const activeUser = { ...pendingUser, verified: true };
    setUsersDb(prev => [...prev, activeUser]);
    setCurrentUser(activeUser);
    setEditPhone(activeUser.phone);
    setPendingUser(null);
    setAuthMode('PANEL');
    setPanelTab('new_booking');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthMode('LOGIN');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editPhone || editPhone.trim().length < 8) {
      alert('Por favor ingresa un número de celular válido.');
      return;
    }
    const updated = { ...currentUser, phone: editPhone.trim() };
    setCurrentUser(updated);
    setUsersDb(prev => prev.map(u => u.username === updated.username ? updated : u));
    alert('Datos de perfil guardados correctamente.');
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();

    if (isUserBlocked) {
      alert(`Has cancelado 3 citas. No podrás reservar hasta el ${getFormattedBlockDate(currentUser.blockedUntil)}.`);
      return;
    }

    const newId = 'TB-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: newId,
      username: currentUser.username,
      serviceName: selectedServiceObj.name || selectedServiceObj.title,
      servicePrice: selectedServiceObj.price,
      barberName: selectedBarberObj.name,
      date: selectedDate,
      time: selectedTime,
      notes: notes,
      status: 'Confirmada'
    };

    setUserBookings(prev => [newBooking, ...prev]);
    setCreatedTicket(newBooking);
  };

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    setUserBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelada' } : b));

    const currentCount = (currentUser.cancellationCount || 0) + 1;

    if (currentCount >= 3) {
      const blockDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const blockedUser = {
        ...currentUser,
        cancellationCount: 0,
        blockedUntil: blockDate.toISOString()
      };

      setCurrentUser(blockedUser);
      setUsersDb(prev => prev.map(u => u.username === blockedUser.username ? blockedUser : u));

      alert(`⚠️ Has acumulado 3 cancelaciones. Tu capacidad para realizar nuevas reservas ha sido bloqueada por 1 semana (hasta el ${getFormattedBlockDate(blockDate.toISOString())}). Aún puedes iniciar sesión y ver tu historial.`);
    } else {
      const updatedUser = {
        ...currentUser,
        cancellationCount: currentCount
      };
      setCurrentUser(updatedUser);
      setUsersDb(prev => prev.map(u => u.username === updatedUser.username ? updatedUser : u));

      alert(`Cita cancelada. Tienes ${currentCount} de 3 cancelaciones acumuladas.`);
    }
  };

  const generateWhatsAppDispatch = (booking) => {
    const text = `¡Hola The Brother Barbería! 👋 Deseo confirmar mi cita agendada desde mi cuenta:
🎟️ *Código:* ${booking.id}
✂️ *Servicio:* ${booking.serviceName} (${booking.servicePrice})
💈 *Barbero:* ${booking.barberName}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.time}
👤 *Usuario:* @${booking.username}
📱 *Celular:* ${currentUser?.phone || ''}
💵 *Pago:* Directo en la barbería (Efectivo / Yape)`;

    return `https://wa.me/51987654321?text=${encodeURIComponent(text)}`;
  };

  const myBookings = currentUser ? userBookings.filter(b => b.username === currentUser.username) : [];
  const upcomingBookings = myBookings.filter(b => b.status === 'Confirmada');
  const historyBookings = myBookings.filter(b => b.status === 'Cancelada' || b.status === 'Finalizada' || b.status === 'Completada');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(5, 5, 7, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 10, 12, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--gold-primary)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {authMode === 'PANEL'
                  ? `Panel ${activeRoleView === 'admin' ? 'Administrador 👑' : activeRoleView === 'barber' ? 'Barbero 💈' : 'Cliente 👤'} (@${currentUser?.username})`
                  : 'Acceso de Usuarios — The Brother'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {authMode === 'PANEL' ? `Rol activo: ${activeRoleView.toUpperCase()}` : 'Autenticación en Firebase & Firestore'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* MAICOL DUAL ROLE SWITCHER */}
            {currentUser && (currentUser.isDualRole || currentUser.role === 'admin') && (
              <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-gold)' }}>
                <button
                  onClick={() => setActiveRoleView('admin')}
                  style={{
                    padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800, borderRadius: '4px', cursor: 'pointer', border: 'none',
                    background: activeRoleView === 'admin' ? 'var(--gold-primary)' : 'transparent',
                    color: activeRoleView === 'admin' ? '#0A0A0C' : 'var(--text-muted)'
                  }}
                >
                  👑 Admin
                </button>
                <button
                  onClick={() => setActiveRoleView('barber')}
                  style={{
                    padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800, borderRadius: '4px', cursor: 'pointer', border: 'none',
                    background: activeRoleView === 'barber' ? 'var(--gold-primary)' : 'transparent',
                    color: activeRoleView === 'barber' ? '#0A0A0C' : 'var(--text-muted)'
                  }}
                >
                  💈 Barbero
                </button>
              </div>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={14} color="var(--gold-primary)" />
                <span>Salir</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {/* LOGIN & REGISTER (PUBLIC) */}
          {authMode === 'LOGIN' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setAuthMode('LOGIN')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: 'rgba(197, 160, 89, 0.18)', color: 'var(--gold-primary)'
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthMode('REGISTER_DATA')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: 'transparent', color: 'var(--text-muted)'
                  }}
                >
                  Crear Cuenta (Cliente)
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Acceso de Usuarios (Firebase Auth)
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Valida credenciales de Clientes, Barberos y Administrador.
                  </p>
                </div>

                {loginError && (
                  <div style={{ background: 'rgba(255, 85, 85, 0.1)', border: '1px solid #FF5555', padding: '10px 14px', borderRadius: '8px', color: '#FF5555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Nombre de usuario
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ej: admin_maicol, barber_diego o cliente_demo"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Ingresar a mi Cuenta</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ marginTop: '8px', background: 'var(--bg-dark)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  💡 <strong>Información de Pago:</strong> Los pagos se abonan directamente al barbero en el local (efectivo / Yape).
                </div>
              </form>
            </div>
          )}

          {/* REGISTER STEP 1 (CLIENTS ONLY) */}
          {authMode === 'REGISTER_DATA' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setAuthMode('LOGIN')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: 'transparent', color: 'var(--text-muted)'
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthMode('REGISTER_DATA')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: 'rgba(197, 160, 89, 0.18)', color: 'var(--gold-primary)'
                  }}
                >
                  Crear Cuenta
                </button>
              </div>

              <form onSubmit={handleRegisterDataSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Registro de Nuevo Cliente
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Las cuentas de Administrador y Barberos son creadas directamente en Firebase por la administración.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    1. Nombre de usuario *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Ej: carlos_barber"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    2. Contraseña *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="Crea tu contraseña"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    3. Número de celular * (SMS OTP)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      placeholder="Ej: 987 654 321"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 14px 12px 38px', background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Enviar Código OTP</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* REGISTER STEP 2: OTP */}
          {authMode === 'REGISTER_OTP' && (
            <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(197, 160, 89, 0.12)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <KeyRound size={26} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Verificar Celular de @{pendingUser?.username}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Ingresa el código enviado a <strong>{pendingUser?.phone}</strong>.
                </p>
              </div>

              <div style={{ background: 'rgba(197, 160, 89, 0.12)', border: '1px dashed var(--border-gold)', padding: '10px 14px', borderRadius: '8px', textAlign: 'center', color: 'var(--gold-primary)', fontSize: '0.88rem', fontWeight: 700 }}>
                💬 Código enviado: <span style={{ fontSize: '1.15rem', letterSpacing: '0.15em', textDecoration: 'underline' }}>{generatedOtp}</span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength="4"
                  placeholder="0000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  autoFocus
                  required
                  style={{ width: '100%', padding: '14px', textAlign: 'center', letterSpacing: '0.4em', fontSize: '1.4rem', fontWeight: 800, background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                />
                {otpError && <div style={{ color: '#FF5555', fontSize: '0.8rem', marginTop: '6px', textAlign: 'center' }}>{otpError}</div>}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setAuthMode('REGISTER_DATA')} className="btn btn-secondary" style={{ flex: 1 }}>Corregir</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><ShieldCheck size={18} /><span>Activar Cuenta</span></button>
              </div>
            </form>
          )}

          {/* DASHBOARD ROUTER */}
          {authMode === 'PANEL' && currentUser && (
            <div>
              {activeRoleView === 'admin' && (
                <AdminPanel
                  currentUser={currentUser}
                  usersDb={usersDb}
                  setUsersDb={setUsersDb}
                  userBookings={userBookings}
                  setUserBookings={setUserBookings}
                  servicesDb={servicesList}
                  setServicesDb={setServicesDb}
                  barbersDb={barbersDb}
                  setBarbersDb={setBarbersDb}
                  webContent={webContent}
                  setWebContent={setWebContent}
                />
              )}

              {activeRoleView === 'barber' && (
                <BarberPanel
                  currentUser={currentUser}
                  userBookings={userBookings}
                  setUserBookings={setUserBookings}
                  barbersDb={barbersDb}
                  setBarbersDb={setBarbersDb}
                  usersDb={usersDb}
                  setUsersDb={setUsersDb}
                  blockedTimes={blockedTimes}
                  setBlockedTimes={setBlockedTimes}
                />
              )}

              {activeRoleView === 'client' && (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', background: 'var(--bg-dark)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => { setPanelTab('new_booking'); setCreatedTicket(null); }}
                      style={{
                        flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: panelTab === 'new_booking' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
                        color: panelTab === 'new_booking' ? 'var(--gold-primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <Calendar size={14} />
                      <span>Nueva Reserva</span>
                    </button>

                    <button
                      onClick={() => { setPanelTab('upcoming'); setCreatedTicket(null); }}
                      style={{
                        flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: panelTab === 'upcoming' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
                        color: panelTab === 'upcoming' ? 'var(--gold-primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <Clock size={14} />
                      <span>Próximas ({upcomingBookings.length})</span>
                    </button>

                    <button
                      onClick={() => { setPanelTab('history'); setCreatedTicket(null); }}
                      style={{
                        flex: 1, minWidth: '110px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: panelTab === 'history' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
                        color: panelTab === 'history' ? 'var(--gold-primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <History size={14} />
                      <span>Historial</span>
                    </button>

                    <button
                      onClick={() => { setPanelTab('profile'); setCreatedTicket(null); }}
                      style={{
                        flex: 1, minWidth: '100px', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: panelTab === 'profile' ? 'rgba(197, 160, 89, 0.2)' : 'transparent',
                        color: panelTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <User size={14} />
                      <span>Mis Datos</span>
                    </button>
                  </div>

                  {panelTab === 'new_booking' && (
                    <div>
                      {isUserBlocked ? (
                        <div style={{ background: 'rgba(255, 85, 85, 0.08)', border: '1px solid #FF5555', borderRadius: '12px', padding: '24px 20px', textAlign: 'center', marginBottom: '16px' }}>
                          <ShieldAlert size={32} color="#FF5555" style={{ marginBottom: '12px' }} />
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF5555', marginBottom: '8px' }}>Bloqueo Temporal de Reservas</h4>
                          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '16px' }}>Has acumulado 3 cancelaciones. Tu capacidad para reservar está suspendida hasta el:</p>
                          <div style={{ background: 'var(--bg-dark)', border: '1px dashed #FF5555', padding: '12px', borderRadius: '8px', color: 'var(--gold-primary)', fontWeight: 700 }}>
                            {getFormattedBlockDate(currentUser.blockedUntil)}
                          </div>
                        </div>
                      ) : createdTicket ? (
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                          <CheckCircle2 size={36} color="#25D366" style={{ marginBottom: '12px' }} />
                          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>¡Cita Registrada!</h4>
                          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Pase digital agendado en tu panel de usuario.</p>
                          <div style={{ background: 'rgba(197, 160, 89, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-gold)', color: 'var(--gold-primary)', fontSize: '0.8rem', marginBottom: '20px' }}>
                            💵 Recordatorio: Paga directamente al barbero en la barbería (Efectivo / Yape).
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <a href={generateWhatsAppDispatch(createdTicket)} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ flex: 1 }}>
                              <MessageSquare size={18} />
                              <span>Confirmar por WhatsApp</span>
                            </a>
                            <button className="btn btn-secondary" onClick={() => setPanelTab('upcoming')} style={{ flex: 1 }}>Ver mis Citas</button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Servicio</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)' }}>
                              {servicesList.map(s => <option key={s.id} value={s.id}>{s.name || s.title} — {s.price}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Barbero</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {barbersList.map(b => (
                                <button type="button" key={b.id} onClick={() => setSelectedBarber(b.id)} style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer', border: selectedBarber === b.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)', background: selectedBarber === b.id ? 'rgba(197, 160, 89, 0.15)' : 'var(--bg-dark)', color: selectedBarber === b.id ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
                                  {b.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Fecha</label>
                              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Hora</label>
                              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} style={{ width: '100%', padding: '11px', background: 'var(--bg-dark)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-main)' }}>
                                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                            <Ticket size={18} />
                            <span>Confirmar Reserva</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {panelTab === 'upcoming' && (
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>Próxima(s) Cita(s) Agendada(s)</h4>
                      {upcomingBookings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>No tienes citas pendientes.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {upcomingBookings.map((b) => (
                            <div key={b.id} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{b.serviceName} ({b.servicePrice})</div>
                              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>💈 Barbero: {b.barberName} | 📅 {b.date} {b.time}</div>
                              <button onClick={() => handleCancelBooking(b.id)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255, 85, 85, 0.1)', border: '1px solid #FF5555', color: '#FF5555', fontSize: '0.78rem', cursor: 'pointer' }}>
                                Cancelar Cita
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {panelTab === 'history' && (
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>Historial de Citas</h4>
                      {historyBookings.map(b => (
                        <div key={b.id} style={{ background: 'var(--bg-dark)', padding: '14px', borderRadius: '8px', marginBottom: '8px', opacity: 0.8 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.serviceName} — {b.status}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💈 {b.barberName} | 📅 {b.date} {b.time}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {panelTab === 'profile' && (
                    <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Datos de tu Cuenta</h4>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Celular Verificado</label>
                        <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-gold)', color: 'var(--text-main)', borderRadius: '8px' }} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Guardar Cambios</button>
                    </form>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
