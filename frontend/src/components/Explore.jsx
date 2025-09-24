import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Explore.css';

class Explore extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedCategory: 'all',
      priceRange: 'all',
      sortBy: 'newest',
      artworks: [
        {
          id: 1,
          title: "Digital Sunset",
          artist: "Sarah Chen",
          price: 350,
          category: "landscape",
          image: "/api/placeholder/300/400",
          tags: ["sunset", "digital", "landscape"],
          createdAt: "2024-12-01"
        },
        {
          id: 2,
          title: "Neon Dreams",
          artist: "Alex Rodriguez",
          price: 650,
          category: "abstract",
          image: "/api/placeholder/300/400",
          tags: ["neon", "cyberpunk", "abstract"],
          createdAt: "2024-11-28"
        },
        {
          id: 3,
          title: "Portrait Study #3",
          artist: "Maya Patel",
          price: 280,
          category: "portrait",
          image: "/api/placeholder/300/400",
          tags: ["portrait", "study", "realistic"],
          createdAt: "2024-11-25"
        },
        {
          id: 4,
          title: "Cosmic Journey",
          artist: "David Kim",
          price: 750,
          category: "space",
          image: "/api/placeholder/300/400",
          tags: ["space", "cosmic", "journey"],
          createdAt: "2024-11-20"
        },
        {
          id: 5,
          title: "Urban Fragments",
          artist: "Lisa Zhang",
          price: 425,
          category: "urban",
          image: "/api/placeholder/300/400",
          tags: ["urban", "city", "fragments"],
          createdAt: "2024-11-15"
        },
        {
          id: 6,
          title: "Botanical Dreams",
          artist: "Carlos Mendez",
          price: 320,
          category: "nature",
          image: "/api/placeholder/300/400",
          tags: ["botanical", "nature", "dreams"],
          createdAt: "2024-11-10"
        },
        {
          id: 7,
          title: "Geometric Harmony",
          artist: "Anna Kowalski",
          price: 680,
          category: "abstract",
          image: "/api/placeholder/300/400",
          tags: ["geometric", "harmony", "abstract"],
          createdAt: "2024-11-05"
        },
        {
          id: 8,
          title: "Ocean Depths",
          artist: "James Wilson",
          price: 580,
          category: "landscape",
          image: "/api/placeholder/300/400",
          tags: ["ocean", "depths", "underwater"],
          createdAt: "2024-10-30"
        }
      ]
    };
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleCategoryChange = (e) => {
    this.setState({ selectedCategory: e.target.value });
  }

  handlePriceRangeChange = (e) => {
    this.setState({ priceRange: e.target.value });
  }

  handleSortChange = (e) => {
    this.setState({ sortBy: e.target.value });
  }

  getFilteredAndSortedArtworks = () => {
    let filtered = [...this.state.artworks];

    // Filter by search term
    if (this.state.searchTerm) {
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (this.state.selectedCategory !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === this.state.selectedCategory);
    }

    // Filter by price range
    if (this.state.priceRange !== 'all') {
      filtered = filtered.filter(artwork => {
        switch (this.state.priceRange) {
          case 'under300': return artwork.price < 300;
          case '300to500': return artwork.price >= 300 && artwork.price <= 500;
          case '500to700': return artwork.price >= 500 && artwork.price <= 700;
          case 'over700': return artwork.price > 700;
          default: return true;
        }
      });
    }

    // Sort artworks
    filtered.sort((a, b) => {
      switch (this.state.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }

  render() {
    const { isAuthenticated } = this.context;
    const filteredArtworks = this.getFilteredAndSortedArtworks();

    return (
      <div className="explore-page">
        {/* Navigation Bar */}
        <nav className="explore-navbar">
          <div className="nav-container">
            <div className="logo">
              <a href="/">ArtHive</a>
            </div>
            <div className="nav-links">
              <a href="/">Home</a>
              <a href="/explore" className="active">Explore</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              {isAuthenticated && <a href="/cart">Cart</a>}
              {!isAuthenticated && <a href="/login">Login</a>}
              {!isAuthenticated && <a href="/signup">Sign Up</a>}
              {isAuthenticated && (
                <button className="logout-btn" onClick={this.context.logout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="explore-hero">
          <div className="hero-content">
            <h1>Discover Amazing Digital Art</h1>
            <p>Explore our curated collection of unique digital artworks from talented artists worldwide</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search artworks, artists, or tags..."
                value={this.state.searchTerm}
                onChange={this.handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select value={this.state.selectedCategory} onChange={this.handleCategoryChange}>
                <option value="all">All Categories</option>
                <option value="abstract">Abstract</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="nature">Nature</option>
                <option value="urban">Urban</option>
                <option value="space">Space</option>
              </select>

              <select value={this.state.priceRange} onChange={this.handlePriceRangeChange}>
                <option value="all">All Prices</option>
                <option value="under300">Under ₹300</option>
                <option value="300to500">₹300 - ₹500</option>
                <option value="500to700">₹500 - ₹700</option>
                <option value="over700">Over ₹700</option>
              </select>

              <select value={this.state.sortBy} onChange={this.handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </section>

        {/* Artworks Grid */}
        <section className="artworks-section">
          <div className="artworks-container">
            <div className="results-info">
              <h2>
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'} found
              </h2>
            </div>
            
            <div className="artworks-grid">
              {filteredArtworks.map(artwork => (
                <div key={artwork.id} className="artwork-card">
                  <div className="artwork-image">
                    <img src={artwork.image} alt={artwork.title} />
                    <div className="artwork-overlay">
                      <button className="view-btn">View Details</button>
                      {isAuthenticated && (
                        <button className="add-to-cart-btn">Add to Cart</button>
                      )}
                    </div>
                  </div>
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <p className="artwork-artist">by {artwork.artist}</p>
                    <div className="artwork-tags">
                      {artwork.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="artwork-price">₹{artwork.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArtworks.length === 0 && (
              <div className="no-results">
                <h3>No artworks found</h3>
                <p>Try adjusting your search criteria or browse all categories.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default Explore;