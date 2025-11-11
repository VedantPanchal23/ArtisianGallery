/**
 * API Utility Functions
 * Provides consistent error handling and API calls across the application
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Get authentication token from localStorage
 * @returns {string|null} The auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('arthive_token') || localStorage.getItem('token');
};

/**
 * Get auth headers for API requests
 * @returns {Object} Headers object
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, context = 'API') => {
  console.error(`${context} Error:`, error);

  // Handle network errors
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR'
    };
  }

  // Handle authentication errors
  if (error.response.status === 401) {
    const errorCode = error.response.data?.code;
    
    if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'TOKEN_INVALID') {
      // Clear auth data and redirect to login
      localStorage.removeItem('arthive_token');
      localStorage.removeItem('arthive_user');
      window.location.href = '/login?expired=true';
      return {
        success: false,
        message: 'Session expired. Please login again.',
        code: errorCode
      };
    }
  }

  // Handle blocked account
  if (error.response.status === 403 && error.response.data?.code === 'ACCOUNT_BLOCKED') {
    localStorage.removeItem('arthive_token');
    localStorage.removeItem('arthive_user');
    window.location.href = '/login?blocked=true';
    return {
      success: false,
      message: error.response.data.message,
      code: 'ACCOUNT_BLOCKED'
    };
  }

  // Return the error response from server
  return {
    success: false,
    message: error.response.data?.message || 'An error occurred',
    code: error.response.data?.code || 'UNKNOWN_ERROR',
    errors: error.response.data?.errors
  };
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: getAuthHeaders(),
      ...options
    };

    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: data
        }
      };
    }

    return data;
  } catch (error) {
    throw handleApiError(error, endpoint);
  }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response data
 */
export const apiGet = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiRequest(url, { method: 'GET' });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const apiPost = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export const apiPut = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} Response data
 */
export const apiDelete = async (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

/**
 * Format error message for display
 * @param {Object} error - Error object
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = localStorage.getItem('arthive_user');
  return !!(token && user);
};

/**
 * Get current user data
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('arthive_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Format price with currency symbol
 * @param {number} price - Price amount
 * @param {string} currency - Currency code (INR, USD, EUR, GBP)
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = 'INR') => {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };
  return `${symbols[currency] || '₹'}${parseFloat(price).toFixed(2)}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getAuthToken,
  getAuthHeaders,
  handleApiError,
  formatErrorMessage,
  isAuthenticated,
  getCurrentUser,
  formatPrice,
  formatDate,
  formatRelativeTime,
  debounce,
  isValidEmail,
  truncateText
};
