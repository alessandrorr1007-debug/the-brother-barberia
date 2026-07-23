import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'cuts',
      title: 'Low Skin Fade & Line Up',
      image: '/assets/cut_fade.jpg',
      tag: 'Corte Degradado'
    },
    {
      id: 2,
      category: 'beard',
      title: 'Ritual de Barba a Navaja',
      image: '/assets/beard_trim.jpg',
      tag: 'Arreglo de Barba'
    },
    {
      id: 3,
      category: 'cuts',
      title: 'Corte Clásico & Perfilado',
      image: '/assets/classic_cut.jpg',
      tag: 'Corte Clásico'
    },
    {
      id: 4,
      category: 'local',
      title: 'Lounge Masculino & Sillones de Cuero',
      image: '/assets/lounge_vibe.jpg',
      tag: 'Instalaciones'
    },
    {
      id: 5,
      category: 'local',
      title: 'Estación de Barbería & Ambiente',
      image: '/assets/hero_barbershop.jpg',
      tag: 'Ambiente'
    },
    {
      id: 6,
      category: 'local',
      title: 'Maicol en Acción',
      image: '/assets/barber_owner.jpg',
      tag: 'Nuestros Barberos'
    }
  ];

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  return (
    <section id="gallery" className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag" style={{ margin: '0 auto 14px auto' }}>
            <Camera size={14} />
            <span>Nuestra Galería</span>
          </div>
          <h2 className="section-title">
            TRABAJOS Y <span className="gradient-text-gold">ATMÓSFERA</span>
          </h2>
          <p className="section-subtitle">
            Explora el acabado en nuestros cortes, arreglos de barba y el ambiente de nuestro local.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'cuts', label: 'Cortes' },
            { id: 'beard', label: 'Barba' },
            { id: 'local', label: 'El Local' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                border: filter === tab.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: filter === tab.id ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                color: filter === tab.id ? 'var(--gold-primary)' : 'var(--text-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                height: '280px',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
              />
              
              {/* Dark Overlay with Tag */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 10, 12, 0.85) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
                pointerEvents: 'none'
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--gold-primary)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px'
                }}>
                  {item.tag}
                </span>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <button
            onClick={() => setActiveImage(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={32} />
          </button>

          <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage.image}
              alt={activeImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                border: '1px solid var(--border-gold)'
              }}
            />
            <div style={{ marginTop: '16px', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 700 }}>
              {activeImage.title}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
