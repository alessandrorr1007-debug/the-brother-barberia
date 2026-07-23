import React, { useState, useEffect } from 'react';
import { UserCheck, Calendar, Award, Scissors } from 'lucide-react';

export default function Barbers({ onSelectBarber, customBarbers }) {
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    if (customBarbers && customBarbers.length > 0) {
      setTeamList(customBarbers);
    } else {
      const saved = localStorage.getItem('tb_barbers_db');
      if (saved) {
        setTeamList(JSON.parse(saved));
      } else {
        const defaultTeam = [
          {
            id: 'maicol',
            name: 'Maicol',
            nickname: 'Fundador & Barbero Principal',
            role: 'Dueño / Fundador',
            isOwner: true,
            experience: '8+ Años de Experiencia',
            image: '/assets/barber_owner.jpg',
            specialties: ['Corte Clásico', 'Afeitado Tradicional a Navaja', 'Asesoría de Imagen'],
            bio: 'Fundador y alma del negocio. Maicol transmite en cada corte su orgullo por el oficio, priorizando la atención personalizada y la confianza con cada cliente.'
          },
          {
            id: 'diego',
            name: 'Diego',
            nickname: 'Especialista en Fades',
            role: 'Barbero Senior',
            isOwner: false,
            experience: '5+ Años de Experiencia',
            image: '/assets/barber_senior.jpg',
            specialties: ['Skin Fade (Bajo, Medio, Alto)', 'Perfilado de Barba', 'Texturizados & Cerquillo'],
            bio: 'Apasionado por las líneas limpias y los degradados precisos. Diego destaca por su técnica en cortes urbanos modernos y acabados impecables.'
          }
        ];
        setTeamList(defaultTeam);
        localStorage.setItem('tb_barbers_db', JSON.stringify(defaultTeam));
      }
    }
  }, [customBarbers]);

  return (
    <section id="barbers" className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-tag" style={{ margin: '0 auto 14px auto' }}>
            <UserCheck size={14} />
            <span>Nuestro Equipo</span>
          </div>
          <h2 className="section-title">
            NUESTROS <span className="gradient-text-gold">BARBEROS</span>
          </h2>
          <p className="section-subtitle">
            Manos expertas a tu servicio. Elige a tu barbero de preferencia para tu próxima atención.
          </p>
        </div>

        {/* Barbers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          maxWidth: '1060px',
          margin: '0 auto'
        }}>
          {teamList.map((barber) => (
            <div
              key={barber.id}
              className="glass-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-dark)',
                border: barber.isOwner ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)'
              }}
            >
              {/* Owner Badge */}
              {barber.isOwner && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 5,
                  background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))',
                  color: '#0A0A0C',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                  Dueño & Fundador
                </div>
              )}

              {/* Image Container */}
              <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
                <img
                  src={barber.image || '/assets/barber_senior.jpg'}
                  alt={barber.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, var(--bg-dark) 0%, transparent 60%)'
                }} />
              </div>

              {/* Details Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {barber.name}
                  </h3>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '10px' }}>
                  {barber.nickname || barber.role}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <Award size={16} color="var(--gold-primary)" />
                  <span>{barber.experience}</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px', lineHeight: 1.6 }}>
                  {barber.bio}
                </p>

                {/* Specialties tags */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                    Especialidades:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {barber.specialties.map((spec, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: 'var(--text-main)'
                        }}
                      >
                        <Scissors size={10} style={{ marginRight: '4px', display: 'inline' }} color="var(--gold-primary)" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct CTA */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => onSelectBarber(barber.id)}
                >
                  <Calendar size={18} />
                  <span>Reservar con {barber.name}</span>
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
