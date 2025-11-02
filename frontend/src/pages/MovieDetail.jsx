import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getMovie } from '../services/movieService';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await getMovie(id);
        
        if (movieData) {
          setMovie(movieData);
        } else {
          setError('Movie not found in database.');
        }
      } catch (err) {
        setError('Failed to load movie details.');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Get the actual poster URL with fallbacks
  const getPosterUrl = () => {
    if (!movie) return '/placeholder-movie.jpg';
    
    // If we have a valid poster_path, use it
    if (movie.poster_path && movie.poster_path.startsWith('http')) {
      return movie.poster_path;
    }
    
    // If poster_path exists but doesn't start with http, construct the URL
    if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    
    // Fallback to the known Inception URL
    return "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg";
  };

  // Handle genre display
  const displayGenres = () => {
    if (!movie?.genre_ids) return [];
    
    try {
      if (Array.isArray(movie.genre_ids)) {
        return movie.genre_ids;
      } else if (typeof movie.genre_ids === 'string') {
        const parsed = JSON.parse(movie.genre_ids);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing genres:', error);
      return [];
    }
  };

  const genreNames = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    53: 'Thriller',
    10752: 'War'
  };

  if (loading) {
    return (
      <Container>
        <Row className="my-5">
          <Col>
            <Skeleton height={40} className="mb-3" />
            <Skeleton height={20} count={3} />
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Row className="my-5">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Row className="my-5">
          <Col>
            <Alert variant="warning">Movie not found</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const posterUrl = getPosterUrl();
  const backdropUrl = movie.backdrop_path || "https://image.tmdb.org/t/p/w1280/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg";

  return (
    <Container>
      {/* Backdrop Image */}
      {backdropUrl && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            zIndex: -1,
            pointerEvents: 'none'
          }}
        />
      )}
      
      <Row className="my-5">
        {/* Movie Poster */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Img 
              variant="top"
              src={posterUrl}
              alt={movie.title}
              style={{ 
                height: '500px', 
                objectFit: 'cover',
                backgroundColor: '#f8f9fa'
              }}
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg';
              }}
            />
          </Card>
        </Col>

        {/* Movie Details */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="display-5 mb-3">{movie.title}</h1>
              
              <div className="mb-3">
                {displayGenres().map(genreId => (
                  <Badge key={genreId} bg="secondary" className="me-2">
                    {genreNames[genreId] || `Genre ${genreId}`}
                  </Badge>
                ))}
              </div>

              <div className="mb-4">
                <Row>
                  <Col sm={6}>
                    <strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10
                  </Col>
                  <Col sm={6}>
                    <strong>Votes:</strong> {movie.vote_count?.toLocaleString() || 'N/A'}
                  </Col>
                  <Col sm={6}>
                    <strong>Release Date:</strong> {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                  </Col>
                  <Col sm={6}>
                    <strong>Popularity:</strong> {movie.popularity || 'N/A'}
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5>Overview</h5>
                <p className="lead">{movie.overview || 'No description available.'}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row>
        <Col>
          <ReviewSection movieId={id} movieTitle={movie.title} />
        </Col>
      </Row>
    </Container>
  );
}

export default MovieDetail;