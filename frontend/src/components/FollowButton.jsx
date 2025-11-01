import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FollowButton.css';

const FollowButton = ({ artistId, initialIsFollowing = false, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const API_BASE_URL = 'http://localhost:3000/api/v1';

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  // Fetch followers count
  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${artistId}/followers?limit=1`);
        if (response.data.success) {
          setFollowersCount(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching followers count:', error);
      }
    };

    if (artistId) {
      fetchFollowersCount();
    }
  }, [artistId]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem('arthive_token') || localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to follow artists');
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      const response = await axios.post(
        `${API_BASE_URL}/users/${artistId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
        setFollowersCount(response.data.followersCount);
        
        // Callback for parent component
        if (onFollowChange) {
          onFollowChange(response.data.isFollowing, response.data.followersCount);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      if (error.response?.status === 401) {
        alert('Please login to follow artists');
        window.location.href = '/login';
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="follow-button-container">
      <button
        className={`follow-btn ${isFollowing ? 'following' : ''}`}
        onClick={handleFollowToggle}
        disabled={loading}
      >
        {loading ? (
          <span className="follow-btn-loading">...</span>
        ) : isFollowing ? (
          <>
            <span className="follow-icon">✓</span>
            Following
          </>
        ) : (
          <>
            <span className="follow-icon">+</span>
            Follow
          </>
        )}
      </button>
      {followersCount > 0 && (
        <span className="followers-count">
          {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  );
};

export default FollowButton;
