const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Ordina per data di creazione decrescente
    res.status(200).json(events);
  } catch (err) {
    console.error('❌ Errore nel recupero degli eventi:', err.message);
    res.status(500).json({ error: 'Errore nel recupero degli eventi' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error('❌ Errore nel recupero dell\'evento:', err.message);
    res.status(500).json({ error: 'Errore nel recupero dell\'evento' });
  }
};
const createEvent = async (req, res) => {
  try {
    console.log('📥 Dati ricevuti:', req.body);

    const { title, description, date, location, price, image } = req.body;

    // Verifica se l'URL dell'immagine è stato fornito
    if (!image) {
      return res.status(400).json({ error: 'URL immagine non fornito' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      price,
      image, // Salva l'URL dell'immagine
    });

    await newEvent.save();
    console.log('✅ Evento creato:', newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('❌ Errore nella creazione evento:', err.message);
    res.status(500).json({ error: 'Errore nella creazione evento' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
};
