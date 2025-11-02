import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Card } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAllMovies, searchMovies } from '../services/movieService';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  // Load movies from Firestore
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const moviesData = await getAllMovies();
      
      setMovies(moviesData);
      setFilteredMovies(moviesData);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies from database. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle search - only for logged-in users
  const handleSearch = async (searchQuery) => {
    if (!currentUser) {
      alert('Please log in to search for movies.');
      return;
    }
    
    setSearchTerm(searchQuery);
    
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchMovies(searchQuery);
      setFilteredMovies(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to client-side filtering
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Retry loading movies
  const handleRetry = () => {
    fetchMovies();
  };

  return (
    <Container>
      {/* Hero Section */}
      <Row className="my-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 mb-4">Welcome to MovieReviews</h1>
            <p className="lead">
              Discover, rate, and review your favorite movies! Join our community of movie enthusiasts.
            </p>
          </div>
        </Col>
      </Row>

      {/* Search Bar - Conditionally Rendered */}
      {currentUser ? (
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search for movies by title..." />
          </Col>
        </Row>
      ) : (
        <Row className="mb-5">
          <Col md={8} className="mx-auto">
            <Card className="text-center border-warning">
              <Card.Body>
                <Card.Title>🔒 Search Locked</Card.Title>
                <Card.Text>
                  Please <a href="/login" className="text-warning">log in</a> to search for movies and access all features.
                </Card.Text>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="outline-primary" href="/login">
                    Login
                  </Button>
                  <Button variant="outline-secondary" href="/register">
                    Register
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Search Results Info */}
      {searchTerm && currentUser && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info">
              Showing results for: <strong>"{searchTerm}"</strong> 
              {!loading && ` (${filteredMovies.length} movies found)`}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Error Display */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <div className="d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <Button variant="outline-danger" size="sm" onClick={handleRetry}>
                  Retry
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Movies Section */}
      <Row>
        <Col>
          {searchTerm && currentUser && (
            <h2 className="mb-4">Search Results</h2>
          )}
          
          {loading ? (
            <Row>
              {[...Array(8)].map((_, index) => (
                <Col key={index} md={3} className="mb-4">
                  <Skeleton height={400} className="loading-skeleton" />
                </Col>
              ))}
            </Row>
          ) : filteredMovies.length === 0 && !error ? (
            <Alert variant="warning">
              {searchTerm && currentUser ? (
                'No movies found matching your search.'
              ) : (
                <div className="text-center">
                  <p>No movies available in the database.</p>
                  <p className="text-muted">
                    Movies will appear here once they are added to the database.
                  </p>
                  <Button variant="primary" onClick={handleRetry}>
                    Refresh
                  </Button>
                </div>
              )}
            </Alert>
          ) : (
            <Row>
              {filteredMovies.map((movie) => (
                <Col key={movie.id} lg={3} md={4} sm={6} className="mb-4">
                  <MovieCard movie={movie} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;