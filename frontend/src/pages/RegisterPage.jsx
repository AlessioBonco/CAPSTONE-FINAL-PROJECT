import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    adminCode: '' // nuovo campo
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let roleToSend = 'user';

    if (formData.role === 'admin') {
      if (formData.adminCode !== 'sn3i2wmort!') {
        return alert('Codice admin non valido.');
      }
      roleToSend = 'admin';
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: roleToSend
      });

      alert('Registrazione completata! Ora puoi fare login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Errore nella registrazione';
      alert(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={styles.page}>
      <div className="card" style={styles.card}>
        <div className="card-body">
          <h2 className="text-center" style={styles.heading}>Registrazione</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
                className="form-control"
              >
                <option value="user">Utente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {formData.role === 'admin' && (
              <div className="mb-3">
                <input
                  type="text"
                  name="adminCode"
                  placeholder="Codice Admin"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  className="form-control"
                />
              </div>
            )}

            <button type="submit" className="btn btn-outline-light w-100" style={styles.button}>
              Registrati
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#121212',
    height: '100vh',
    color: 'white',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.6)',
    maxWidth: '400px',
    padding: '2rem',
    width: '100%',
  },
  heading: {
    fontFamily: 'Orbitron, sans-serif',
    color: '#fff',
    marginBottom: '2rem',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#444',
    border: '1px solid #666',
    fontWeight: 'bold',
    padding: '0.75rem',
    textTransform: 'uppercase',
    fontSize: '1.2rem',
  }
};

export default RegisterPage;

