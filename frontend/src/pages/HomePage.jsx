import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = ({ searchQuery }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
        setFilteredEvents(res.data); // Mostra tutti gli eventi inizialmente
      } catch (err) {
        console.error('Errore nel caricamento degli eventi:', err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1); // Resetta alla prima pagina quando cambia la ricerca
  }, [searchQuery, events]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Eventi in Programma</h2>
      {currentEvents.length === 0 ? (
        <p style={styles.noEvent}>Nessun evento trovato</p>
      ) : (
        <div style={styles.grid}>
          {currentEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={styles.card}>
                <img src={event.image} alt={event.title} style={styles.image} />
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleString('it-IT')}</p>
                <p>{event.location}</p>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {event.price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div style={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          ⬅️ Precedente
        </button>
        <span style={styles.pageInfo}>
          Pagina {currentPage} di {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          Successivo ➡️
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>@2025 NightLife, Inc.</p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: 'white',
    padding: '2rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    fontFamily: 'Orbitron, sans-serif',
  },
  noEvent: {
    textAlign: 'center',
    color: '#ccc',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Adatta automaticamente il numero di colonne
    gap: '1.5rem',
    padding: '1rem',
  },
  card: {
    border: '1px solid #444',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    maxWidth: '400px',
    margin: 'auto',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
    gap: '1rem',
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pageInfo: {
    color: '#ccc',
  },
  footer: {
    marginTop: '200px', // Spinge il footer verso il basso
    textAlign: 'center',
  },
};

export default HomePage;


