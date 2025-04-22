const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // URL dell'immagine
  },
  { timestamps: true } // Aggiunge createdAt e updatedAt automaticamente
);

module.exports = mongoose.model('Event', eventSchema);