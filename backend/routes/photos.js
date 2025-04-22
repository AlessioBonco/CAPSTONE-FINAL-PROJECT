const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const jwt = require('jsonwebtoken');
const Photo = require('../models/Photo');
const Event = require('../models/Event');  // Aggiunto per la rimozione dell'evento

// 📸 GET: tutte le foto di un evento
router.get('/:eventId', async (req, res) => {
  try {
    const photos = await Photo.find({ event: req.params.eventId })
      .populate('uploadedBy', 'username')
      .populate('comments.user', 'username');

    res.json(photos);
  } catch (err) {
    console.error('❌ Errore nel recupero foto:', err.message);
    res.status(500).json({ error: 'Errore nel recupero delle foto' });
  }
});

// Ottieni tutte le foto salvate da un utente
router.get('/saved', verifyToken, async (req, res) => {
  try {
    const photos = await Photo.find({ savedBy: req.user.id })
      .populate('uploadedBy', 'username');

    res.json(photos);
  } catch (err) {
    console.error('❌ Errore nel recupero delle foto salvate:', err.message);
    res.status(500).json({ error: 'Errore nel recupero delle foto salvate' });
  }
});

// ✅ Salva una foto
router.post('/:photoId/save', verifyToken, async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Foto non trovata' });
    }

    const userId = req.user.id;

    // Aggiungi l'utente all'array "savedBy" se non è già presente
    if (!photo.savedBy.includes(userId)) {
      photo.savedBy.push(userId);
      await photo.save();
      return res.status(200).json({ success: true, message: 'Foto salvata correttamente' });
    }

    return res.status(400).json({ error: 'Foto già salvata' });
  } catch (err) {
    console.error('Errore nel salvataggio della foto:', err);
    res.status(500).json({ error: 'Errore nel salvataggio della foto' });
  }
});

// 📤 POST: carica immagine per un evento (solo admin)
router.post('/:eventId', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const newPhoto = new Photo({
      event: req.params.eventId,
      imageUrl: req.file.path,
      uploadedBy: req.user.id,
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error('❌ Errore durante il caricamento della foto:', err.message);
    res.status(500).json({ error: 'Errore durante il caricamento della foto' });
  }
});

// 📤 POST: upload generico (non usato nel progetto attuale, opzionale)
router.post('/upload', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('📁 File ricevuto:', req.file);
    console.log('👤 Utente:', req.user);

    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file ricevuto' });
    }

    const newPhoto = new Photo({
      event: req.body.eventId || null,
      imageUrl: req.file.path, // Usa req.file.path per l'URL dell'immagine
      uploadedBy: req.user.id,
    });

    console.log('📊 Dati da salvare nel DB:', newPhoto);
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error('❌ Errore upload:', err.message);
    res.status(500).json({ error: 'Errore durante l\'upload della foto' });
  }
});

// ✅ LIKE
router.post('/:photoId/like', verifyToken, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ error: 'Foto non trovata' });

    const userId = req.user.id;

    const index = photo.likes.indexOf(userId);
    if (index === -1) {
      photo.likes.push(userId);
    } else {
      photo.likes.splice(index, 1); // toggle like
    }

    await photo.save();
    res.json({ likes: photo.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel like' });
  }
});

router.post('/:photoId/comments', verifyToken, async (req, res) => {
  try {
    const { photoId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Il testo del commento è obbligatorio' });
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Foto non trovata' });
    }

    // Aggiungi il commento alla foto
    photo.comments.push({ user: req.user.id, text });
    await photo.save();

    res.status(201).json(photo);
  } catch (err) {
    console.error('Errore durante l\'aggiunta del commento:', err.message);
    res.status(500).json({ error: 'Errore durante l\'aggiunta del commento' });
  }
});

// ✅ Elimina un commento (solo admin)
router.delete('/:photoId/comment/:commentId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { photoId, commentId } = req.params;

    const photo = await Photo.findById(photoId);
    if (!photo) return res.status(404).json({ error: 'Foto non trovata' });

    photo.comments.pull(commentId);
    await photo.save();

    res.status(200).json({ message: 'Commento eliminato con successo' });
  } catch (err) {
    console.error('❌ Errore nell\'eliminazione del commento:', err.message);
    res.status(500).json({ error: 'Errore nell\'eliminazione del commento' });
  }
});

// ✅ ELIMINAZIONE FOTO (solo admin)
router.delete('/:photoId', verifyToken, isAdmin, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.photoId);
    if (!photo) return res.status(404).json({ error: 'Foto non trovata' });

    res.json({ success: true, message: 'Foto eliminata' });
  } catch (err) {
    console.error('❌ Errore nella rimozione della foto:', err.message);
    res.status(500).json({ error: 'Errore nella rimozione della foto' });
  }
});

// ✅ ELIMINAZIONE EVENTO
router.delete('/:eventId', verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Evento non trovato' });

    // Elimina tutte le foto associate all'evento
    await Photo.deleteMany({ event: req.params.eventId });
    console.log('✅ Foto associate all\'evento eliminate');

    // Elimina l'evento
    await event.deleteOne();
    console.log('✅ Evento eliminato');

    res.json({ success: true, message: 'Evento e foto associate eliminati con successo' });
  } catch (err) {
    console.error('❌ Errore nella rimozione dell\'evento:', err.message);
    res.status(500).json({ error: 'Errore nella rimozione dell\'evento' });
  }
});

module.exports = router;
