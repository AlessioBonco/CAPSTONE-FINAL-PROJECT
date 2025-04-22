const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const { getAllEvents, getEventById, createEvent } = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const Event = require('../models/Event'); // Importa il modello Event
const Photo = require('../models/Photo'); // Importa il modello Photo

// Rotte
router.get('/', getAllEvents); // Accessibile a tutti
router.get('/:id', getEventById); // Accessibile a tutti
router.post('/', verifyToken, isAdmin, createEvent); // Solo admin possono creare eventi
router.delete('/:eventId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Trova l'evento
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento non trovato' });
    }

    // Elimina l'evento
    await event.deleteOne();
    console.log('✅ Evento eliminato:', event);

    res.json({ success: true, message: 'Evento eliminato con successo' });
  } catch (err) {
    console.error('❌ Errore nella rimozione dell\'evento:', err.message);
    res.status(500).json({ error: 'Errore nella rimozione dell\'evento' });
  }
});

module.exports = router;



