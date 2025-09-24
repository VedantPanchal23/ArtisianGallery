const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arthive');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test users
const createTestUsers = async () => {
  try {
    // Check if vedantbauna already exists
    const existingUser = await User.findOne({ username: 'vedantbauna' });
    if (existingUser) {
      console.log('Test user "vedantbauna" already exists');
      console.log('User details:', {
        name: existingUser.name,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role
      });
      return;
    }

    // Create test artist user
    const testArtist = new User({
      name: 'vedant bauna',
      username: 'vedantbauna',
      email: 'vedant@gmail.com',
      password: 'password123', // Will be hashed automatically by the model
      role: 'artist',
      bio: 'Test artist account for development',
      title: 'Digital Artist & Creative Developer'
    });

    await testArtist.save();
    console.log('✅ Test artist user created successfully!');
    console.log('Login credentials:');
    console.log('Username: vedantbauna');
    console.log('Password: password123');
    console.log('Role: artist');

    // Create test regular user
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    await testUser.save();
    console.log('✅ Test regular user created successfully!');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('Role: user');

  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createTestUsers();
  
  console.log('\n🎉 Database seeding completed!');
  console.log('\nYou can now login with:');
  console.log('Artist: vedantbauna / password123');
  console.log('User: testuser / password123');
  
  process.exit(0);
};

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});