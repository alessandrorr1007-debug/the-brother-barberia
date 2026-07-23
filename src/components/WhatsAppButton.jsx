import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const defaultMessage = encodeURIComponent('¡Hola The Brother Barbería! 👋 Me gustaría consultar la disponibilidad de citas.');
  const whatsappUrl = `https://wa.me/573001234567?text=${defaultMessage}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      {/* Tooltip Badge */}
      {hovered && (
        <div style={{
          background: 'rgba(20, 20, 23, 0.92)',
          color: 'var(--text-main)',
          border: '1px solid #25D366',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.3s ease'
        }}>
          💬 ¿Hablar por WhatsApp?
        </div>
      )}

      {/* Floating Circle Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Contactar por WhatsApp"
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      >
        <MessageSquare size={28} />
      </a>
    </div>
  );
}
