/**
 * Application Constants
 * Centralized constants for consistent usage across the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  BACKEND_URL: 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
};

/**
 * Get full image URL - handles both Cloudinary and local uploads
 * @param {string} imageUrl - The image URL from the API
 * @returns {string} Full image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return DEFAULTS.ARTWORK_IMAGE;
  }
  
  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // For local uploads, prepend the backend URL
  return `${API_CONFIG.BACKEND_URL}${imageUrl}`;
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'arthive_token',
  USER: 'arthive_user',
  CART: 'arthive_cart',
  VIEWED_ARTWORKS: 'arthive_viewed_artworks',
  THEME: 'arthive_theme'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ARTIST: 'artist',
  ADMIN: 'admin'
};

// Artwork Categories
export const ARTWORK_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'digital', label: 'Digital Art' },
  { value: 'photography', label: 'Photography' },
  { value: 'illustration', label: 'Illustration' },
  { value: '3d', label: '3D Art' },
  { value: 'painting', label: 'Painting' },
  { value: 'nature', label: 'Nature' },
  { value: 'urban', label: 'Urban' },
  { value: 'space', label: 'Space' },
  { value: 'other', label: 'Other' }
];

// Price Ranges
export const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: 'under300', label: 'Under ₹300', min: 0, max: 300 },
  { value: '300to500', label: '₹300 - ₹500', min: 300, max: 500 },
  { value: '500to700', label: '₹500 - ₹700', min: 500, max: 700 },
  { value: 'over700', label: 'Over ₹700', min: 700, max: Infinity }
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'title', label: 'Title A-Z' }
];

// Currency Symbols
export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

// Artwork Status
export const ARTWORK_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ARTWORK_APPROVED: 'artwork_approved',
  ARTWORK_REJECTED: 'artwork_rejected',
  ARTWORK_LIKED: 'artwork_liked',
  NEW_FOLLOWER: 'new_follower',
  ARTWORK_SOLD: 'artwork_sold',
  ORDER_PLACED: 'order_placed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed'
};

// Notification Icons
export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.ARTWORK_APPROVED]: '✅',
  [NOTIFICATION_TYPES.ARTWORK_REJECTED]: '❌',
  [NOTIFICATION_TYPES.ARTWORK_LIKED]: '❤️',
  [NOTIFICATION_TYPES.NEW_FOLLOWER]: '👤',
  [NOTIFICATION_TYPES.ARTWORK_SOLD]: '💰',
  [NOTIFICATION_TYPES.ORDER_PLACED]: '📦',
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: '✅',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: '❌'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'netbanking',
  WALLET: 'wallet'
};

// Error Codes
export const ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ACCOUNT_BLOCKED: 'ACCOUNT_BLOCKED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  REVIEW_LIMIT: 10,
  NOTIFICATION_LIMIT: 20,
  MAX_LIMIT: 100
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
};

// Validation Rules
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  BIO: {
    MAX_LENGTH: 500
  },
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000
  },
  REVIEW: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  }
};

// Timeouts
export const TIMEOUTS = {
  DEBOUNCE: 500,
  TOAST: 3000,
  REDIRECT: 2000,
  SESSION_CHECK: 60000, // 1 minute
  NOTIFICATION_POLL: 60000 // 1 minute
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  EXPLORE: '/explore',
  ARTWORK_DETAIL: '/artwork/:id',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  UPLOAD: '/upload-artwork',
  MY_UPLOADS: '/my-uploads',
  ADMIN: '/admin',
  NOTIFICATIONS: '/notifications',
  ABOUT: '/about',
  CONTACT: '/contact'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9]+$/,
  PHONE: /^[0-9]{10}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 5
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Feature Flags
export const FEATURES = {
  REVIEWS: true,
  NOTIFICATIONS: true,
  SOCIAL: true,
  ANALYTICS: true,
  DARK_MODE: false // Not implemented yet
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/arthive',
  TWITTER: 'https://twitter.com/arthive',
  INSTAGRAM: 'https://instagram.com/arthive',
  LINKEDIN: 'https://linkedin.com/company/arthive'
};

// Contact Information
export const CONTACT = {
  EMAIL: 'support@arthive.com',
  PHONE: '+91 1234567890',
  ADDRESS: '123 Art Street, Mumbai, India'
};

// Default Values
export const DEFAULTS = {
  AVATAR: 'https://via.placeholder.com/150',
  ARTWORK_IMAGE: 'https://via.placeholder.com/800x600',
  PAGE_TITLE: 'ArtHive - Digital Art Marketplace',
  META_DESCRIPTION: 'Discover and purchase unique digital artworks from talented artists worldwide.'
};

export default {
  API_CONFIG,
  STORAGE_KEYS,
  USER_ROLES,
  ARTWORK_CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  CURRENCY_SYMBOLS,
  ARTWORK_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_ICONS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  ERROR_CODES,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  TIMEOUTS,
  ROUTES,
  HTTP_STATUS,
  REGEX,
  RATING,
  THEME,
  FEATURES,
  SOCIAL_LINKS,
  CONTACT,
  DEFAULTS
};
