import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetailPage = () => {
  console.log("🚀 EventDetailPage montato");

  const { id } = useParams(); // ID dell’evento dalla URL
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Stato per il modal


  
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('👑 Ruolo nel token:', payload?.role);
      setIsAdmin(payload?.role === 'admin');
    } catch (err) {
      console.error('Token non valido');
      setIsAdmin(false);
    }
  };
  

  // ✅ Caricamento iniziale evento + foto
  useEffect(() => {
    const fetchEvent = async () => {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
    };

    const fetchPhotos = async () => {
      const res = await axios.get(`http://localhost:5000/api/photos/${id}`);
      setPhotos(res.data);
    };

    fetchEvent();
    fetchPhotos();
    checkAuth();
  }, [id]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Imposta l'immagine selezionata per il modal
  };

  const closeModal = () => {
    setSelectedImage(null); // Chiudi il modal
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.split('/').pop(); // Usa il nome del file dall'URL
    link.click();
  };

  if (!event || !event.title) {
    console.log("⏳ Attendo il caricamento dell'evento...");
    return <p className="text-light text-center mt-5">Caricamento evento...</p>;
  };

  const handleLike = async (photoId) => {
    const token = localStorage.getItem('token'); // Recupera il token di autenticazione
    try {
      // Effettua una richiesta POST al backend per aggiungere un like
      const res = await axios.post(`http://localhost:5000/api/photos/${photoId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Aggiorna la lista delle foto dopo aver aggiunto il like
      const updatedPhotos = await axios.get(`http://localhost:5000/api/photos/${id}`);
      setPhotos(updatedPhotos.data);
  
      console.log('✅ Like aggiunto con successo');
    } catch (err) {
      console.error('❌ Errore nell\'aggiunta del like:', err.response?.data || err.message);
      alert('Errore durante l\'aggiunta del like');
    }
  };


  const handleComment = async (photoId) => {
    const token = localStorage.getItem('token');
    const commentText = commentInputs[photoId];
  
    console.log('📤 Invio commento:');
    console.log('photoId:', photoId);
    console.log('commentText:', commentText);
  
    if (!commentText) {
      alert('Il commento non può essere vuoto!');
      return;
    }
  
    try {
      const res = await axios.post(
        `http://localhost:5000/api/photos/${photoId}/comments`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log('✅ Commento aggiunto:', res.data);
      setCommentInputs({ ...commentInputs, [photoId]: '' });
    } catch (err) {
      console.error('❌ Errore nell\'aggiunta del commento:', err.response?.data || err.message);
      alert('Errore durante l\'aggiunta del commento');
    }
  };

  const handleDeleteComment = async (photoId, commentId) => {
    const token = localStorage.getItem('token'); // Recupera il token di autenticazione
    try {
      // Effettua una richiesta DELETE al backend per eliminare il commento
      await axios.delete(`http://localhost:5000/api/photos/${photoId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Aggiorna la lista delle foto dopo l'eliminazione del commento
      const updatedPhotos = await axios.get(`http://localhost:5000/api/photos/${id}`);
      setPhotos(updatedPhotos.data);
  
      console.log('✅ Commento eliminato con successo');
    } catch (err) {
      console.error('❌ Errore nell\'eliminazione del commento:', err.response?.data || err.message);
      alert('Errore durante l\'eliminazione del commento');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const token = localStorage.getItem('token'); // Recupera il token di autenticazione
    try {
      // Effettua una richiesta DELETE al backend per eliminare la foto
      await axios.delete(`http://localhost:5000/api/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Aggiorna la lista delle foto dopo l'eliminazione
      const updatedPhotos = await axios.get(`http://localhost:5000/api/photos/${id}`);
      setPhotos(updatedPhotos.data);
  
      console.log('✅ Foto eliminata con successo');
    } catch (err) {
      console.error('❌ Errore nell\'eliminazione della foto:', err.response?.data || err.message);
      alert('Errore durante l\'eliminazione della foto');
    }
  };
  
  const handleDeleteEvent = async () => {
    const token = localStorage.getItem('token'); // Recupera il token di autenticazione
    try {
      // Effettua una richiesta DELETE al backend per eliminare l'evento
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('✅ Evento eliminato con successo');
      alert('Evento eliminato con successo!');
  
      // Reindirizza l'utente alla home o a un'altra pagina
      window.location.href = '/';
    } catch (err) {
      console.error('❌ Errore durante l\'eliminazione dell\'evento:', err.response?.data || err.message);
      alert('Errore durante l\'eliminazione dell\'evento');
    }
  };



  

  return (
    <div className="container text-light mt-5 py-4 px-3 rounded" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <h2 className="mb-3">{event.title}</h2>
      <p><strong>Data:</strong> {new Date(event.date).toLocaleString('it-IT')}</p>
      <p><strong>Luogo:</strong> {event.location}</p>
      <p><strong>Descrizione:</strong> {event.description}</p>
      <p><strong>Prezzo:</strong> {event.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</p>
    {/* Input per caricare le foto */}
    {isAdmin && (
      <div className="mt-4">
        <h5>Carica una nuova foto</h5>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
              const token = localStorage.getItem('token');
              await axios.post(`http://localhost:5000/api/photos/${id}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              });

              // Aggiorna la lista delle foto dopo il caricamento
              const updatedPhotos = await axios.get(`http://localhost:5000/api/photos/${id}`);
              setPhotos(updatedPhotos.data);

              console.log('✅ Foto caricata con successo');
              setImageFile(null); // Resetta il file selezionato
            } catch (err) {
              console.error('❌ Errore durante il caricamento della foto:', err.response?.data || err.message);
              alert('Errore durante il caricamento della foto');
            }
          }}
        >
          <input
            type="file"
            className="form-control mt-2"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button type="submit" className="btn btn-primary mt-2">
            📤 Carica Foto
          </button>
        </form>
      </div>
    )}
{isAdmin && (
  <div className="mt-4">
    <button
      className="btn btn-danger"
      onClick={handleDeleteEvent}
    >
      🗑️ Elimina Evento
    </button>
  </div>
)}
      <hr />
      <h4 className="mb-4 mt-5"> Galleria Evento 📸 </h4>
      {photos.length === 0 ? (
        <p className="text-secondary">Coming Soon...</p>
      ) : (
        <div className="row">
          {photos.map(photo => (
            <div className="col-md-4 mb-4" key={photo._id}>
              <div className="card h-100 border border-secondary shadow" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                <img
                  src={photo.imageUrl}
                  alt="Foto evento"
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(photo.imageUrl)} // Apre il modal
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between mt-auto">
                    <button className="btn btn-outline-danger btn-sm me-2" onClick={() => handleLike(photo._id)}>
                      ❤️ {photo.likes?.length || 0}
                    </button>
                    <a
                      href={photo.imageUrl}
                      download={`photo_${photo._id}.webp`}
                      className="btn btn-outline-success btn-sm"
                    >
                      📥 Scarica
                    </a>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeletePhoto(photo._id)} className="btn btn-sm btn-outline-danger mt-2">
                      🗑️ Elimina Foto
                    </button>
                  )}
                  <div className="mt-3">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-light mb-2"
                      placeholder="Scrivi un commento..."
                      value={commentInputs[photo._id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [photo._id]: e.target.value })
                      }
                    />
                    <button className="btn btn-outline-info btn-sm" onClick={() => handleComment(photo._id)}>
                      💬 Invia
                    </button>
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowComments(prev => ({ ...prev, [photo._id]: !prev[photo._id] }))}
                    >
                      {showComments[photo._id] ? 'Nascondi commenti' : 'Leggi commenti'}
                    </button>
                  </div>
                  {showComments[photo._id] && (
                     <div className="mt-3 bg-secondary p-2 rounded">
                     <h6>Commenti:</h6>
                     {photo.comments && photo.comments.length > 0 ? (
                       <ul className="list-unstyled">
                         {photo.comments.map((comment, index) => (
                           <li key={index} className="text-light mb-2 d-flex justify-content-between align-items-center">
                             <span>
                               <strong>{comment.user?.username || 'Anonimo'}:</strong> {comment.text}
                             </span>
                             {isAdmin && (
                               <button
                                 className="btn btn-sm btn-outline-danger ms-2"
                                 onClick={() => handleDeleteComment(photo._id, comment._id)}
                               >
                                 🗑️
                               </button>
                             )}
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <p className="text-secondary">Nessun commento disponibile.</p>
                     )}
                   </div>
                 )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal per visualizzare l'immagine */}
      {selectedImage && (
        <div
          className="modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal} // Chiudi il modal cliccando fuori dall'immagine
        >
          <img
            src={selectedImage}
            alt="Dettaglio"
            style={{ maxWidth: '90%', maxHeight: '80%' }}
          />
          <button
            className="btn btn-success mt-3"
            onClick={(e) => {
              e.stopPropagation(); // Evita che il click sul pulsante chiuda il modal
              handleDownload(selectedImage); // Scarica l'immagine
            }}
          >
            📥 Scarica immagine
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;