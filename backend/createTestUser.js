const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arthive');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'testartist' });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.username);
      return;
    }

    // Create test artist user
    const testUser = new User({
      name: 'Test Artist',
      username: 'testartist',
      email: 'testartist@example.com',
      password: 'password123',
      role: 'artist',
      title: 'Digital Art Specialist',
      bio: 'Creating amazing digital artworks for the modern world.',
      followers: '1,250',
      following: '89'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser.username);
    
    // Create regular test user
    const testRegularUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user'
    });

    await testRegularUser.save();
    console.log('Test regular user created successfully:', testRegularUser.username);

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser();