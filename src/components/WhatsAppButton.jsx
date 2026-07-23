import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/51987654321?text=¡Hola%20The%20Brother%20Barbería!%20👋%20Deseo%20hacer%20una%20consulta%20o%20reservar%20mi%20cita.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      title="Contactar por WhatsApp a The Brother"
      aria-label="Contactar por WhatsApp"
    >
      <MessageSquare size={28} />
    </a>
  );
}
