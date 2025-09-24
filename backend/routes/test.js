const express = require('express');
const router = express.Router();

// Test route to check if server is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;