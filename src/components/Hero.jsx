import React from 'react';
import { Calendar, ShieldCheck, Scissors, Award, Clock } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-dark)',
        overflow: 'hidden',
        paddingTop: '80px'
      }}
    >
      {/* Editorial Background Image with Gradient Mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/hero_barbershop.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.38,
          transform: 'scale(1.02)'
        }}
      />

      {/* Dark Vignette and Overlay Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 60% 40%, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.95) 85%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to top, var(--bg-dark), transparent)'
        }}
      />

      {/* Hero Content */}
      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '40px 24px' }}>
        <div style={{ maxWidth: '780px' }} className="animate-fade-in-up">
          
          {/* Badge */}
          <div className="section-tag" style={{ marginBottom: '20px' }}>
            <Scissors size={14} />
            <span>Barbería Boutique • Miraflores</span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              marginBottom: '22px'
            }}
          >
            ESTILO, TRADICIÓN Y <br />
            <span className="gradient-text-gold">ACTITUD MASCULINA</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '620px',
              marginBottom: '36px',
              lineHeight: 1.65,
              fontWeight: 400
            }}
          >
            Un ambiente clásico-contemporáneo donde el oficio, el detalle y la confianza se encuentran. Cortes de precisión, fades impecables y afeitado a navaja por Maicol y su equipo.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '48px' }}>
            <button className="btn btn-primary" onClick={onOpenBooking} style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              <Calendar size={20} />
              <span>Reserva tu Cita</span>
            </button>

            <a href="#services" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
              <span>Ver Servicios & Precios</span>
            </a>
          </div>

          {/* Feature Badges Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            maxWidth: '660px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Fundador Maicol</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Atención Personalizada</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Precios Reales</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cortes desde S/ 25</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
