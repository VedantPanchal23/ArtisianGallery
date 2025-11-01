import React, { useState } from 'react';
import './RatingStars.css';

const RatingStars = ({ 
  value = 0, 
  onChange = null, 
  readonly = false, 
  size = 'medium',
  showValue = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || value;

  return (
    <div className={`rating-stars ${size} ${readonly ? 'readonly' : 'interactive'}`}>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${star <= displayRating ? 'filled' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            type="button"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= displayRating ? '★' : '☆'}
          </button>
        ))}
      </div>
      {showValue && (
        <span className="rating-value">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
