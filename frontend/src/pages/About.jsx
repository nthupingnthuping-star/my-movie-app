import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function About() {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1 className="display-4 mb-4">About MovieReviews</h1>
          <p className="lead mb-5">
            Your go-to platform for discovering, rating, and reviewing movies from around the world.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🎯 Our Mission</Card.Title>
              <Card.Text>
                To create a vibrant community where movie enthusiasts can share their honest opinions, 
                discover new films, and connect with fellow cinephiles. We believe every movie deserves 
                a fair chance and every viewer deserves honest reviews.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🌟 What We Offer</Card.Title>
              <Card.Text>
                • Comprehensive movie database<br/>
                • User-generated reviews and ratings<br/>
                • Personalized recommendations<br/>
                • Community discussions<br/>
                • Latest movie news and updates
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>📈 Join Our Growing Community</Card.Title>
              <Card.Text>
                Whether you're a casual movie watcher or a hardcore film buff, MovieReviews is the perfect 
                platform for you. Share your thoughts, read others' perspectives, and build your personal 
                movie watchlist. Together, let's make movie watching more engaging and informed!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;