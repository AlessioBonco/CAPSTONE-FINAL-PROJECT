import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login effettuato con successo:', data);

        // Salva il token e il ruolo nel localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Reindirizza alla homepage
        navigate('/'); // Cambia il percorso alla homepage
      } else {
        console.error('❌ Errore durante il login:', data.error);
        alert(data.error); // Mostra un messaggio di errore all'utente
      }
    } catch (err) {
      console.error('❌ Errore durante la richiesta:', err);
      alert('Errore durante il login. Riprova più tardi.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={styles.page}>
      <div className="card" style={styles.card}>
        <div className="card-body">
          <h2 className="text-center" style={styles.heading}>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" className="btn btn-outline-light w-100" style={styles.button}>Login</button>
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
    maxWidth: '600px',
    padding: '1rem',
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
  },
};

export default LoginPage;


