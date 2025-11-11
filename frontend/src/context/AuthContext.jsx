import React, { Component } from 'react';

const AuthContext = React.createContext();

class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: true, // Add loading state
      error: null
    };
  }

  componentDidMount() {
    this.initializeAuth();
  }

  initializeAuth = () => {
    try {
      // Check if user is already logged in
      const token = localStorage.getItem('arthive_token');
      const user = localStorage.getItem('arthive_user');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext - Initializing authentication');
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user);
      }
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          
          // Validate user object has required fields
          if (parsedUser && parsedUser._id && parsedUser.email) {
            if (process.env.NODE_ENV === 'development') {
              console.log('AuthContext - Authentication restored');
              console.log('User:', parsedUser.name, '| Role:', parsedUser.role);
            }
            
            this.setState({
              isAuthenticated: true,
              user: parsedUser,
              token: token,
              loading: false
            });
          } else {
            throw new Error('Invalid user data structure');
          }
        } catch (parseError) {
          console.error('AuthContext - Error parsing user data:', parseError.message);
          // Clear invalid data
          this.clearAuthData();
          this.setState({ loading: false });
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext - No authentication data found');
        }
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('AuthContext - Initialization error:', error);
      this.setState({ 
        loading: false,
        error: 'Failed to initialize authentication'
      });
    }
  }

  clearAuthData = () => {
    localStorage.removeItem('arthive_token');
    localStorage.removeItem('arthive_user');
    localStorage.removeItem('arthive_cart'); // Also clear cart on logout
  }

  login = (user, token) => {
    try {
      if (!user || !token) {
        throw new Error('User and token are required for login');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext - Login successful');
        console.log('User:', user.name, '| Role:', user.role);
      }
      
      // Store in localStorage
      localStorage.setItem('arthive_token', token);
      localStorage.setItem('arthive_user', JSON.stringify(user));
      
      // Update state
      this.setState({
        isAuthenticated: true,
        user: user,
        token: token,
        error: null
      });
    } catch (error) {
      console.error('AuthContext - Login error:', error.message);
      this.setState({
        error: error.message
      });
    }
  }

  logout = () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext - Logging out');
      }

      // Clear all auth data
      this.clearAuthData();
      
      // Reset state
      this.setState({
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      });
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('AuthContext - Logout error:', error.message);
    }
  }

  updateUser = (updatedUser) => {
    try {
      // Merge with existing user data
      const newUser = { ...this.state.user, ...updatedUser };
      
      // Update localStorage
      localStorage.setItem('arthive_user', JSON.stringify(newUser));
      
      // Update state
      this.setState({ user: newUser });
    } catch (error) {
      console.error('AuthContext - Update user error:', error.message);
    }
  }

  render() {
    const contextValue = {
      ...this.state,
      login: this.login,
      logout: this.logout,
      updateUser: this.updateUser,
      clearError: () => this.setState({ error: null })
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export { AuthContext, AuthProvider };