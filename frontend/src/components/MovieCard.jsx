import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MovieCard({ movie }) {
  const { currentUser } = useAuth();

  // Handle OMDb poster URLs and placeholders
  const getPosterUrl = () => {
    if (!movie.poster_path || movie.poster_path === '/placeholder-movie.jpg') {
      return '/placeholder-movie.jpg';
    }
    
    // OMDb returns full URLs, so use them directly
    return movie.poster_path;
  };

  // Handle OMDb genres (array of genre names)
  const displayGenres = () => {
    if (!movie.genre_ids || !Array.isArray(movie.genre_ids)) return [];
    return movie.genre_ids.slice(0, 2); // Show first 2 genres
  };

  const posterUrl = getPosterUrl();

  return (
    <Card className="movie-card h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={posterUrl}
        alt={movie.title}
        style={{ 
          height: '400px', 
          objectFit: 'cover',
          backgroundColor: '#f8f9fa'
        }}
        onError={(e) => {
          e.target.src = '/placeholder-movie.jpg';
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="flex-grow-0" style={{ fontSize: '1.1rem', height: '3rem', overflow: 'hidden' }}>
          {movie.title}
        </Card.Title>
        
        {/* Year */}
        {movie.year && (
          <div className="mb-2">
            <Badge bg="secondary" className="me-1">
              {movie.year}
            </Badge>
          </div>
        )}
        
        {/* Genres */}
        {displayGenres().length > 0 && (
          <div className="mb-2">
            {displayGenres().map((genre, index) => (
              <Badge 
                key={index} 
                bg="outline-secondary" 
                className="me-1 mb-1"
                style={{ fontSize: '0.7rem' }}
                text="dark"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Rating */}
        {movie.rated && movie.rated !== 'N/A' && (
          <div className="mb-2">
            <Badge bg="warning" text="dark" style={{ fontSize: '0.7rem' }}>
              {movie.rated}
            </Badge>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="primary">
              ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
            </Badge>
            <small className="text-muted">
              {movie.vote_count ? `${movie.vote_count.toLocaleString()} votes` : 'No votes'}
            </small>
          </div>
          
          {currentUser ? (
            <Button 
              as={Link} 
              to={`/movie/${movie.id}`}
              variant="primary" 
              size="sm" 
              className="w-100"
            >
              Rate & Review
            </Button>
          ) : (
            <Button 
              as={Link} 
              to={`/movie/${movie.id}`}
              variant="outline-primary" 
              size="sm" 
              className="w-100"
            >
              View Details
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;