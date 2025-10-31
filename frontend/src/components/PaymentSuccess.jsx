import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './PaymentSuccess.css';

class PaymentSuccess extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    // Redirect if not authenticated
    if (!this.context.isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // Get transaction ID from URL
    var urlParams = new URLSearchParams(window.location.search);
    var transactionId = urlParams.get('transactionId');

    if (!transactionId) {
      this.setState({
        error: 'No transaction ID provided',
        isLoading: false
      });
      return;
    }

    this.loadTransactionDetails(transactionId);
  }

  loadTransactionDetails = async (transactionId) => {
    var token = localStorage.getItem('arthive_token');

    try {
      // First, get all orders to find the one with matching transaction ID
      var response = await fetch('http://localhost:3000/api/v1/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        var data = await response.json();
        var transaction = data.transactions.find(t => t.transactionId === transactionId);

        if (transaction) {
          this.setState({
            transaction,
            isLoading: false
          });
        } else {
          this.setState({
            error: 'Transaction not found',
            isLoading: false
          });
        }
      } else {
        var errorData = await response.json();
        this.setState({
          error: errorData.error || 'Failed to load transaction details',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      this.setState({
        error: 'Network error. Please try again later.',
        isLoading: false
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

  formatDate = (dateString) => {
    var date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleDownload = (artworkId, artworkTitle) => {
    // In a real application, this would trigger actual download
    // For now, just show a message
    alert(`Download link for "${artworkTitle}" will be sent to your email shortly.`);
  }

  render() {
    var { transaction, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <div className="payment-success-page">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading transaction details...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="payment-success-page">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.href = '/explore'}>
              Back to Explore
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="payment-success-page">
        <div className="success-container">
          {/* Success Animation */}
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">Your order has been confirmed</p>

          {/* Transaction Info */}
          <div className="transaction-info">
            <div className="info-row">
              <span className="info-label">Transaction ID:</span>
              <span className="info-value transaction-id">{transaction.transactionId}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{this.formatDate(transaction.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Status:</span>
              <span className="status-badge status-completed">{transaction.paymentStatus}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-details">
            <h2>Order Summary</h2>
            
            <div className="artworks-list">
              {transaction.artworks.map((item, index) => (
                <div key={index} className="artwork-item">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="artwork-info">
                    <h3>{item.title}</h3>
                    <p className="artist-name">by {item.artistName}</p>
                    <span className="artwork-price">{this.formatPrice(item.price, item.currency)}</span>
                  </div>
                  <button 
                    className="download-btn"
                    onClick={() => this.handleDownload(item.artwork, item.title)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-amount">{this.formatPrice(transaction.totalAmount, transaction.currency)}</span>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="billing-section">
            <h2>Billing Information</h2>
            <div className="billing-details">
              <p><strong>Name:</strong> {transaction.billingAddress.fullName}</p>
              <p><strong>Address:</strong> {transaction.billingAddress.address}</p>
              <p><strong>City:</strong> {transaction.billingAddress.city}, {transaction.billingAddress.state} {transaction.billingAddress.pincode}</p>
              <p><strong>Country:</strong> {transaction.billingAddress.country}</p>
            </div>
            {transaction.cardDetails && (
              <div className="card-details">
                <p><strong>Payment Method:</strong> {transaction.cardDetails.cardType} ending in {transaction.cardDetails.cardNumber}</p>
              </div>
            )}
          </div>

          {/* Download Notice */}
          <div className="download-notice">
            <p>📧 Download links have been sent to your email: <strong>{transaction.buyerEmail}</strong></p>
            <p>You can also download your artworks from the "My Orders" section in your profile.</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/profile'}
            >
              View My Orders
            </button>
            <button 
              className="btn-secondary"
              onClick={() => window.location.href = '/explore'}
            >
              Continue Shopping
            </button>
          </div>

          {/* Thank You Message */}
          <div className="thank-you">
            <p>Thank you for your purchase! We hope you enjoy your new artwork.</p>
            <p>If you have any questions, feel free to <a href="/contact">contact us</a>.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentSuccess;
