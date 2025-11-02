import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';

function Navigation() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleShowLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🎬 MovieReviews
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>
              {currentUser && (
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
              )}
            </Nav>
            
            <div className="d-flex align-items-center">
              {currentUser ? (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                    👋 {currentUser.displayName || currentUser.email}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div>
                  <Button 
                    variant="outline-light" 
                    className="me-2"
                    onClick={handleShowLogin}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleShowRegister}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Auth Modals */}
      <Login 
        show={showLogin} 
        onHide={() => setShowLogin(false)}
        onSwitchToRegister={handleShowRegister}
      />
      
      <Register 
        show={showRegister} 
        onHide={() => setShowRegister(false)}
        onSwitchToLogin={handleShowLogin}
      />
    </>
  );
}

export default Navigation;