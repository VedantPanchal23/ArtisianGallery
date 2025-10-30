import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UploadArtwork.css';

class UploadArtwork extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      price: '',
      currency: 'INR',
      category: 'digital',
      tags: '',
      imageFile: null,
      imagePreview: null,
      isDragging: false,
      isUploading: false,
      uploadProgress: 0,
      errors: {},
      successMessage: '',
      showDropdown: false
    };
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    // Check if user is artist
    var user = this.context.user;
    if (!user || (user.role !== 'artist' && user.role !== 'admin')) {
      window.location.href = '/';
      return;
    }

    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.profileMenuRef && !this.profileMenuRef.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  }

  getInitials = (name) => {
    if (!name) return 'U';
    var names = name.split(' ');
    var initials = names[0].charAt(0);
    if (names.length > 1) {
      initials += names[1].charAt(0);
    }
    return initials.toUpperCase();
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  }

  handleLogout = () => {
    this.setState({ showDropdown: false });
    this.context.logout();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: { ...this.state.errors, [e.target.name]: '' }
    });
  }

  handleImageSelect = (e) => {
    var file = e.target.files[0];
    this.processImageFile(file);
  }

  handleDragOver = (e) => {
    e.preventDefault();
    this.setState({ isDragging: true });
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({ isDragging: false });
  }

  handleDrop = (e) => {
    e.preventDefault();
    this.setState({ isDragging: false });
    
    var file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      this.processImageFile(file);
    } else {
      this.setState({
        errors: { image: 'Please upload an image file' }
      });
    }
  }

  processImageFile = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.setState({
        errors: { image: 'Please upload an image file' }
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.setState({
        errors: { image: 'Image size should be less than 10MB' }
      });
      return;
    }

    // Create preview
    var reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imageFile: file,
        imagePreview: reader.result,
        errors: { ...this.state.errors, image: '' }
      });
    };
    reader.readAsDataURL(file);
  }

  removeImage = () => {
    this.setState({
      imageFile: null,
      imagePreview: null
    });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
  }

  validateForm = () => {
    var errors = {};
    var { title, description, price, imageFile } = this.state;

    if (!title || title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!description || description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (!imageFile) {
      errors.image = 'Please upload an artwork image';
    }

    this.setState({ errors: errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isUploading: true, uploadProgress: 0, successMessage: '', errors: {} });

    try {
      var token = localStorage.getItem('arthive_token');
      if (!token) {
        throw new Error('Please login to upload artwork');
      }

      // Step 1: Upload image
      var formData = new FormData();
      formData.append('artwork', this.state.imageFile);

      var uploadResponse = await fetch('http://localhost:3000/api/v1/artworks/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        var uploadError = await uploadResponse.json();
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      var uploadData = await uploadResponse.json();
      this.setState({ uploadProgress: 50 });

      // Step 2: Create artwork
      var tagsArray = this.state.tags
        ? this.state.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      var artworkData = {
        title: this.state.title.trim(),
        description: this.state.description.trim(),
        price: parseFloat(this.state.price),
        currency: this.state.currency,
        category: this.state.category,
        tags: tagsArray,
        imageUrl: uploadData.imageUrl,
        thumbnailUrl: uploadData.thumbnailUrl || uploadData.imageUrl,
        fileSize: uploadData.file?.size || 0
      };

      var createResponse = await fetch('http://localhost:3000/api/v1/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(artworkData)
      });

      if (!createResponse.ok) {
        var createError = await createResponse.json();
        throw new Error(createError.message || 'Failed to create artwork');
      }

      var createData = await createResponse.json();
      this.setState({ uploadProgress: 100 });

      // Success
      this.setState({
        successMessage: 'Artwork uploaded successfully! Pending admin approval.',
        title: '',
        description: '',
        price: '',
        currency: 'INR',
        category: 'digital',
        tags: '',
        imageFile: null,
        imagePreview: null
      });

      if (this.fileInputRef.current) {
        this.fileInputRef.current.value = '';
      }

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/my-uploads';
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      this.setState({
        errors: { submit: error.message || 'Failed to upload artwork' }
      });
    } finally {
      this.setState({ isUploading: false });
    }
  }

  render() {
    var user = this.context.user;
    var {
      title,
      description,
      price,
      currency,
      category,
      tags,
      imagePreview,
      isDragging,
      isUploading,
      uploadProgress,
      errors,
      successMessage,
      showDropdown
    } = this.state;

    return (
      <div className="upload-artwork-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">ArtHive</div>
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/explore">Explore</a></li>
                <li><a href="/my-uploads">My Uploads</a></li>
                <li>
                  <div className="profile-menu" ref={(ref) => this.profileMenuRef = ref}>
                    <div className="profile-circle" onClick={this.toggleDropdown}>
                      {this.getInitials(user?.name)}
                    </div>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        <div className="dropdown-header">
                          <div className="dropdown-avatar">
                            {this.getInitials(user?.name)}
                          </div>
                          <div className="dropdown-user-info">
                            <p className="dropdown-name">{user?.name}</p>
                            <p className="dropdown-email">{user?.email}</p>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <a href="/my-uploads" className="dropdown-item">My Uploads</a>
                        <a href="/explore" className="dropdown-item">Explore</a>
                        <div className="dropdown-divider"></div>
                        <button onClick={this.handleLogout} className="dropdown-item logout-item">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="upload-container">
          <div className="upload-header">
            <h1>Upload New Artwork</h1>
            <p>Share your creative work with the ArtHive community</p>
          </div>

          {successMessage && (
            <div className="success-banner">
              ✓ {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="error-banner">
              ✗ {errors.submit}
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="upload-form">
            {/* Image Upload Section */}
            <div className="form-section">
              <label className="section-label">Artwork Image *</label>
              
              <div
                className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                onClick={() => !imagePreview && this.fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button type="button" className="remove-image-btn" onClick={this.removeImage}>
                      ✕ Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📁</div>
                    <p className="upload-text">Drag and drop your artwork here</p>
                    <p className="upload-subtext">or click to browse</p>
                    <p className="upload-requirements">PNG, JPG, GIF, WEBP (Max 10MB)</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={this.fileInputRef}
                accept="image/*"
                onChange={this.handleImageSelect}
                style={{ display: 'none' }}
              />

              {errors.image && <div className="error-message">{errors.image}</div>}
            </div>

            {/* Artwork Details */}
            <div className="form-section">
              <label className="section-label">Artwork Title *</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={this.handleChange}
                placeholder="Enter a captivating title for your artwork"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                maxLength="100"
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>

            <div className="form-section">
              <label className="section-label">Description *</label>
              <textarea
                name="description"
                value={description}
                onChange={this.handleChange}
                placeholder="Describe your artwork, inspiration, technique, and story..."
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                rows="6"
                maxLength="2000"
              />
              <div className="character-count">{description.length}/2000</div>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>

            {/* Price and Category Row */}
            <div className="form-row">
              <div className="form-section">
                <label className="section-label">Price *</label>
                <div className="price-input-group">
                  <select
                    name="currency"
                    value={currency}
                    onChange={this.handleChange}
                    className="currency-select"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={this.handleChange}
                    placeholder="0.00"
                    className={`form-input price-input ${errors.price ? 'input-error' : ''}`}
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>

              <div className="form-section">
                <label className="section-label">Category *</label>
                <select
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                  className="form-select"
                >
                  <option value="digital">Digital Art</option>
                  <option value="abstract">Abstract</option>
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="photography">Photography</option>
                  <option value="illustration">Illustration</option>
                  <option value="3d">3D Art</option>
                  <option value="painting">Painting</option>
                  <option value="nature">Nature</option>
                  <option value="urban">Urban</option>
                  <option value="space">Space</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <label className="section-label">Tags (Optional)</label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={this.handleChange}
                placeholder="e.g. abstract, colorful, modern (separated by commas)"
                className="form-input"
              />
              <div className="help-text">Add relevant tags to help people discover your artwork</div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => window.location.href = '/my-uploads'}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isUploading}
              >
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Artwork'}
              </button>
            </div>

            {isUploading && (
              <div className="upload-progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default UploadArtwork;
