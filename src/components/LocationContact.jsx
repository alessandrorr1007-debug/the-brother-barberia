import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, ExternalLink } from 'lucide-react';

export default function LocationContact() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', message: '' });
      setFormSent(false);
    }, 4000);
  };

  return (
    <section id="location" className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag" style={{ margin: '0 auto 14px auto' }}>
            <MapPin size={14} />
            <span>Encuéntranos</span>
          </div>
          <h2 className="section-title">
            UBICACIÓN Y <span className="gradient-text-gold">HORARIOS</span>
          </h2>
          <p className="section-subtitle">
            Visítanos en nuestro local. Contamos con ambiente climatizado y excelente atención.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start'
        }}>
          
          {/* Info Card */}
          <div className="glass-card" style={{ padding: '36px', background: 'var(--bg-dark)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin color="var(--gold-primary)" />
              <span>Información del Local</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ background: 'rgba(197, 160, 89, 0.12)', padding: '10px', borderRadius: '10px', color: 'var(--gold-primary)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>Dirección</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Av. Larco 742, Miraflores, Lima</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ background: 'rgba(197, 160, 89, 0.12)', padding: '10px', borderRadius: '10px', color: 'var(--gold-primary)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>Teléfono & WhatsApp</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+51 987 654 321</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ background: 'rgba(197, 160, 89, 0.12)', padding: '10px', borderRadius: '10px', color: 'var(--gold-primary)' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '6px' }}>Horario de Atención</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div>• <strong>Lunes a Sábado:</strong> 09:00 AM – 09:00 PM</div>
                    <div>• <strong>Domingos:</strong> 10:00 AM – 05:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Badges */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Síguenos:</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 14px', borderRadius: 'var(--radius-full)', color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span>@thebrother.barberia</span>
              </a>
            </div>
          </div>

          {/* Embedded Map & Direct Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Map Frame */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '240px',
              border: '1px solid var(--border-gold)',
              position: 'relative'
            }}>
              <iframe
                title="Mapa Ubicación The Brother"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.741260322283!2d-77.0305!3d-12.1215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA3JzE3LjQiUyA3N8KwMDEnNDkuOCJX!5e0!3m2!1ses!2spe!4v1625000000000!5m2!1ses!2spe"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
                allowFullScreen=""
                loading="lazy"
              />
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-primary)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Ver en Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Quick Contact Form */}
            <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-dark)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
                ¿Tienes alguna consulta?
              </h4>

              {formSent ? (
                <div style={{ padding: '16px', background: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', borderRadius: '8px', color: '#25D366', fontSize: '0.9rem', textAlign: 'center' }}>
                  ¡Mensaje enviado! Te responderemos a la brevedad.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Escribe tu mensaje..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      resize: 'none'
                    }}
                  />
                  <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                    <Send size={16} />
                    <span>Enviar Mensaje</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
