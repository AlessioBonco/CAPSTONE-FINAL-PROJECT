const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato email non valido.' });
    }

    // 🔍 Chiamata a Hunter.io per verificare se l'email esiste
    const hunterApiKey = process.env.HUNTER_API_KEY;
    const hunterRes = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
      params: {
        email,
        api_key: hunterApiKey,
      }
    });

    const isValid = hunterRes.data?.data?.status === 'valid';

    if (!isValid) {
      return res.status(400).json({ error: 'L\'email inserita non esiste realmente o non è verificabile.' });
    }

    // Email già registrata?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'Registrazione completata con successo.' });

  } catch (err) {
    console.error('❌ Errore nella registrazione:', err.message);
    res.status(500).json({ error: 'Email Non Esistente' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('❌ Utente non trovato:', req.body.email); // Log utente non trovato
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Password non valida per utente:', user.email); // Log password non valida
      return res.status(401).json({ error: 'Password non valida' });
    }

    console.log('🔍 Ruolo dell\'utente durante il login:', user.role); // Log per verificare il ruolo

    // Genera un token JWT con il ruolo incluso
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Includi il ruolo nel token
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ Token generato:', token); // Log token generato
    res.status(200).json({ token, role: user.role }); // Invia anche il ruolo al frontend
  } catch (err) {
    console.error('❌ Errore durante il login:', err.message); // Log errore durante il login
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

module.exports = { registerUser, loginUser };

