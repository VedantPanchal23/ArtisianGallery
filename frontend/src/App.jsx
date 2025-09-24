import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import Explore from './components/Explore';
import ArtistProfile from './components/ArtistProfile';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/artist-profile" element={
                <ProtectedRoute>
                  <ArtistProfile />
                </ProtectedRoute>
              } />
              {/* Add other routes here */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
