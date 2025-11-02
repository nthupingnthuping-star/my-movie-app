import React, { useState } from 'react';

function Rating({ initialRating = 0, onRatingChange, readonly = false }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (readonly) return;
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`fs-3 ${
            star <= (hover || rating) ? "text-warning" : "text-secondary"
          } ${!readonly ? "cursor-pointer" : ""}`}
          style={{ 
            cursor: readonly ? 'default' : 'pointer',
            marginRight: '2px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default Rating;