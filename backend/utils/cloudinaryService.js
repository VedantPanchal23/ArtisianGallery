const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
// Check if environment variables are set
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.log('⚠️ Cloudinary not configured - using local storage fallback');
}

// Configure Cloudinary storage for multer
const storage = isCloudinaryConfigured() 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'arthive/artworks',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 1920, height: 1920, crop: 'limit' }
        ]
      }
    })
  : multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'public/uploads/artworks');
      },
      filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'artwork-' + uniqueSuffix + '-' + file.originalname);
      }
    });

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  // Check file mimetype
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload single artwork image
const uploadArtworkImage = upload.single('artwork');

// Upload multiple images (for future use)
const uploadMultipleImages = upload.array('artworks', 5);

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  if (!isCloudinaryConfigured()) {
    console.log('Cloudinary not configured - skipping delete');
    return { success: true };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!isCloudinaryConfigured()) {
    return publicId; // Return original URL if Cloudinary not configured
  }

  const defaultOptions = {
    width: 800,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, finalOptions);
};

// Get thumbnail URL
const getThumbnailUrl = (publicId) => {
  return getOptimizedImageUrl(publicId, {
    width: 400,
    height: 400,
    crop: 'fill'
  });
};

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  
  // For local storage
  if (url.includes('/uploads/artworks/')) {
    return url;
  }
  
  // For Cloudinary URLs
  const matches = url.match(/\/v\d+\/(.+)\./);
  return matches ? matches[1] : null;
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  try {
    await cloudinary.api.ping();
    return true;
  } catch (error) {
    console.error('Cloudinary connection test failed:', error);
    return false;
  }
};

module.exports = {
  uploadArtworkImage,
  uploadMultipleImages,
  deleteImage,
  getOptimizedImageUrl,
  getThumbnailUrl,
  extractPublicId,
  testCloudinaryConnection,
  isCloudinaryConfigured
};
