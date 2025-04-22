const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');

const app = express();


app.use(cors());

// Middleware per gestire i dati in formato JSON
app.use(express.json());

// Definire le rotte
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

// Rotta di test per vedere se l'API è attiva
app.get('/', (req, res) => {
  res.send('API Night Life funzionante!');
});

module.exports = app;

