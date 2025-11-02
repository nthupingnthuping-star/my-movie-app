import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, Alert, Badge, Modal, Table } from 'react-bootstrap';
import { getMovieReviews, addReview, updateReview, deleteReview } from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import Rating from './Rating';

function ReviewSection({ movieId, movieTitle }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const { currentUser } = useAuth();

  const loadReviews = useCallback(async () => {
    try {
      const movieReviews = await getMovieReviews(movieId);
      setReviews(movieReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      loadReviews();
    }
  }, [movieId, loadReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || rating === 0) {
      alert('Please add both a rating and review text.');
      return;
    }
    if (!currentUser) {
      alert('Please login to submit a review.');
      return;
    }

    setLoading(true);
    try {
      await addReview({
        movieId,
        movieTitle: movieTitle || 'Unknown Movie',
        reviewText: newReview.trim(),
        rating,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName || currentUser.email.split('@')[0] || 'Anonymous User'
      });
      setNewReview('');
      setRating(0);
      await loadReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditReviewText(review.reviewText);
    setEditRating(review.rating);
  };

  const handleUpdateReview = async () => {
    if (!editReviewText.trim() || editRating === 0) {
      alert('Please add both a rating and review text.');
      return;
    }

    setLoading(true);
    try {
      await updateReview(editingReview.id, {
        reviewText: editReviewText.trim(),
        rating: editRating
      });
      setEditingReview(null);
      setEditReviewText('');
      setEditRating(0);
      await loadReviews();
      alert('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    setLoading(true);
    try {
      await deleteReview(reviewToDelete.id, currentUser.uid);
      setShowDeleteModal(false);
      setReviewToDelete(null);
      await loadReviews();
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditReviewText('');
    setEditRating(0);
  };

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const userReview = reviews.find(review => review.userId === currentUser?.uid);

  const formatDate = (timestamp) => {
    try {
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } else if (timestamp) {
        return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } else {
        return 'Recently';
      }
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Reviews & Ratings</h4>
        {reviews.length > 0 && (
          <Badge bg="info" className="fs-6 px-2 py-1">
            ⭐ {averageRating} • {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </Badge>
        )}
      </div>

      {/* Review Form */}
      {currentUser ? (
        <Card className="mb-4 border-primary">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              {editingReview ? 'Edit Your Review' : userReview ? 'Update Your Review' : 'Write a Review'}
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={editingReview ? (e) => { e.preventDefault(); handleUpdateReview(); } : handleSubmitReview}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Your Rating</Form.Label>
                <div className="mb-2">
                  <Rating 
                    initialRating={editingReview ? editRating : rating}
                    onRatingChange={editingReview ? setEditRating : setRating}
                    readonly={false}
                  />
                  <div className="text-muted mt-1 text-start">
                    {(editingReview ? editRating : rating) > 0 
                      ? `Selected: ${editingReview ? editRating : rating} star${(editingReview ? editRating : rating) > 1 ? 's' : ''}` 
                      : 'Click stars to rate (1–5)'
                    }
                  </div>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  {editingReview ? 'Edit Your Review' : 'Your Review'}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingReview ? editReviewText : newReview}
                  onChange={(e) => editingReview ? setEditReviewText(e.target.value) : setNewReview(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  required
                  style={{ resize: 'vertical' }}
                  maxLength={500}
                />
                <Form.Text className="text-muted text-start d-block mt-1">
                  {(editingReview ? editReviewText : newReview).length}/500 characters
                </Form.Text>
              </Form.Group>
              
              <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading || 
                    (editingReview ? editRating === 0 : rating === 0) || 
                    !(editingReview ? editReviewText : newReview).trim()
                  }
                  className="px-4"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editingReview ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : editingReview ? 'Update Review' : (userReview && !editingReview ? 'Update Your Review' : 'Submit Review')}
                </Button>
                
                {editingReview && (
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info" className="mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex-grow-1 text-start">
              <strong>Please login to write reviews</strong>
              <div className="mt-1">You need an account to share your thoughts about this movie.</div>
            </div>
            <Button variant="outline-primary" size="sm" href="/login">
              Login
            </Button>
          </div>
        </Alert>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card className="border-0">
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">User Reviews ({reviews.length})</h5>
            </div>
            
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-start" style={{ width: '25%' }}>User</th>
                    <th className="text-center" style={{ width: '15%' }}>Rating</th>
                    <th className="text-start" style={{ width: '40%' }}>Review</th>
                    <th className="text-center" style={{ width: '15%' }}>Date</th>
                    <th className="text-center" style={{ width: '5%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className={currentUser?.uid === review.userId ? 'table-active' : ''}>
                      <td className="text-start align-middle">
                        <div>
                          <strong className="d-block text-primary" style={{ fontSize: '0.9rem' }}>
                            {review.userDisplayName}
                          </strong>
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                            {review.userEmail}
                          </small>
                          {currentUser?.uid === review.userId && (
                            <Badge bg="primary" className="ms-1 mt-1" style={{ fontSize: '0.6rem' }}>
                              You
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle">
                        <div>
                          <span className="text-warning" style={{ fontSize: '1rem' }}>
                            {'★'.repeat(review.rating)}
                            <span className="text-muted">{'★'.repeat(5 - review.rating)}</span>
                          </span>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            ({review.rating}/5)
                          </div>
                        </div>
                      </td>
                      <td className="text-start align-middle">
                        <div 
                          className="text-break"
                          style={{ 
                            fontSize: '0.85rem',
                            lineHeight: '1.3',
                            maxHeight: '3.9rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                          title={review.reviewText}
                        >
                          {review.reviewText}
                        </div>
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                          <small className="text-info">(edited)</small>
                        )}
                      </td>
                      <td className="text-center align-middle">
                        <small className="text-muted">
                          {formatDate(review.createdAt)}
                        </small>
                      </td>
                      <td className="text-center align-middle">
                        {currentUser && currentUser.uid === review.userId && !editingReview && (
                          <div className="d-flex gap-1 justify-content-center">
                            <Button 
                              size="sm" 
                              variant="outline-warning"
                              onClick={() => handleEditReview(review)}
                              disabled={loading}
                              style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem' }}
                              title="Edit review"
                            >
                              ✏️
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => openDeleteModal(review)}
                              disabled={loading}
                              style={{ padding: '0.15rem 0.35rem', fontSize: '0.75rem' }}
                              title="Delete review"
                            >
                              🗑️
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <p>Are you sure you want to delete your review?</p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={closeDeleteModal} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteReview} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewSection;