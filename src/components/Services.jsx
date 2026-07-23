import React, { useState, useEffect } from 'react';
import { Clock, Scissors, Sparkles } from 'lucide-react';

export default function Services({ onSelectService, customServices }) {
  const [activeTab, setActiveTab] = useState('all');
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    if (customServices && customServices.length > 0) {
      setServicesList(customServices);
    } else {
      const saved = localStorage.getItem('tb_services_db');
      if (saved) {
        setServicesList(JSON.parse(saved));
      } else {
        const defaultServices = [
          {
            id: 'corte-clasico',
            category: 'cuts',
            title: 'Corte Clásico',
            price: 'S/ 25',
            duration: '30 min',
            isPopular: false,
            description: 'Corte tradicional a tijera y máquina con asesoría de estilo, lavado capilar y peinado final.'
          },
          {
            id: 'corte-fade',
            category: 'cuts',
            title: 'Corte + Fade de Precisión',
            price: 'S/ 30',
            duration: '35 min',
            isPopular: true,
            description: 'Degradado limpio (Low, Mid o High Fade) con delineado a navaja en contornos y acabado texturizado.'
          },
          {
            id: 'arreglo-barba',
            category: 'beard',
            title: 'Arreglo de Barba',
            price: 'S/ 20',
            duration: '20 min',
            isPopular: false,
            description: 'Recorte de volumen, diseño de líneas según el rostro, hidratación y perfilado preciso con navaja.'
          },
          {
            id: 'afeitado-navaja',
            category: 'beard',
            title: 'Afeitado con Navaja',
            price: 'S/ 25',
            duration: '25 min',
            isPopular: false,
            description: 'Afeitado tradicional completo con espuma ablandadora, toalla caliente y bálsamo reconfortante.'
          },
          {
            id: 'combo-corte-barba',
            category: 'combos',
            title: 'Combo Corte + Barba',
            price: 'S/ 40',
            badge: 'Recomendado',
            duration: '50 min',
            isPopular: true,
            description: 'Corte de cabello a elección (clásico o fade) más ritual completo de arreglo y perfilado de barba.'
          },
          {
            id: 'combo-completo-vip',
            category: 'combos',
            title: 'Combo Completo The Brother',
            price: 'S/ 55',
            badge: 'Servicio Integral',
            duration: '60 min',
            isPopular: false,
            description: 'Corte + Fade de precisión, arreglo de barba a navaja, exfoliación facial y lavado capilar relajante.'
          }
        ];
        setServicesList(defaultServices);
        localStorage.setItem('tb_services_db', JSON.stringify(defaultServices));
      }
    }
  }, [customServices]);

  const categories = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'cuts', label: 'Cortes' },
    { id: 'beard', label: 'Barba' },
    { id: 'combos', label: 'Combos' }
  ];

  const filteredServices = activeTab === 'all'
    ? servicesList
    : servicesList.filter(s => s.category === activeTab || activeTab === 'all');

  return (
    <section id="services" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ margin: '0 auto 14px auto' }}>
            <Scissors size={14} />
            <span>Servicios & Precios</span>
          </div>
          <h2 className="section-title">
            NUESTROS <span className="gradient-text-gold">SERVICIOS</span>
          </h2>
          <p className="section-subtitle">
            Precios claros y competitivos. Todos nuestros cortes incluyen lavado capilar y peinado profesional.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '48px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                border: activeTab === cat.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: activeTab === cat.id ? 'rgba(197, 160, 89, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeTab === cat.id ? 'var(--gold-primary)' : 'var(--text-muted)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: service.isPopular ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)'
              }}
            >
              {service.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'var(--gold-primary)',
                  color: '#0A0A0C',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 10px var(--gold-glow)'
                }}>
                  <Sparkles size={12} />
                  <span>Más Pedido</span>
                </div>
              )}

              {service.badge && !service.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {service.badge}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', paddingRight: '10px' }}>
                    {service.title}
                  </h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-display)' }}>
                      {service.price}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <Clock size={14} color="var(--gold-primary)" />
                  <span>Duración: {service.duration || '35 min'}</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
                  {service.description}
                </p>
              </div>

              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => onSelectService(service)}
              >
                <span>Reservar Servicio</span>
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
