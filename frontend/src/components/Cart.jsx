import React, { Component } from 'react';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ProfileDropdown from './ProfileDropdown';
import { Icon } from './icons';
import './Cart.css';

class Cart extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
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

    return (
      <CartContext.Consumer>
        {(cartContext) => (
          <div className="cart-page">
            {/* Navbar */}
            <nav className="navbar">
              <div className="nav-container">
                <div className="logo" onClick={() => window.location.href = '/'}>ArtHive</div>
                <div className="nav-right">
                  <ProfileDropdown
                    user={user}
                    onLogout={this.context.logout}
                  />
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
                  <Icon name="shopping-cart" size={64} className="empty-cart-icon" />
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
                            <X size={16} />
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
                      <Icon name="shield" size={16} className="icon--inline" /> Secure Checkout
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
