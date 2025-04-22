import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa il CSS di Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa il JS di Bootstrap

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false); // Stato per verificare se l'utente è admin
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica il payload del token
        setIsAdmin(payload?.role === 'admin'); // <-- Qui cambia
      } catch (err) {
        console.error('Errore nella decodifica del token:', err);
        setIsAdmin(false);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // Passa la query di ricerca al componente genitore
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <h2 className="navbar-brand">🔥Night Life</h2>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active">Home</Link>
            </li>
            {isAdmin && ( // Mostra "Crea Evento" solo se l'utente è admin
              <li className="nav-item">
                <Link to="/create-event" className="nav-link">Crea Evento</Link>
              </li>
            )}
          </ul>

          {/* Sezione per il pulsante Acquista Biglietti */}
          <div className="d-flex justify-content-center mx-3">
            <a
              href="https://linktr.ee/Born.2Rage?fbclid=PAZXh0bgNhZW0CMTEAAaeV4ijJTjKSRGmfQM14M4RtonCCpgr8FQ-LAVpH5KLNXjqLtcrXt3Gd8qdHXw_aem_I-mnxYPP3i-6kF34XD6Kjg"
              className="btn btn-warning"
            >
              🎟️ Acquista Biglietti
            </a>
          </div>

          {/* Menu e Login / Logout */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <div className="d-flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="🔍 Cerca evento..."
                  className="form-control"
                  style={{ width: '200px', marginRight: '10px' }}
                />
              </div>
            </li>

            {token ? (
              <>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Registrati</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



