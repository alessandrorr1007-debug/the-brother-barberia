import React from 'react';
import { Award, Scissors, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Scissors size={24} color="var(--gold-primary)" />,
      title: 'Oficio y Tradición',
      description: 'Dominamos las técnicas clásicas de la barbería y las adaptamos a tu estilo personal y tendencias actuales.'
    },
    {
      icon: <Award size={24} color="var(--gold-primary)" />,
      title: 'Detalle e Higiene',
      description: 'Esterilización rigurosa de herramientas, cortes limpios y perfilados de navaja de máxima precisión.'
    },
    {
      icon: <HeartHandshake size={24} color="var(--gold-primary)" />,
      title: 'Trato Personalizado',
      description: 'Analizamos la morfología de tu rostro y tu tipo de cabello para recomendarte el mejor acabado.'
    }
  ];

  return (
    <section id="about" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          
          {/* Text Content Column */}
          <div>
            <div className="section-tag">
              <Scissors size={14} />
              <span>Nuestra Historia</span>
            </div>

            <h2 className="section-title">
              PASIÓN POR EL OFICIO, <br />
              <span className="gradient-text-gold">RESPETO POR TU ESTILO</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              <strong>The Brother</strong> nace con la visión de Maicol, fundador y barbero principal, de crear un espacio donde el corte de cabello y el arreglo de barba vuelvan a ser un ritual de confianza y dedicación.
            </p>

            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.7' }}>
              Creemos en el trabajo bien hecho, sin prisas. Cada cliente que se sienta en nuestro sillón recibe una atención cercana, escuchando sus preferencias para entregar un resultado impecable que refleje su personalidad.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Atención directa por Maicol (fundador) y su equipo de confianza.',
                'Técnicas de corte clásico, degradados modernos y navaja tradicional.',
                'Ambiente cómodo, limpio y pensado para que te sientas a gusto.'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid var(--border-gold)'
            }}>
              <img
                src="/assets/lounge_vibe.jpg"
                alt="Ambiente The Brother Barbershop"
                style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 10, 12, 0.9) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                background: 'rgba(20, 20, 23, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ color: 'var(--gold-primary)', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>
                  "Tu estilo, en manos expertas."
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  — Maicol, Fundador de The Brother
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Values Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '64px'
        }}>
          {values.map((v, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px 24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
                {v.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {v.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
