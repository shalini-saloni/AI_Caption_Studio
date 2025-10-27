# 🎨 AI Caption Studio

> A full-stack AI-powered image captioning application with beautiful UI, real-time AI processing, and persistent storage.

### Authentication Page
Beautiful orange and black themed login/signup interface

### Dashboard
- Sidebar with caption history
- Drag & drop image upload
- Real-time AI caption generation
- One-click copy functionality

---

## ✨ Features

### 🤖 AI-Powered
- **Real AI Integration**: Uses Hugging Face's BLIP model for accurate image captioning
- **Smart Fallback**: Provides fallback captions if AI service is unavailable
- **Fast Processing**: Optimized for quick caption generation

### 🔐 Secure Authentication
- **JWT-based authentication**: Secure token-based auth system
- **Password encryption**: Bcrypt hashing for password security
- **Protected routes**: Frontend and backend route protection
- **Role-based access**: USER, ADMIN, PREMIUM roles supported

### 💾 Database Persistence
- **PostgreSQL database**: Production-ready relational database
- **Prisma ORM**: Modern, type-safe database queries
- **Automatic migrations**: Easy database schema management
- **Data relationships**: Proper user-caption associations

### 🎨 Beautiful UI
- **Modern design**: Orange and black color theme
- **Responsive layout**: Works on desktop, tablet, and mobile
- **Smooth animations**: Polished user experience
- **Intuitive interface**: Easy to navigate and use

### 📁 File Management
- **Image upload**: Support for JPG, PNG, GIF formats
- **File validation**: Size limits and type checking
- **Persistent storage**: Images saved to server
- **Automatic cleanup**: Delete images with captions

### 📊 Caption History
- **Saved captions**: All captions stored in database
- **Quick access**: View past captions from sidebar
- **Delete functionality**: Remove unwanted captions
- **Search capability**: Find captions easily

---

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Prisma**: Modern ORM
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Axios**: HTTP client for AI API calls

### Frontend
- **React 18**: Modern UI library
- **React Router**: Client-side routing
- **Axios**: API communication
- **Lucide React**: Icon library
- **Context API**: State management

### AI & External Services
- **Hugging Face API**: BLIP image captioning model
- **Salesforce/BLIP**: State-of-the-art vision-language model

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

---

## 🚀 Quick Start

### 1. Clone or Download

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-caption-studio.git
cd ai-caption-studio

# OR create manually
mkdir ai-caption-studio
cd ai-caption-studio
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL="postgresql://username:password@localhost:5432/caption_studio?schema=public"
HUGGINGFACE_API_KEY=your_huggingface_token_here
NODE_ENV=development
EOF

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

### 4. Open Browser

Navigate to `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/caption_studio?schema=public"

# JWT Secret (Generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Hugging Face API
HUGGINGFACE_API_KEY=hf_your_token_here
```

#### Frontend (.env)

```env
# Skip preflight check (optional)
SKIP_PREFLIGHT_CHECK=true
```

---

## 🔑 Getting API Keys

### Hugging Face API Key (FREE)

1. Go to [Hugging Face](https://huggingface.co)
2. Click **Sign Up** (completely free)
3. Verify your email
4. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
5. Click **New token**
6. Name: "Caption Studio"
7. Type: **Read**
8. Click **Generate**
9. Copy the token (starts with `hf_`)
10. Paste in backend `.env` file

### Generate JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OR use any random string (min 32 characters)
```

---

## 💾 Database Setup

### Option 1: Local PostgreSQL (Recommended for Development)

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb caption_studio
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb caption_studio
```

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Open SQL Shell (psql)
4. Run: `CREATE DATABASE caption_studio;`

### Option 2: Docker

```bash
docker run --name caption-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=caption_studio \
  -p 5432:5432 \
  -d postgres:15
```

### Option 3: Free Cloud Database (Easiest!)

**Supabase (Recommended):**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to be ready
4. Go to Settings → Database
5. Copy Connection String
6. Paste in backend `.env`

**Alternatives:**
- [ElephantSQL](https://www.elephantsql.com/) (20MB free)
- [Railway](https://railway.app/) (Free tier)
- [Neon](https://neon.tech/) (Free tier)

---

## 📂 Project Structure

```
ai-caption-studio/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   └── index.js              # Main backend server
│   ├── uploads/                  # Uploaded images
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── .gitignore
│
└── frontend/
    ├── public/
    │   └── index.html            # HTML template
    ├── src/
    │   ├── App.js                # Main app component
    │   ├── index.js              # React entry point
    │   ├── styles.css            # Global styles
    │   ├── api.js                # API client
    │   ├── AuthContext.js        # Authentication context
    │   ├── Login.js              # Login page
    │   ├── Signup.js             # Signup page
    │   └── Dashboard.js          # Main dashboard
    ├── package.json
    └── .env
```

---

## 🎯 Usage Guide

### Creating an Account

1. Navigate to `http://localhost:3000/signup`
2. Enter your details:
   - **Name**: Your full name
   - **Email**: Valid email address
   - **Password**: Minimum 6 characters
3. Click **Sign Up**
4. You'll be automatically logged in

### Generating Captions

1. **Upload Image**:
   - Click upload area or drag & drop
   - Supports: JPG, PNG, GIF
   - Max size: 5MB

2. **Generate**:
   - Click "Generate Caption with AI"
   - Wait 5-10 seconds (first time may take longer)
   - View your AI-generated caption

3. **Actions**:
   - **Copy**: Click copy button to copy caption
   - **New Caption**: Generate caption for new image
   - **View History**: Check sidebar for past captions

### Managing Captions

- **View History**: All captions appear in left sidebar
- **Click Caption**: View full caption and original image
- **Delete**: Hover over caption, click trash icon
- **Search**: Scroll through caption history

---

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev    # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd frontend
npm start      # React development server
```

### Database Management

**View Database:**
```bash
cd backend
npx prisma studio    # Opens GUI at localhost:5555
```

**Reset Database:**
```bash
npx prisma migrate reset    # WARNING: Deletes all data
npx prisma migrate dev
```

**Update Schema:**
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name your_migration_name`

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)

#### Captions
- `GET /api/captions` - Get all user captions (protected)
- `POST /api/captions` - Generate new caption (protected)
- `GET /api/captions/:id` - Get specific caption (protected)
- `DELETE /api/captions/:id` - Delete caption (protected)

#### Health
- `GET /api/health` - Server health check

---

## 🏗️ Building for Production

### Backend

```bash
cd backend

# Set environment to production
export NODE_ENV=production

# Start server
npm start
```

### Frontend

```bash
cd frontend

# Build production bundle
npm run build

# Serve with static server
npx serve -s build
```

---

## 🚢 Deployment

### Backend Deployment

**Heroku:**
```bash
heroku create caption-studio-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

**Railway:**
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy automatically

**Render:**
1. Create new Web Service
2. Connect repository
3. Add PostgreSQL database
4. Set environment variables

### Frontend Deployment

**Vercel:**
```bash
npm install -g vercel
vercel deploy
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
```bash
npm run build
# Deploy build folder
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify DATABASE_URL in .env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

#### Prisma Migration Error
```bash
cd backend
rm -rf prisma/migrations
npx prisma migrate reset
npx prisma migrate dev --name init
```

#### AI API Not Working
- Verify Hugging Face API key is correct
- Check internet connection
- First API call takes 10-20 seconds (model loading)
- Fallback captions will be used if AI fails

#### CORS Errors
- Ensure frontend `package.json` has `"proxy": "http://localhost:5000"`
- Restart both servers
- Clear browser cache

#### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules package-lock.json node_modules/.cache
npm install
npm start
```

---

## 📊 Performance

- **Image Upload**: < 1 second
- **AI Caption Generation**: 5-15 seconds (first call), 2-5 seconds (subsequent)
- **Database Queries**: < 100ms
- **Page Load**: < 2 seconds

### Optimization Tips

1. **Enable caching** for AI responses
2. **Compress images** before upload
3. **Use CDN** for static assets
4. **Enable database indexing** (already configured)
5. **Implement pagination** for large caption histories

---

## 🔒 Security

### Implemented Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection protection (Prisma ORM)
- ✅ File upload validation
- ✅ CORS configuration
- ✅ Environment variable protection

### Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable HTTPS in production**
4. **Implement rate limiting** (already configured)
5. **Regular dependency updates**
6. **Database backups**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Test before submitting PR
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 AI Caption Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors

- Shalini Saloni

---

## 🙏 Acknowledgments

- **Hugging Face** - AI model hosting
- **Salesforce** - BLIP image captioning model
- **Prisma** - Database toolkit
- **React** - UI library
- **Lucide** - Icon library

---

## 📧 Support

For support, email: support@captionstudio.com

Or open an issue on GitHub: [Issues](https://github.com/yourusername/ai-caption-studio/issues)

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Multiple AI models support
- [ ] Batch image processing
- [ ] Custom caption styles
- [ ] Caption editing
- [ ] Image filters
- [ ] Social media sharing
- [ ] Export captions (CSV, JSON)
- [ ] Dark/Light theme toggle
- [ ] Caption templates
- [ ] Multi-language support
- [ ] Advanced search
- [ ] Caption analytics
- [ ] API rate limiting dashboard
- [ ] User preferences
- [ ] Caption favorites

---

## 📚 Additional Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Hugging Face API](https://huggingface.co/docs/api-inference)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Tutorials
- [JWT Authentication](https://jwt.io/introduction)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [React Router](https://reactrouter.com/en/main)

---

## 📈 Changelog

### Version 1.0.0 (2024-01-15)
- ✨ Initial release
- 🤖 AI caption generation
- 🔐 User authentication
- 💾 Database integration
- 🎨 Beautiful UI
- 📁 File upload system
- 📊 Caption history

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ and AI**
