import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div
      className="card bg-dark text-light shadow-lg border border-secondary"
      style={{
        height: '100%',
        minHeight: '300px',
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      {event.image && (
        <img
          src={event.image}
          className="card-img-top"
          alt={event.title}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text">{event.description?.slice(0, 100)}...</p>
        <p className="mt-auto fw-bold">
          {event.price.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'EUR',
          })}
        </p>
        <Link to={`/events/${event._id}`} className="btn btn-primary w-100 mt-2">
          🔥 Vedi evento
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
