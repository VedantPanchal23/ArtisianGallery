import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Cart.css';

class Cart extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
    
    // Wait for auth to load before checking
    if (this.context.loading) {
      setTimeout(() => {
        if (!this.context.isAuthenticated) {
          window.location.href = '/login?redirect=/cart';
        }
      }, 100);
      return;
    }

    // Redirect if not authenticated
    if (!this.context.isAuthenticated) {
      window.location.href = '/login?redirect=/cart';
      return;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  getInitials = (name) => {
    if (!name) return 'U';
    var names = name.split(' ');
    var initials = names[0].charAt(0);
    if (names.length > 1) {
      initials += names[1].charAt(0);
    }
    return initials.toUpperCase();
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  }

  handleLogout = () => {
    this.setState({ showDropdown: false });
    this.context.logout();
  }

  formatPrice = (price, currency) => {
    var symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return `${symbols[currency] || '₹'}${parseFloat(price).toFixed(2)}`;
  }

  render() {
    var user = this.context.user;
    var { showDropdown } = this.state;

    return (
      <CartContext.Consumer>
        {(cartContext) => (
          <div className="cart-page">
            {/* Navbar */}
            <nav className="navbar">
              <div className="nav-container">
                <div className="logo" onClick={() => window.location.href = '/'}>ArtHive</div>
                <div className="nav-right">
                  <ul className="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/explore">Explore</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li>
                      <div className="profile-menu" ref={(ref) => this.profileMenuRef = ref}>
                        <div className="profile-circle" onClick={this.toggleDropdown}>
                          {this.getInitials(user?.name)}
                        </div>
                        {showDropdown && (
                          <div className="dropdown-menu">
                            <div className="dropdown-header">
                              <div className="dropdown-avatar">
                                {this.getInitials(user?.name)}
                              </div>
                              <div className="dropdown-user-info">
                                <p className="dropdown-name">{user?.name}</p>
                                <p className="dropdown-email">{user?.email}</p>
                              </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            
                            {user?.role === 'user' && (
                              <a href="/profile" className="dropdown-item">My Profile</a>
                            )}
                            
                            {user?.role === 'artist' && (
                              <>
                                <a href="/upload-artwork" className="dropdown-item">Upload Artwork</a>
                                <a href="/my-uploads" className="dropdown-item">My Uploads</a>
                              </>
                            )}
                            
                            <a href="/explore" className="dropdown-item">Explore</a>
                            <a href="/cart" className="dropdown-item">Cart</a>
                            
                            <div className="dropdown-divider"></div>
                            <button onClick={this.handleLogout} className="dropdown-item logout-item">
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <div className="cart-container">
              <div className="cart-header">
                <h1>Shopping Cart</h1>
                <p className="cart-count">{cartContext.cartCount} {cartContext.cartCount === 1 ? 'item' : 'items'}</p>
              </div>

              {cartContext.cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <h2>Your cart is empty</h2>
                  <p>Explore our marketplace and add some amazing artworks to your cart!</p>
                  <button className="btn-primary" onClick={() => window.location.href = '/explore'}>
                    Browse Artworks
                  </button>
                </div>
              ) : (
                <div className="cart-content">
                  {/* Cart Items */}
                  <div className="cart-items">
                    {cartContext.cart.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="item-image" onClick={() => window.location.href = `/artwork/${item._id}`}>
                          <img src={item.imageUrl} alt={item.title} />
                        </div>
                        <div className="item-details">
                          <h3 className="item-title">{item.title}</h3>
                          <p className="item-artist">by {item.artistName}</p>
                          <div className="item-price">
                            {this.formatPrice(item.price, item.currency)}
                          </div>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="remove-btn"
                            onClick={() => cartContext.removeFromCart(item._id)}
                            title="Remove from cart"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="cart-summary">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-row">
                      <span>Subtotal ({cartContext.cartCount} {cartContext.cartCount === 1 ? 'item' : 'items'})</span>
                      <span className="summary-value">₹{cartContext.cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                      <span>Tax (18% GST)</span>
                      <span className="summary-value">₹{(cartContext.cartTotal * 0.18).toFixed(2)}</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row summary-total">
                      <span>Total</span>
                      <span className="summary-value">₹{(cartContext.cartTotal * 1.18).toFixed(2)}</span>
                    </div>

                    <button 
                      className="checkout-btn"
                      onClick={() => window.location.href = '/checkout'}
                    >
                      Proceed to Checkout
                    </button>

                    <button 
                      className="continue-shopping-btn"
                      onClick={() => window.location.href = '/explore'}
                    >
                      Continue Shopping
                    </button>

                    <div className="secure-checkout">
                      🔒 Secure Checkout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CartContext.Consumer>
    );
  }
}

export default Cart;
