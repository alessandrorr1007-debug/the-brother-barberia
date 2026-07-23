import React from 'react';
import { Scissors, ArrowUp, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#070709', borderTop: '1px solid var(--border-subtle)', paddingTop: '60px', paddingBottom: '30px' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0A0C'
              }}>
                <Scissors size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.08em' }}>
                THE BROTHER
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Barbería boutique de autor. Tradición artesanal, cortes de precisión y ambiente exclusivo para el hombre de hoy.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              Enlaces Rápidos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <a href="#hero" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Inicio</a>
              <a href="#about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Sobre Nosotros</a>
              <a href="#barbers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Nuestros Barberos</a>
              <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Servicios y Precios</a>
              <a href="#gallery" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Galería de Fotos</a>
              <a href="#location" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ubicación y Contacto</a>
            </div>
          </div>

          {/* Contact Summary */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              Contacto Directo
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--gold-primary)" />
                <span>Av. Larco 742, Miraflores, Lima</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--gold-primary)" />
                <span>+51 987 654 321</span>
              </div>
              <div style={{ marginTop: '8px', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.82rem' }}>
                Lunes a Sábado: 9am – 9pm <br /> Domingo: 10am – 5pm
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>The Brother Barbería</strong>. Todos los derechos reservados.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(197, 160, 89, 0.1)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-primary)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Subir arriba</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
