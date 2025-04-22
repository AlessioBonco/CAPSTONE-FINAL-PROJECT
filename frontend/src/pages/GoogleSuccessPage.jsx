import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Installa questa libreria con `npm install jwt-decode`

const GoogleSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log('🔍 Token ricevuto dal backend:', token);

    if (token) {
      localStorage.setItem('token', token); // Salva il token in localStorage
      console.log('✅ Token salvato in localStorage');

      // Decodifica il token per verificare il ruolo
      const decodedToken = jwtDecode(token);
      console.log('🔍 Ruolo utente:', decodedToken.role);

      navigate('/'); // Reindirizza alla homepage
    } else {
      console.error('❌ Errore: Token non trovato nella query string');
      alert('Errore durante il login con Google');
      navigate('/login'); // Reindirizza alla pagina di login in caso di errore
    }
  }, [navigate]);

  return <p>Accesso in corso...</p>;
};

export default GoogleSuccessPage;
