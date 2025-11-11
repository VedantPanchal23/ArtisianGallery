import React, { Component } from 'react';

const CartContext = React.createContext();

class CartProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      cartCount: 0,
      cartTotal: 0
    };
  }

  componentDidMount() {
    // Load cart from localStorage
    this.loadCart();
  }

  loadCart = () => {
    try {
      var cartData = localStorage.getItem('arthive_cart');
      if (cartData) {
        var cart = JSON.parse(cartData);
        this.setState({
          cart: cart,
          cartCount: cart.length,
          cartTotal: this.calculateTotal(cart)
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('arthive_cart');
    }
  }

  calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  saveCart = (cart) => {
    try {
      localStorage.setItem('arthive_cart', JSON.stringify(cart));
      this.setState({
        cart: cart,
        cartCount: cart.length,
        cartTotal: this.calculateTotal(cart)
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  addToCart = (artwork) => {
    var cart = [...this.state.cart];
    
    // Check if artwork already in cart
    var existingIndex = cart.findIndex(item => item._id === artwork._id);
    
    if (existingIndex === -1) {
      // Add new item
      cart.push({
        _id: artwork._id,
        title: artwork.title,
        price: artwork.price,
        currency: artwork.currency || 'INR',
        imageUrl: artwork.thumbnailUrl || artwork.imageUrl,
        artistName: artwork.artistName,
        quantity: 1
      });
      
      this.saveCart(cart);
      return { success: true, message: 'Added to cart successfully!' };
    } else {
      return { success: false, message: 'Already in cart!' };
    }
  }

  removeFromCart = (artworkId) => {
    var cart = this.state.cart.filter(item => item._id !== artworkId);
    this.saveCart(cart);
  }

  updateQuantity = (artworkId, quantity) => {
    if (quantity < 1) {
      this.removeFromCart(artworkId);
      return;
    }
    
    var cart = this.state.cart.map(item => {
      if (item._id === artworkId) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    
    this.saveCart(cart);
  }

  clearCart = () => {
    localStorage.removeItem('arthive_cart');
    this.setState({
      cart: [],
      cartCount: 0,
      cartTotal: 0
    });
  }

  isInCart = (artworkId) => {
    return this.state.cart.some(item => item._id === artworkId);
  }

  render() {
    return (
      <CartContext.Provider value={{
        ...this.state,
        addToCart: this.addToCart,
        removeFromCart: this.removeFromCart,
        updateQuantity: this.updateQuantity,
        clearCart: this.clearCart,
        isInCart: this.isInCart,
        loadCart: this.loadCart
      }}>
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export { CartContext, CartProvider };
