import React, { Component } from 'react';

const AuthContext = React.createContext();

class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  componentDidMount() {
    // Check if user is already logged in
    const token = localStorage.getItem('arthive_token');
    const user = localStorage.getItem('arthive_user');
    
    console.log('AuthContext - Checking localStorage');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('AuthContext - Setting authenticated state');
        console.log('User data:', parsedUser);
        this.setState({
          isAuthenticated: true,
          user: parsedUser,
          token: token
        });
      } catch (error) {
        console.error('AuthContext - Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('arthive_token');
        localStorage.removeItem('arthive_user');
      }
    } else {
      console.log('AuthContext - No valid authentication data found');
    }
  }

  login = (user, token) => {
    console.log('AuthContext - Login called');
    console.log('User:', user);
    console.log('Token:', token);
    
    localStorage.setItem('arthive_token', token);
    localStorage.setItem('arthive_user', JSON.stringify(user));
    
    this.setState({
      isAuthenticated: true,
      user: user,
      token: token
    });
    
    console.log('AuthContext - State updated, isAuthenticated:', true);
  }

  logout = () => {
    localStorage.removeItem('arthive_token');
    localStorage.removeItem('arthive_user');
    this.setState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    window.location.href = '/';
  }

  render() {
    return (
      <AuthContext.Provider value={{
        ...this.state,
        login: this.login,
        logout: this.logout
      }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export { AuthContext, AuthProvider };