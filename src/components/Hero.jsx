import React from 'react';
import { Calendar, ChevronDown, ShieldCheck } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '110px',
        paddingBottom: '70px',
        backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 12, 0.78), rgba(10, 10, 12, 0.95)), url('/assets/hero_barbershop.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient radial glow */}
      <div style={{
        position: 'absolute',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.12) 0%, rgba(0,0,0,0) 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        
        {/* Tagline Badge */}
        <div className="section-tag animate-fade-in" style={{ display: 'inline-flex', margin: '0 auto 20px auto' }}>
          <ShieldCheck size={16} />
          <span>Barbería Boutique & Estilo Masculino</span>
        </div>

        {/* Main Title */}
        <h1
          className="section-title animate-fade-in"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.6rem)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            maxWidth: '920px',
            margin: '0 auto 20px auto',
            lineHeight: 1.08
          }}
        >
          ESTILO, TRADICIÓN Y <span className="gradient-text-gold">ACTITUD</span>
        </h1>

        {/* Subtitle */}
        <p
          className="section-subtitle animate-fade-in"
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}
        >
          Tu estilo en manos expertas. Oficio artesanal, corte de precisión y trato personalizado en un ambiente exclusivo.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}
        >
          <button className="btn btn-primary pulse-glow" onClick={() => onOpenBooking()}>
            <Calendar size={20} />
            <span>Reserva tu Cita</span>
          </button>
          <a href="#services" className="btn btn-secondary">
            <span>Ver Servicios y Precios</span>
          </a>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '50px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ChevronDown size={28} className="animate-bounce" />
        </a>

      </div>
    </section>
  );
}
