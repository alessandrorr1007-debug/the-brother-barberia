import React, { useState, useEffect } from 'react';
import { Scissors, Menu, X, Calendar, Phone, UserCheck, User } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync current logged in user from localStorage
  useEffect(() => {
    const checkAccount = () => {
      const saved = localStorage.getItem('tb_current_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      } else {
        setCurrentUser(null);
      }
    };
    checkAccount();

    const interval = setInterval(checkAccount, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Barberos', href: '#barbers' },
    { name: 'Servicios', href: '#services' },
    { name: 'Galería', href: '#gallery' },
    { name: 'Ubicación', href: '#location' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0A0C',
            boxShadow: '0 0 15px var(--gold-glow)'
          }}>
            <Scissors size={22} style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--text-main)',
              lineHeight: 1
            }}>
              THE BROTHER
            </span>
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              color: 'var(--gold-primary)',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              Barbería Boutique
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'var(--transition-smooth)',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--gold-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-actions">
          <a
            href="tel:+51987654321"
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Phone size={15} color="var(--gold-primary)" />
            +51 987 654 321
          </a>

          {currentUser ? (
            <button
              onClick={() => onOpenBooking()}
              style={{
                background: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold-primary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <UserCheck size={16} />
              <span>@{currentUser.username}</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenBooking()}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={15} color="var(--gold-primary)" />
              <span>Ingresar</span>
            </button>
          )}

          <button className="btn btn-primary" onClick={() => onOpenBooking()}>
            <Calendar size={18} />
            <span>Reservar Cita</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-label="Abrir menú"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {mobileMenuOpen ? <X size={28} color="var(--gold-primary)" /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 70px)',
          background: 'rgba(10, 10, 12, 0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 999
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              {link.name}
            </a>
          ))}
          <div style={{ height: '1px', width: '120px', background: 'var(--border-subtle)', margin: '12px 0' }} />

          {currentUser ? (
            <div style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', fontWeight: 700 }}>
              Sesión iniciada: @{currentUser.username}
            </div>
          ) : null}

          <button
            className="btn btn-primary"
            style={{ width: '80%', maxWidth: '280px' }}
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
          >
            <Calendar size={18} />
            <span>{currentUser ? 'Mi Panel / Citas' : 'Ingresar / Reservar'}</span>
          </button>
        </div>
      )}

      {/* Inject CSS responsive overrides */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
