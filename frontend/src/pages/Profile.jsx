import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getUserReviews, getUserProfile } from '../services/movieService';

function Profile() {
  const { currentUser } = useAuth(); // Removed unused getUserData
  const [userReviews, setUserReviews] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const [reviews, profile] = await Promise.all([
            getUserReviews(currentUser.uid),
            getUserProfile(currentUser.uid)
          ]);
          setUserReviews(reviews);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Container>
        <Row className="my-5">
          <Col>
            <Alert variant="warning">
              Please <Link to="/">login</Link> to view your profile.
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const joinDate = userProfile?.createdAt?.toDate?.() || new Date();
  const reviewCount = userProfile?.reviewCount || userReviews.length;

  return (
    <Container>
      <Row className="my-5">
        <Col md={4}>
          {/* User Profile Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div 
                  className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <Card.Title>{currentUser.displayName || 'User'}</Card.Title>
              <Card.Text className="text-muted">{currentUser.email}</Card.Text>
              
              {/* User Stats */}
              <div className="d-flex justify-content-around mt-3">
                <div className="text-center">
                  <div className="h4 mb-0">{reviewCount}</div>
                  <small className="text-muted">Reviews</small>
                </div>
                <div className="text-center">
                  <div className="h4 mb-0">
                    {userReviews.length > 0 
                      ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                      : '0'
                    }
                  </div>
                  <small className="text-muted">Avg Rating</small>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">
                  Member since: {joinDate.toLocaleDateString()}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {/* User's Reviews */}
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">My Reviews ({reviewCount})</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Alert variant="info">Loading your reviews...</Alert>
              ) : userReviews.length === 0 ? (
                <Alert variant="info">
                  You haven't written any reviews yet. <Link to="/">Browse movies</Link> and share your thoughts!
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {userReviews.map((review) => (
                    <ListGroup.Item key={review.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">
                            <Link to={`/movie/${review.movieId}`} className="text-decoration-none">
                              {review.movieTitle || 'Movie'}
                            </Link>
                          </h6>
                        </div>
                        <Badge bg="warning" text="dark">
                          {'★'.repeat(review.rating)}
                        </Badge>
                      </div>
                      <p className="mb-2">{review.reviewText}</p>
                      <small className="text-muted">
                        Reviewed on {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                        {review.updatedAt && ' (edited)'}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;