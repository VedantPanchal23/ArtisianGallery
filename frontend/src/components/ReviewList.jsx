import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingStars from './RatingStars';
import './ReviewList.css';

const ReviewList = ({ artworkId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:3000/api/v1';

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/reviews/artwork/${artworkId}?page=${page}&limit=10&sort=${sortBy}`
      );

      if (response.data.success) {
        setReviews(response.data.reviews);
        setRatingStats(response.data.ratingStats);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [artworkId, page, sortBy]);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE_URL}/reviews`,
        {
          artworkId,
          rating: newReview.rating,
          comment: newReview.comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        setRatingStats(response.data.ratingStats);
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Mark review as helpful
  const handleHelpful = async (reviewId) => {
    const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
    if (!token) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReviews(reviews.map(review =>
          review._id === reviewId
            ? { ...review, helpfulCount: response.data.helpfulCount }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(reviews.filter(review => review._id !== reviewId));
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="review-list-container">
      {/* Rating Summary */}
      {ratingStats && (
        <div className="rating-summary">
          <div className="rating-summary-left">
            <div className="average-rating">
              {ratingStats.averageRating.toFixed(1)}
            </div>
            <RatingStars value={ratingStats.averageRating} readonly size="large" />
            <p className="total-reviews">
              {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingStats.distribution?.[star] || 0;
              const percentage = ratingStats.totalReviews > 0
                ? (count / ratingStats.totalReviews) * 100
                : 0;

              return (
                <div key={star} className="rating-bar-row">
                  <span className="star-label">{star} ★</span>
                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <div className="review-actions">
        <button
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </button>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating_high">Highest Rating</option>
          <option value="rating_low">Lowest Rating</option>
        </select>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write Your Review</h3>
          
          <div className="form-group">
            <label>Your Rating</label>
            <RatingStars
              value={newReview.rating}
              onChange={(rating) => setNewReview({ ...newReview, rating })}
              size="large"
            />
          </div>

          <div className="form-group">
            <label htmlFor="review-comment">Your Review</label>
            <textarea
              id="review-comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this artwork..."
              rows="5"
              required
            />
          </div>

          <button type="submit" className="submit-review-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="reviews-loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.reviewerName}</span>
                  {review.verified && (
                    <span className="verified-badge">✓ Verified Purchase</span>
                  )}
                </div>
                <span className="review-date">{formatDate(review.createdAt)}</span>
              </div>

              <div className="review-rating">
                <RatingStars value={review.rating} readonly size="small" />
              </div>

              <p className="review-comment">{review.comment}</p>

              <div className="review-footer">
                <button
                  className="helpful-btn"
                  onClick={() => handleHelpful(review._id)}
                >
                  👍 Helpful ({review.helpfulCount})
                </button>

                {currentUserId === review.reviewer?._id && (
                  <button
                    className="delete-review-btn"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="reviews-pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {pagination.pages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
