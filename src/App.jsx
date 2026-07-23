import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Barbers from './components/Barbers';
import Services from './components/Services';
import BookingModal from './components/BookingModal';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import LocationContact from './components/LocationContact';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState('any');
  const [selectedService, setSelectedService] = useState(null);

  // Dynamic Databases synced from Admin / Barbers
  const [servicesDb, setServicesDb] = useState(() => {
    const saved = localStorage.getItem('tb_services_db');
    return saved ? JSON.parse(saved) : [
      { id: 'corte-clasico', category: 'cuts', title: 'Corte Clásico', price: 'S/ 25', duration: '30 min', description: 'Corte tradicional a tijera y máquina con asesoría de estilo, lavado capilar y peinado final.' },
      { id: 'corte-fade', category: 'cuts', title: 'Corte + Fade de Precisión', price: 'S/ 30', duration: '35 min', isPopular: true, description: 'Degradado limpio (Low, Mid o High Fade) con delineado a navaja en contornos y acabado texturizado.' },
      { id: 'arreglo-barba', category: 'beard', title: 'Arreglo de Barba', price: 'S/ 20', duration: '20 min', description: 'Recorte de volumen, diseño de líneas según el rostro, hidratación y perfilado preciso con navaja.' },
      { id: 'afeitado-navaja', category: 'beard', title: 'Afeitado con Navaja', price: 'S/ 25', duration: '25 min', description: 'Afeitado tradicional completo con espuma ablandadora, toalla caliente y bálsamo reconfortante.' },
      { id: 'combo-corte-barba', category: 'combos', title: 'Combo Corte + Barba', price: 'S/ 40', badge: 'Recomendado', duration: '50 min', isPopular: true, description: 'Corte de cabello a elección (clásico o fade) más ritual completo de arreglo y perfilado de barba.' },
      { id: 'combo-completo-vip', category: 'combos', title: 'Combo Completo The Brother', price: 'S/ 55', badge: 'Servicio Integral', duration: '60 min', description: 'Corte + Fade de precisión, arreglo de barba a navaja, exfoliación facial y lavado capilar relajante.' }
    ];
  });

  const [barbersDb, setBarbersDb] = useState(() => {
    const saved = localStorage.getItem('tb_barbers_db');
    return saved ? JSON.parse(saved) : [
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
  });

  const [webContent, setWebContent] = useState(() => {
    const saved = localStorage.getItem('tb_web_content');
    return saved ? JSON.parse(saved) : {
      history: 'The Brother nace con la visión de Maicol, fundador y barbero principal, de crear un espacio donde el corte de cabello y el arreglo de barba vuelvan a ser un ritual de confianza y dedicación.',
      schedule: 'Lunes a Sábado: 09:00 AM – 09:00 PM | Domingo: 10:00 AM – 05:00 PM'
    };
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tb_services_db', JSON.stringify(servicesDb));
  }, [servicesDb]);

  useEffect(() => {
    localStorage.setItem('tb_barbers_db', JSON.stringify(barbersDb));
  }, [barbersDb]);

  useEffect(() => {
    localStorage.setItem('tb_web_content', JSON.stringify(webContent));
  }, [webContent]);

  const handleOpenBooking = (barberId = 'any', serviceObj = null) => {
    setSelectedBarber(barberId);
    setSelectedService(serviceObj);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Top Fixed Header */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Page Sections */}
      <main>
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <About webContent={webContent} />
        <Barbers customBarbers={barbersDb} onSelectBarber={(barberId) => handleOpenBooking(barberId)} />
        <Services customServices={servicesDb} onSelectService={(service) => handleOpenBooking('any', service)} />
        <Gallery />
        <Testimonials />
        <LocationContact webContent={webContent} />
      </main>

      {/* Floating Elements & Footer */}
      <WhatsAppButton />
      <Footer />

      {/* Interactive Booking Modal & Role-Based Dashboards */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialBarber={selectedBarber}
        initialService={selectedService}
        servicesDb={servicesDb}
        setServicesDb={setServicesDb}
        barbersDb={barbersDb}
        setBarbersDb={setBarbersDb}
        webContent={webContent}
        setWebContent={setWebContent}
      />
    </div>
  );
}
