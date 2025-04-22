import React, { useState } from 'react';
import axios from 'axios';

const CreateEventPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    image: '', // Campo per l'URL dell'immagine
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('🔍 Token recuperato dal localStorage:', token); // Log token recuperato

    if (!token) {
      alert('Token mancante. Devi essere loggato.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/events',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Evento creato con successo:', res.data); // Log evento creato
      alert('✅ Evento creato con successo!');
    } catch (err) {
      console.error('❌ Errore nella creazione evento:', err.response?.data || err.message); // Log errore creazione evento
      alert('Errore nella creazione evento');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/carti.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 1rem',
      }}
    >
      <div
        className="text-light p-5 rounded shadow-lg"
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // sfondo nero trasparente
        }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ fontFamily: 'Orbitron', color: '#fff' }}
        >
          🔥 Crea Evento 🦇🔥
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Titolo</label>
            <input
              type="text"
              name="title"
              placeholder="Es. Urban Party Milano"
              value={eventData.title}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Descrizione</label>
            <textarea
              name="description"
              placeholder="Breve descrizione dell’evento"
              value={eventData.description}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Data e ora</label>
            <input
              type="datetime-local"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Luogo</label>
            <input
              type="text"
              name="location"
              placeholder="Es. Alcatraz, Milano"
              value={eventData.location}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">URL Immagine</label>
            <input
              type="text"
              name="image"
              placeholder="Es. https://example.com/immagine.jpg"
              value={eventData.image}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Prezzo (€)</label>
            <input
              type="number"
              name="price"
              placeholder="Es. 15"
              value={eventData.price}
              onChange={handleChange}
              className="form-control bg-dark text-light border-secondary"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            🔥 Pubblica Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
