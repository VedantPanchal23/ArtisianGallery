import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

class Checkout extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      // Billing Address
      fullName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      
      // Card Details
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      
      // UI State
      isProcessing: false,
      errors: {},
      showCardPreview: false
    };
  }

  componentDidMount() {
    // Redirect if not authenticated
    if (!this.context.isAuthenticated) {
      window.location.href = '/login?redirect=/checkout';
      return;
    }

    // Pre-fill name from user profile
    var user = this.context.user;
    if (user) {
      this.setState({
        fullName: user.name || '',
        cardholderName: user.name || ''
      });
    }
  }

  validateForm = () => {
    var errors = {};
    var { fullName, address, city, state, pincode, country, cardNumber, cardholderName, expiryMonth, expiryYear, cvv } = this.state;

    // Billing validation
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!address.trim()) errors.address = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode)) errors.pincode = 'Invalid pincode (6 digits)';
    if (!country.trim()) errors.country = 'Country is required';

    // Card validation
    if (!cardNumber.trim()) errors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Invalid card number (16 digits)';
    
    if (!cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    
    if (!expiryMonth) errors.expiryMonth = 'Month required';
    if (!expiryYear) errors.expiryYear = 'Year required';
    
    if (expiryMonth && expiryYear) {
      var currentDate = new Date();
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth() + 1;
      var expYear = parseInt(expiryYear);
      var expMonth = parseInt(expiryMonth);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errors.expiryMonth = 'Card expired';
      }
    }
    
    if (!cvv.trim()) errors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'Invalid CVV (3-4 digits)';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  formatCardNumber = (value) => {
    var cleaned = value.replace(/\D/g, '');
    var formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  }

  handleCardNumberChange = (e) => {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      this.setState({ cardNumber: value, showCardPreview: true });
    }
  }

  handleExpiryMonthChange = (e) => {
    var value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      this.setState({ expiryMonth: value });
    }
  }

  handleExpiryYearChange = (e) => {
    var value = e.target.value;
    var currentYear = new Date().getFullYear();
    if (value === '' || (parseInt(value) >= currentYear && parseInt(value) <= currentYear + 20)) {
      this.setState({ expiryYear: value });
    }
  }

  handleCVVChange = (e) => {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      this.setState({ cvv: value });
    }
  }

  handlePincodeChange = (e) => {
    var value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      this.setState({ pincode: value });
    }
  }

  getCardType = (cardNumber) => {
    var firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    if (firstDigit === '6') return 'RuPay';
    return 'Unknown';
  }

  handleSubmit = async (e, cartContext) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    if (cartContext.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.setState({ isProcessing: true });

    var token = localStorage.getItem('arthive_token');
    var { fullName, address, city, state, pincode, country, cardNumber, cardholderName, expiryMonth, expiryYear, cvv } = this.state;

    // Prepare order data
    var orderData = {
      artworks: cartContext.cart.map(item => ({
        artwork: item._id,
        quantity: 1
      })),
      billingAddress: {
        fullName,
        address,
        city,
        state,
        pincode,
        country
      },
      cardDetails: {
        cardNumber: cardNumber.slice(-4), // Only last 4 digits
        cardType: this.getCardType(cardNumber),
        cardholderName,
        expiryMonth,
        expiryYear
      },
      paymentMethod: 'mock'
    };

    try {
      var response = await fetch('http://localhost:3000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      var data = await response.json();

      if (response.ok) {
        // Clear cart
        cartContext.clearCart();
        
        // Redirect to success page
        window.location.href = `/payment-success?transactionId=${data.transaction.transactionId}`;
      } else {
        this.setState({
          isProcessing: false,
          errors: { submit: data.error || 'Payment failed. Please try again.' }
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      this.setState({
        isProcessing: false,
        errors: { submit: 'Network error. Please check your connection.' }
      });
    }
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
    var { fullName, address, city, state, pincode, country, cardNumber, cardholderName, expiryMonth, expiryYear, cvv, isProcessing, errors, showCardPreview } = this.state;

    return (
      <CartContext.Consumer>
        {(cartContext) => (
          <div className="checkout-page">
            <div className="checkout-container">
              {/* Header */}
              <div className="checkout-header">
                <h1>Secure Checkout</h1>
                <div className="secure-badge">
                  🔒 SSL Encrypted
                </div>
              </div>

              <div className="checkout-content">
                {/* Left Side - Forms */}
                <div className="checkout-forms">
                  {/* Billing Address */}
                  <div className="form-section">
                    <h2>Billing Address</h2>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => this.setState({ fullName: e.target.value })}
                          placeholder="John Doe"
                          className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Address *</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => this.setState({ address: e.target.value })}
                          placeholder="123 Main Street, Apartment 4B"
                          className={errors.address ? 'error' : ''}
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => this.setState({ city: e.target.value })}
                          placeholder="Mumbai"
                          className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-text">{errors.city}</span>}
                      </div>

                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => this.setState({ state: e.target.value })}
                          placeholder="Maharashtra"
                          className={errors.state ? 'error' : ''}
                        />
                        {errors.state && <span className="error-text">{errors.state}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={this.handlePincodeChange}
                          placeholder="400001"
                          maxLength="6"
                          className={errors.pincode ? 'error' : ''}
                        />
                        {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                      </div>

                      <div className="form-group">
                        <label>Country *</label>
                        <select
                          value={country}
                          onChange={(e) => this.setState({ country: e.target.value })}
                          className={errors.country ? 'error' : ''}
                        >
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Canada">Canada</option>
                        </select>
                        {errors.country && <span className="error-text">{errors.country}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="form-section">
                    <h2>Payment Information</h2>
                    
                    {showCardPreview && cardNumber.length >= 4 && (
                      <div className="card-preview">
                        <div className="card-chip"></div>
                        <div className="card-number-display">
                          {this.formatCardNumber(cardNumber.padEnd(16, '•'))}
                        </div>
                        <div className="card-details-display">
                          <div className="card-holder">{cardholderName || 'CARDHOLDER NAME'}</div>
                          <div className="card-expiry">
                            {expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear.slice(-2)}` : 'MM/YY'}
                          </div>
                        </div>
                        <div className="card-type">{this.getCardType(cardNumber)}</div>
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          value={this.formatCardNumber(cardNumber)}
                          onChange={this.handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Cardholder Name *</label>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => this.setState({ cardholderName: e.target.value.toUpperCase() })}
                          placeholder="JOHN DOE"
                          className={errors.cardholderName ? 'error' : ''}
                        />
                        {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Month *</label>
                        <input
                          type="number"
                          value={expiryMonth}
                          onChange={this.handleExpiryMonthChange}
                          placeholder="MM"
                          min="1"
                          max="12"
                          className={errors.expiryMonth ? 'error' : ''}
                        />
                        {errors.expiryMonth && <span className="error-text">{errors.expiryMonth}</span>}
                      </div>

                      <div className="form-group">
                        <label>Expiry Year *</label>
                        <input
                          type="number"
                          value={expiryYear}
                          onChange={this.handleExpiryYearChange}
                          placeholder="YYYY"
                          min={new Date().getFullYear()}
                          className={errors.expiryYear ? 'error' : ''}
                        />
                        {errors.expiryYear && <span className="error-text">{errors.expiryYear}</span>}
                      </div>

                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={this.handleCVVChange}
                          placeholder="123"
                          maxLength="4"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="error-banner">
                      {errors.submit}
                    </div>
                  )}
                </div>

                {/* Right Side - Order Summary */}
                <div className="order-summary-section">
                  <div className="order-summary-sticky">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-items">
                      {cartContext.cart.map((item) => (
                        <div key={item._id} className="summary-item">
                          <img src={item.imageUrl} alt={item.title} />
                          <div className="summary-item-info">
                            <h4>{item.title}</h4>
                            <p>{item.artistName}</p>
                            <span className="summary-item-price">{this.formatPrice(item.price, item.currency)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="summary-calculations">
                      <div className="summary-row">
                        <span>Subtotal ({cartContext.cartCount} items)</span>
                        <span>₹{cartContext.cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax (GST 18%)</span>
                        <span>₹{(cartContext.cartTotal * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="summary-divider"></div>
                      <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>₹{(cartContext.cartTotal * 1.18).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      className="pay-button"
                      onClick={(e) => this.handleSubmit(e, cartContext)}
                      disabled={isProcessing || cartContext.cart.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>Pay ₹{(cartContext.cartTotal * 1.18).toFixed(2)}</>
                      )}
                    </button>

                    <div className="payment-security">
                      <div className="security-item">🔒 SSL Encrypted</div>
                      <div className="security-item">✓ 100% Secure Payment</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CartContext.Consumer>
    );
  }
}

export default Checkout;
