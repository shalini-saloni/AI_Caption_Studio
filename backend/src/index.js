require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage (replace with database later)
const users = [];
const captions = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

// CORS Configuration - MUST BE FIRST
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ==================== AUTH ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('📝 Signup request:', { name: req.body.name, email: req.body.email });
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User created:', newUser.email);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login request:', { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ==================== AUTH MIDDLEWARE ====================

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get profile
app.get('/api/auth/profile', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// ==================== CAPTION ENDPOINTS ====================

// Get all captions
app.get('/api/captions', authenticate, (req, res) => {
  const userCaptions = captions.filter(c => c.userId === req.user.id);
  res.json({ captions: userCaptions });
});

// Get single caption
app.get('/api/captions/:id', authenticate, (req, res) => {
  const caption = captions.find(c => c.id === req.params.id && c.userId === req.user.id);
  
  if (!caption) {
    return res.status(404).json({ error: 'Caption not found' });
  }
  
  res.json({ caption });
});

// Create caption (mock - without actual AI)
app.post('/api/captions', authenticate, (req, res) => {
  try {
    console.log('🎨 Caption generation request from:', req.user.email);
    
    // Mock caption
    const mockCaptions = [
      'A beautiful landscape with vibrant colors and stunning natural beauty',
      'Urban architecture captured in golden hour with dramatic lighting',
      'Serene moment frozen in time with artistic composition',
      'Dynamic scene showcasing movement and energy in perfect balance',
      'Peaceful setting with harmonious elements creating visual poetry'
    ];
    
    const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
    
    const newCaption = {
      id: Date.now().toString(),
      userId: req.user.id,
      caption: randomCaption,
      imageUrl: '/uploads/mock-image.jpg',
      createdAt: new Date().toISOString()
    };
    
    captions.push(newCaption);
    
    console.log('✅ Caption generated:', newCaption.id);
    
    res.status(201).json({
      message: 'Caption generated successfully',
      caption: newCaption
    });
    
  } catch (error) {
    console.error('❌ Caption generation error:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// Delete caption
app.delete('/api/captions/:id', authenticate, (req, res) => {
  const index = captions.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Caption not found' });
  }
  
  captions.splice(index, 1);
  res.json({ message: 'Caption deleted successfully' });
});

// ==================== USER ENDPOINTS ====================

// Get all users (admin only - simplified)
app.get('/api/users', authenticate, (req, res) => {
  const usersList = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  
  res.json({ users: usersList });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Signup: http://localhost:${PORT}/api/auth/signup`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log('================================\n');
  console.log('📝 Registered users:', users.length);
  console.log('🎨 Generated captions:', captions.length);
  console.log('\n⏳ Waiting for requests...\n');
});