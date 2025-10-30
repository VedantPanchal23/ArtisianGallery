require('dotenv').config();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('./models/User');
var Artwork = require('./models/Artwork');

// Sample Indian user data
var usersData = [
  {
    name: 'Priya Sharma',
    username: 'priyasharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'artist',
    bio: 'Digital artist from Mumbai specializing in abstract and contemporary art. Inspired by Indian culture and modern design.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=667eea&color=fff&size=200'
  },
  {
    name: 'Arjun Patel',
    username: 'arjunpatel',
    email: 'arjun.patel@example.com',
    password: 'password123',
    role: 'artist',
    bio: 'Landscape photographer and painter from Gujarat. Capturing the beauty of Indian heritage through modern lens.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Arjun+Patel&background=764ba2&color=fff&size=200'
  },
  {
    name: 'Ananya Reddy',
    username: 'ananyareddy',
    email: 'ananya.reddy@example.com',
    password: 'password123',
    role: 'artist',
    bio: 'Contemporary artist from Hyderabad. Blending traditional Indian motifs with digital art techniques.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ananya+Reddy&background=f093fb&color=fff&size=200'
  },
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@arthive.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=e74c3c&color=fff&size=200'
  },
  {
    name: 'Rajesh Kumar',
    username: 'rajeshkumar',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Art enthusiast and collector from Delhi',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3498db&color=fff&size=200'
  },
  {
    name: 'Meera Iyer',
    username: 'meeraiyer',
    email: 'meera.iyer@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Interior designer and art lover from Bangalore',
    avatarUrl: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=2ecc71&color=fff&size=200'
  }
];

// Sample artworks data (Indian-themed)
var artworksData = [
  {
    title: 'Mumbai Monsoon Dreams',
    description: 'Abstract representation of Mumbai during monsoon season. The vibrant colors capture the essence of rain-soaked streets and the bustling energy of the city. This piece explores the harmony between nature and urban life in India\'s financial capital.',
    price: 899,
    currency: 'INR',
    category: 'abstract',
    tags: ['mumbai', 'monsoon', 'abstract', 'cityscape', 'modern'],
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    status: 'approved',
    fileSize: 2621440  // 2.5 MB in bytes
  },
  {
    title: 'Lotus Serenity',
    description: 'A contemporary digital artwork featuring the sacred lotus flower, symbolizing purity and enlightenment in Indian culture. The minimalist design with vibrant pink and white tones creates a peaceful meditation on traditional symbolism.',
    price: 599,
    currency: 'INR',
    category: 'digital',
    tags: ['lotus', 'spiritual', 'minimalist', 'indian culture', 'meditation'],
    imageUrl: 'https://images.unsplash.com/photo-1508630388437-17b6d7a66a14?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508630388437-17b6d7a66a14?w=400',
    status: 'approved',
    fileSize: 1887436  // 1.8 MB in bytes
  },
  {
    title: 'Rajasthan Sunset',
    description: 'Breathtaking landscape photography of a Rajasthani sunset over ancient forts. The golden hour captures the majestic architecture and desert landscape, showcasing India\'s rich heritage and natural beauty.',
    price: 1299,
    currency: 'INR',
    category: 'landscape',
    tags: ['rajasthan', 'sunset', 'photography', 'heritage', 'desert'],
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
    status: 'approved',
    fileSize: 3355443  // 3.2 MB in bytes
  },
  {
    title: 'Kathakali Warrior',
    description: 'Striking portrait of a Kathakali performer in full traditional makeup and costume. This piece celebrates Kerala\'s classical dance-drama tradition, capturing the intense expression and vibrant colors that define this ancient art form.',
    price: 1499,
    currency: 'INR',
    category: 'portrait',
    tags: ['kathakali', 'traditional', 'kerala', 'dance', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1609619385002-f40c6f1c6e5e?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609619385002-f40c6f1c6e5e?w=400',
    status: 'approved',
    fileSize: 2202009  // 2.1 MB in bytes
  },
  {
    title: 'Taj Mahal Reflections',
    description: 'A modern interpretation of India\'s most iconic monument. This artwork captures the Taj Mahal at dawn with its perfect reflection in the still waters, symbolizing eternal love and architectural magnificence.',
    price: 1799,
    currency: 'INR',
    category: 'photography',
    tags: ['taj mahal', 'agra', 'monument', 'reflection', 'heritage'],
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
    status: 'approved',
    fileSize: 4718592  // 4.5 MB in bytes
  },
  {
    title: 'Ganesha Blessings',
    description: 'Contemporary digital art featuring Lord Ganesha in a modern abstract style. The piece merges traditional Hindu iconography with contemporary design elements, creating a bridge between ancient spirituality and modern art.',
    price: 749,
    currency: 'INR',
    category: 'digital',
    tags: ['ganesha', 'spiritual', 'hindu', 'abstract', 'modern'],
    imageUrl: 'https://images.unsplash.com/photo-1599933974609-35cb4b1457e8?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599933974609-35cb4b1457e8?w=400',
    status: 'approved',
    fileSize: 2097152  // 2.0 MB in bytes
  },
  {
    title: 'Kerala Backwaters',
    description: 'Serene landscape of Kerala\'s famous backwaters during golden hour. Traditional houseboats glide through palm-fringed waterways, capturing the tranquil beauty of God\'s Own Country.',
    price: 999,
    currency: 'INR',
    category: 'landscape',
    tags: ['kerala', 'backwaters', 'nature', 'peaceful', 'travel'],
    imageUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400',
    status: 'approved',
    fileSize: 3145728  // 3.0 MB in bytes
  },
  {
    title: 'Holi Colors Explosion',
    description: 'Vibrant abstract artwork inspired by the Festival of Colors. Dynamic splashes of pink, yellow, blue, and green create an energetic composition that embodies the joy and celebration of Holi.',
    price: 649,
    currency: 'INR',
    category: 'abstract',
    tags: ['holi', 'festival', 'colors', 'celebration', 'abstract'],
    imageUrl: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400',
    status: 'pending',
    fileSize: 2411724  // 2.3 MB in bytes
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/arthive');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Artwork.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('\nCreating users...');
    var createdUsers = [];
    
    for (var userData of usersData) {
      var hashedPassword = await bcrypt.hash(userData.password, 12);
      var user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Get artist users
    var artists = createdUsers.filter(u => u.role === 'artist');
    var admin = createdUsers.find(u => u.role === 'admin');

    // Create artworks
    console.log('\nCreating artworks...');
    var createdArtworks = [];
    
    for (var i = 0; i < artworksData.length; i++) {
      var artworkData = artworksData[i];
      // Distribute artworks among artists
      var artist = artists[i % artists.length];
      
      var artwork = new Artwork({
        ...artworkData,
        artist: artist._id,
        artistName: artist.name
      });

      // Set approval info for approved artworks
      if (artwork.status === 'approved') {
        artwork.approvedBy = admin._id;
        artwork.approvedAt = new Date();
      }

      await artwork.save();
      createdArtworks.push(artwork);
      
      // Update artist's uploadedArtworks array
      artist.uploadedArtworks.push(artwork._id);
      await artist.save();
      
      console.log(`✅ Created artwork: ${artwork.title} by ${artist.name} (${artwork.status})`);
    }

    // Print summary
    console.log('\n========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('========================================');
    console.log(`\n📊 Summary:`);
    console.log(`   • Users created: ${createdUsers.length}`);
    console.log(`     - Artists: ${artists.length}`);
    console.log(`     - Regular users: ${createdUsers.filter(u => u.role === 'user').length}`);
    console.log(`     - Admin: 1`);
    console.log(`   • Artworks created: ${createdArtworks.length}`);
    console.log(`     - Approved: ${createdArtworks.filter(a => a.status === 'approved').length}`);
    console.log(`     - Pending: ${createdArtworks.filter(a => a.status === 'pending').length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin:');
    console.log('     Username: admin');
    console.log('     Password: admin123');
    console.log('\n   Artists:');
    console.log('     Username: priyasharma / Password: password123');
    console.log('     Username: arjunpatel / Password: password123');
    console.log('     Username: ananyareddy / Password: password123');
    console.log('\n   Users:');
    console.log('     Username: rajeshkumar / Password: password123');
    console.log('     Username: meeraiyer / Password: password123');
    
    console.log('\n✨ You can now run your application and explore the marketplace!');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n💤 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
