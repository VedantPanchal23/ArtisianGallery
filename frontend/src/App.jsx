import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import Explore from './components/Explore';
import UserProfile from './components/UserProfile';
import UploadArtwork from './components/UploadArtwork';
import ArtworkDetail from './components/ArtworkDetail';
import AuthDebug from './components/AuthDebug';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import MyUploads from './components/MyUploads';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/upload-artwork" element={<UploadArtwork />} />
              <Route path="/my-uploads" element={<MyUploads />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth-debug" element={<AuthDebug />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              {/* Add other routes here */}
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    );
  }
}

export default App;
