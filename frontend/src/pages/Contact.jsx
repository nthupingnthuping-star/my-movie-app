import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'unread',
        ipAddress: '' // You can add IP tracking if needed
      });

      // Show success message
      setAlertVariant('success');
      setAlertMessage('Thank you for your message! We\'ll get back to you soon.');
      setShowAlert(true);
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error saving contact message:', error);
      setAlertVariant('danger');
      setAlertMessage('Sorry, there was an error sending your message. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
      
      // Hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  return (
    <Container>
      <Row className="my-5">
        <Col md={8} className="mx-auto">
          <h1 className="display-4 mb-4 text-center">Contact Us</h1>
          <p className="lead text-center mb-5">
            Have questions or feedback? We'd love to hear from you!
          </p>

          {showAlert && (
            <Alert variant={alertVariant} className="mb-4">
              {alertMessage}
            </Alert>
          )}

          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                    disabled={loading}
                  />
                </Form.Group>
                
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Contact Information - UPDATED WITH LESOTHO DETAILS */}
          <Row className="mt-5">
            <Col md={4} className="text-center mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>📍 Address</Card.Title>
                  <Card.Text>
                    Maseru West<br/>
                    Maseru 100<br/>
                    Lesotho
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>📞 Phone</Card.Title>
                  <Card.Text>
                    +266 5211 722<br/>
                    +266 6393 4226<br/>
                    Mon - Fri, 8am - 5pm SAST
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="text-center mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>✉️ Email</Card.Title>
                  <Card.Text>
                    nthupingnthuping@gmail.com<br/>
                    Available 24/7
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;