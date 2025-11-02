import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import './App.css';

// Import your photo (if you have one in src/assets)
// import yourPhoto from './assets/your-photo.jpg';

function App() {
  return (
    <AuthProvider>
      <div 
        className="App hollywood-bg"
        style={{
          backgroundImage: `url('/assets/your-photo.jpg')` // Remove this line if no photo
        }}
      >
        {/* Theater decorative elements */}
        <div className="theater-screen"></div>
        <div className="spotlight spotlight-1"></div>
        <div className="spotlight spotlight-2"></div>
        <div className="curtain-tassel tassel-left"></div>
        <div className="curtain-tassel tassel-right"></div>
        
        <div className="hollywood-content">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;