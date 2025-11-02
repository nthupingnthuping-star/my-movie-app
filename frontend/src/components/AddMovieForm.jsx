import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { addMovie } from '../services/movieService';

function AddMovieForm({ show, onHide, onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    release_date: '',
    vote_average: 0,
    vote_count: 0,
    popularity: 0,
    poster_path: '',
    backdrop_path: '',
    genre_ids: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' }
  ];

  const handleGenreChange = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genre_ids: prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter(id => id !== genreId)
        : [...prev.genre_ids, genreId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form data
    if (!formData.title.trim() || !formData.overview.trim() || !formData.release_date) {
      setError('Please fill in all required fields (Title, Overview, Release Date)');
      setLoading(false);
      return;
    }

    try {
      // Format the movie data properly
      const movieData = {
        title: formData.title.trim(),
        overview: formData.overview.trim(),
        release_date: formData.release_date,
        vote_average: parseFloat(formData.vote_average) || 0,
        vote_count: parseInt(formData.vote_count) || 0,
        popularity: parseFloat(formData.popularity) || 0,
        poster_path: formData.poster_path.trim() || '',
        backdrop_path: formData.backdrop_path.trim() || '',
        genre_ids: formData.genre_ids // Already an array from state
      };

      console.log('Submitting movie data:', movieData);
      
      await addMovie(movieData);
      
      // Reset form
      setFormData({
        title: '',
        overview: '',
        release_date: '',
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        poster_path: '',
        backdrop_path: '',
        genre_ids: []
      });
      
      if (onMovieAdded) {
        onMovieAdded();
      }
      
      onHide();
      alert('🎉 Movie added successfully!');
    } catch (err) {
      console.error('Full error details:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check your Firestore security rules.');
      } else if (err.message.includes('permissions')) {
        setError('Database permissions error. Please check Firestore rules.');
      } else {
        setError('Error adding movie: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      overview: '',
      release_date: '',
      vote_average: 0,
      vote_count: 0,
      popularity: 0,
      poster_path: '',
      backdrop_path: '',
      genre_ids: []
    });
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Movie</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              <strong>Error:</strong> {error}
              <div className="mt-2">
                <small>
                  Need help? Check your Firestore security rules in the Firebase console.
                </small>
              </div>
            </Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Movie Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter movie title"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Release Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Overview *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.overview}
              onChange={(e) => setFormData({...formData, overview: e.target.value})}
              required
              placeholder="Enter movie description"
              disabled={loading}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Rating (0-10)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.vote_average}
                  onChange={(e) => setFormData({...formData, vote_average: e.target.value})}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Vote Count</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.vote_count}
                  onChange={(e) => setFormData({...formData, vote_count: e.target.value})}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Popularity</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.popularity}
                  onChange={(e) => setFormData({...formData, popularity: e.target.value})}
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Poster Image URL</Form.Label>
            <Form.Control
              type="url"
              value={formData.poster_path}
              onChange={(e) => setFormData({...formData, poster_path: e.target.value})}
              placeholder="https://image.tmdb.org/t/p/w500/movie-poster.jpg"
              disabled={loading}
            />
            <Form.Text className="text-muted">
              You can use TMDB poster URLs or any image URL
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Backdrop Image URL</Form.Label>
            <Form.Control
              type="url"
              value={formData.backdrop_path}
              onChange={(e) => setFormData({...formData, backdrop_path: e.target.value})}
              placeholder="https://image.tmdb.org/t/p/w1280/movie-backdrop.jpg"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genres</Form.Label>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <Row>
                {genres.map(genre => (
                  <Col key={genre.id} md={6}>
                    <Form.Check
                      type="checkbox"
                      label={genre.name}
                      checked={formData.genre_ids.includes(genre.id)}
                      onChange={() => handleGenreChange(genre.id)}
                      disabled={loading}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Adding Movie...' : 'Add Movie'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddMovieForm;