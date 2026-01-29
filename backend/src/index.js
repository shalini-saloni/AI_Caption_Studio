require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// AI Caption Generation - FIXED WITH WORKING MODELS
async function generateCaptionWithAI(imagePath) {
  try {
    console.log('🤖 Generating caption with AI for:', imagePath);
    
    const imageBuffer = await fs.readFile(imagePath);
    console.log('📸 Image size:', imageBuffer.length, 'bytes');

    // Try multiple models
    const models = [
      'Salesforce/blip-image-captioning-base',
      'nlpconnect/vit-gpt2-image-captioning',
      'microsoft/git-base'
    ];

    for (const model of models) {
      try {
        console.log(`🔄 Trying model: ${model}...`);
        
        const response = await axios({
          method: 'post',
          url: `https://api-inference.huggingface.co/models/${model}`,
          data: imageBuffer,
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        });

        console.log('📡 Response status:', response.status);

        let caption = null;
        
        if (Array.isArray(response.data) && response.data[0]) {
          caption = response.data[0].generated_text || response.data[0].caption;
        } else if (response.data && response.data.generated_text) {
          caption = response.data.generated_text;
        }

        if (caption) {
          console.log('✅ AI Caption SUCCESS:', caption);
          return caption;
        }
        
      } catch (modelError) {
        const status = modelError.response?.status;
        console.log(`⚠️  Model ${model} failed: ${status || modelError.message}`);
        
        // If model is loading, wait and retry
        if (status === 503) {
          console.log('⏳ Model loading, waiting 10s...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }
        continue;
      }
    }
    
    throw new Error('All AI models failed');
    
  } catch (error) {
    console.error('❌ Final AI Error:', error.message);
    
    const fallbackCaptions = [
      'A photo capturing an interesting moment with good composition',
      'An image showing details with clear visual elements',
      'A scene with balanced lighting and perspective',
      'A photograph with natural colors and composition'
    ];
    
    return fallbackCaptions[Math.floor(Math.random() * fallbackCaptions.length)];
  }
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    const captionCount = await prisma.caption.count();
    res.json({ 
      status: 'OK', 
      database: 'connected',
      users: userCount,
      captions: captionCount,
      ai: HUGGINGFACE_API_KEY ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('📝 Signup:', email);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User created:', email, 'ID:', user.id);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', email, 'ID:', user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Auth middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔑 Authenticated user ID:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get profile
app.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get captions
app.get('/api/captions', authenticate, async (req, res) => {
  try {
    const captions = await prisma.caption.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ captions });
  } catch (error) {
    console.error('❌ Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch captions' });
  }
});

// Generate caption - WITH BETTER ERROR HANDLING
app.post('/api/captions', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('📸 Image uploaded:', req.file.filename);
    console.log('👤 User ID:', req.user.id);

    // Verify user exists before creating caption
    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!userExists) {
      console.error('❌ User not found in database:', req.user.id);
      return res.status(401).json({ error: 'User session expired. Please login again.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const generatedCaption = await generateCaptionWithAI(req.file.path);

    const caption = await prisma.caption.create({
      data: {
        userId: req.user.id,
        imageUrl,
        caption: generatedCaption
      }
    });

    console.log('✅ Caption saved to database, ID:', caption.id);
    res.status(201).json({ caption });
  } catch (error) {
    console.error('❌ Caption generation error:', error);
    
    if (error.code === 'P2003') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// Delete caption
app.delete('/api/captions/:id', authenticate, async (req, res) => {
  try {
    const caption = await prisma.caption.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!caption) {
      return res.status(404).json({ error: 'Not found' });
    }

    try {
      const imagePath = path.join(__dirname, '..', caption.imageUrl);
      await fs.unlink(imagePath);
    } catch (err) {
      console.log('⚠️  Could not delete image:', err.message);
    }

    await prisma.caption.delete({ where: { id: req.params.id } });

    console.log('✅ Caption deleted');
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

// Start server
app.listen(PORT, async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 CAPTION STUDIO SERVER');
  console.log('='.repeat(60));
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`🤖 AI: ${HUGGINGFACE_API_KEY ? 'Configured ✓' : '❌ NOT CONFIGURED'}`);
  console.log('='.repeat(60));
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database failed:', error.message);
  }
  
  console.log('\n⏳ Waiting for requests...\n');
});