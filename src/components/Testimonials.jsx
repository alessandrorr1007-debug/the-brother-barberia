import React from 'react';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      tag: 'Cliente Frecuente',
      service: 'Combo Corte + Barba',
      stars: 5,
      comment: 'El degradado que me hace Diego queda siempre limpio e impecable. La atención de Maicol es genial y el ambiente del local hace que valga totalmente la pena.',
      date: 'Hace 3 días'
    },
    {
      id: 2,
      name: 'Alejandro Restrepo',
      tag: 'Cliente Frecuente',
      service: 'Afeitado con Navaja',
      stars: 5,
      comment: 'Maicol es un capo con la navaja. El ritual con toalla caliente me deja la piel super fresca. Definitivamente mi barbería de confianza.',
      date: 'Hace 1 semana'
    },
    {
      id: 3,
      name: 'David Jaramillo',
      tag: 'Cliente Verificado',
      service: 'Corte Clásico',
      stars: 5,
      comment: 'Excelente atención y puntualidad con el sistema de reservas por WhatsApp. Se nota la dedicación y el orgullo por el trabajo en cada detalle.',
      date: 'Hace 2 semanas'
    },
    {
      id: 4,
      name: 'Santiago Morales',
      tag: 'Cliente Verificado',
      service: 'Corte + Fade de Precisión',
      stars: 5,
      comment: 'Me asesoraron de forma honesta con el estilo que mejor le iba a mi rostro. Quedé súper satisfecho con el resultado.',
      date: 'Hace 3 semanas'
    }
  ];

  return (
    <section id="testimonials" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag" style={{ margin: '0 auto 14px auto' }}>
            <MessageSquareHeart size={14} />
            <span>Testimonios</span>
          </div>
          <h2 className="section-title">
            LO QUE DICEN NUESTROS <span className="gradient-text-gold">CLIENTES</span>
          </h2>
          <p className="section-subtitle">
            La satisfacción de quienes nos visitan es nuestro mejor respaldo.
          </p>
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <Quote
                size={36}
                color="var(--gold-primary)"
                style={{ opacity: 0.2, position: 'absolute', top: '20px', right: '20px' }}
              />

              <div>
                {/* Star rating */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} size={16} color="var(--gold-primary)" fill="var(--gold-primary)" />
                  ))}
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {rev.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gold-primary)' }}>
                    {rev.service}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {rev.date}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
