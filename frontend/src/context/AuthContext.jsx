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
    
    if (token && user) {
      this.setState({
        isAuthenticated: true,
        user: JSON.parse(user),
        token: token
      });
    }
  }

  login = (user, token) => {
    console.log('AuthContext.login called with:', { user, token });
    localStorage.setItem('arthive_token', token);
    localStorage.setItem('arthive_user', JSON.stringify(user));
    this.setState({
      isAuthenticated: true,
      user: user,
      token: token
    }, () => {
      console.log('AuthContext state updated:', {
        isAuthenticated: this.state.isAuthenticated,
        user: this.state.user
      });
    });
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