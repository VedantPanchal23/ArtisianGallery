# Quick API Reference - New Advanced Features

## Social Features

### Follow Artist
```http
POST /api/v1/users/:userId/follow
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Successfully followed user",
  "isFollowing": true,
  "followersCount": 25
}
```

### Unfollow Artist
```http
POST /api/v1/users/:userId/unfollow
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Successfully unfollowed user",
  "isFollowing": false,
  "followersCount": 24
}
```

### Get Followers
```http
GET /api/v1/users/:userId/followers?page=1&limit=20
Authorization: Bearer <token> (optional)

Response 200:
{
  "success": true,
  "followers": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "avatarUrl": "url",
      "role": "artist"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Following
```http
GET /api/v1/users/:userId/following?page=1&limit=20

Response 200: (same structure as followers)
```

---

## Notification System

### Get Notifications
```http
GET /api/v1/notifications?page=1&limit=20&type=artwork_approved
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "notifications": [
    {
      "_id": "notif_id",
      "type": "artwork_approved",
      "title": "Artwork Approved",
      "message": "Your artwork 'Sunset' has been approved!",
      "isRead": false,
      "relatedArtwork": { ... },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": { ... }
}
```

### Mark as Read
```http
PUT /api/v1/notifications/:id/read
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Notification marked as read",
  "notification": { ... }
}
```

### Mark All as Read
```http
PUT /api/v1/notifications/read-all
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Delete Notification
```http
DELETE /api/v1/notifications/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Get Unread Count
```http
GET /api/v1/notifications/unread-count
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "count": 5
}
```

---

## Review & Rating System

### Create Review
```http
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "artworkId": "artwork_id",
  "rating": 5,
  "comment": "Amazing artwork! Highly recommended."
}

Response 201:
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "_id": "review_id",
    "artwork": "artwork_id",
    "reviewer": { ... },
    "rating": 5,
    "comment": "Amazing artwork!",
    "verified": true,
    "helpfulCount": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "ratingStats": {
    "averageRating": 4.5,
    "totalReviews": 10,
    "distribution": { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4 }
  }
}
```

### Get Artwork Reviews
```http
GET /api/v1/reviews/artwork/:artworkId?page=1&limit=10&sort=recent
# sort options: recent, helpful, rating_high, rating_low

Response 200:
{
  "success": true,
  "reviews": [ ... ],
  "ratingStats": { ... },
  "pagination": { ... }
}
```

### Update Review
```http
PUT /api/v1/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "rating": 4,
  "comment": "Updated my review"
}

Response 200:
{
  "success": true,
  "message": "Review updated successfully",
  "review": { ... }
}
```

### Delete Review
```http
DELETE /api/v1/reviews/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Mark Review as Helpful
```http
POST /api/v1/reviews/:id/helpful
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Marked as helpful", // or "Removed from helpful"
  "helpfulCount": 15,
  "isHelpful": true
}
```

---

## Secure Downloads

### Get Download Link
```http
GET /api/v1/orders/download/:artworkId
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Download link generated successfully",
  "downloadUrl": "https://yoursite.com/api/v1/orders/download/artwork_id",
  "downloadToken": "jwt_token_here",
  "expiresIn": "1 hour",
  "artwork": {
    "title": "Sunset Paradise",
    "imageUrl": "https://...",
    "format": "jpg"
  }
}

Error 403 (Not Purchased):
{
  "success": false,
  "message": "You must purchase this artwork to download it"
}
```

---

## Enhanced Admin Analytics

### Get Analytics
```http
GET /api/v1/admin/analytics
Authorization: Bearer <token>
# Requires admin role

Response 200:
{
  "success": true,
  "analytics": {
    "totalUsers": 100,
    "totalArtists": 25,
    "totalBuyers": 75,
    "totalArtworks": 200,
    "approvedArtworks": 180,
    "pendingArtworks": 15,
    "rejectedArtworks": 5,
    "totalRevenue": 50000,
    "totalOrders": 120,
    "avgOrderValue": 416.67,
    "revenueTrends": [
      {
        "date": "2024-01-15",
        "revenue": 5000,
        "orders": 12
      }
    ],
    "userTrends": [
      {
        "date": "2024-01-15",
        "registrations": 5
      }
    ],
    "mostLikedArtworks": [
      {
        "_id": "artwork_id",
        "title": "Sunset Paradise",
        "likesCount": 150,
        "artistName": "John Doe"
      }
    ]
  }
}
```

---

## Notification Types

### artwork_approved
```json
{
  "type": "artwork_approved",
  "title": "Artwork Approved",
  "message": "Your artwork 'Title' has been approved and is now live!",
  "relatedArtwork": "artwork_id"
}
```

### artwork_rejected
```json
{
  "type": "artwork_rejected",
  "title": "Artwork Rejected",
  "message": "Your artwork 'Title' was rejected. Reason: ...",
  "relatedArtwork": "artwork_id"
}
```

### artwork_purchased
```json
{
  "type": "artwork_purchased",
  "title": "Artwork Sold",
  "message": "John Doe purchased 2 of your artwork(s)!",
  "relatedTransaction": "transaction_id"
}
```

### new_follower
```json
{
  "type": "new_follower",
  "title": "New Follower",
  "message": "John Doe started following you",
  "relatedUser": "user_id"
}
```

### artwork_liked
```json
{
  "type": "artwork_liked",
  "title": "Artwork Liked",
  "message": "John Doe liked your artwork 'Title'",
  "relatedArtwork": "artwork_id",
  "relatedUser": "user_id"
}
```

### order_placed
```json
{
  "type": "order_placed",
  "title": "Order Confirmed",
  "message": "Your order of 3 artwork(s) has been confirmed!",
  "relatedTransaction": "transaction_id"
}
```

---

## Rate Limiting

### General API Limits
- **Rate**: 100 requests per 15 minutes per IP
- **Applies to**: All `/api/*` routes
- **Response** (429):
```json
{
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### Authentication Limits
- **Rate**: 5 login attempts per 15 minutes per IP
- **Applies to**: `/api/v1/auth/*` routes
- **skipSuccessfulRequests**: true (successful logins don't count)
- **Response** (429):
```json
{
  "message": "Too many login attempts from this IP, please try again after 15 minutes"
}
```

---

## Search & Discovery

### Text Search
```http
GET /api/v1/artworks/search?q=sunset&category=landscape&page=1&limit=20

Response 200:
{
  "success": true,
  "artworks": [ ... ],
  "pagination": { ... }
}
```

### Search Weights
- **Title**: 10x (highest priority)
- **Tags**: 5x
- **Artist Name**: 3x
- **Category**: 2x
- **Description**: 1x (lowest priority)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Rating must be between 1 and 5"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You must purchase this artwork to download it"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Artwork not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing with cURL

### Follow Artist
```bash
curl -X POST http://localhost:3000/api/v1/users/USER_ID/follow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Create Review
```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "artworkId": "ARTWORK_ID",
    "rating": 5,
    "comment": "Amazing artwork!"
  }'
```

### Get Notifications
```bash
curl http://localhost:3000/api/v1/notifications?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark as Read
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/NOTIF_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Download Link
```bash
curl http://localhost:3000/api/v1/orders/download/ARTWORK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration Examples

### React - Follow Button
```jsx
const FollowButton = ({ artistId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.post(
        `/api/v1/users/${artistId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleFollow} disabled={loading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};
```

### React - Notification Bell
```jsx
const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const response = await axios.get('/api/v1/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.count);
    };
    fetchUnreadCount();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-bell">
      <BellIcon />
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </div>
  );
};
```

### React - Review Form
```jsx
const ReviewForm = ({ artworkId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/v1/reviews',
        { artworkId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSubmit(response.data.review);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};
```

---

**Last Updated**: January 2025  
**Version**: 2.0  
**For**: ArtHive Digital Marketplace
