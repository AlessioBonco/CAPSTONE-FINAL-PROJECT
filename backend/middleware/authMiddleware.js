const jwt = require('jsonwebtoken');

// Middleware per verificare il token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token non valido.' });
  }
};

// ✅ Usa "role" invece di "isAdmin"
const isAdmin = (req, res, next) => {
  console.log('🔍 Verifica ruolo admin:', req.user);
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accesso negato. Utente non admin.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
