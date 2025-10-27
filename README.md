# 🖼️ AI Image Caption Generator

A full-stack web application that generates captions for images using AI. Built with React, Node.js, Prisma, and PostgreSQL.

## ✨ Features

- 🔐 **Authentication**: Secure login/register with JWT and bcrypt
- 💬 **Chat System**: Create and manage multiple chat sessions
- 🤖 **AI Captions**: Generate image captions using HuggingFace AI
- 🎨 **Theme Toggle**: Switch between dark and light modes
- 📱 **Responsive Design**: Works on all device sizes
- 🗂️ **Chat History**: Save and retrieve previous conversations
- 🎯 **Orange & Black Theme**: Modern and sleek UI

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide Icons

**Backend:**
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- Multer for file uploads

**AI:**
- HuggingFace Inference API (BLIP Image Captioning)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- HuggingFace API Key

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-caption-generator
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_caption_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
HUGGINGFACE_API_KEY="your-huggingface-api-key"
```

Initialize database:

```bash
npx prisma generate
npx prisma db push
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔑 Getting HuggingFace API Key

1. Visit https://huggingface.co/
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token
5. Copy and paste it into your `.env` file

## 📖 Usage

1. **Register/Login**: Create an account or login
2. **Create Chat**: Click the "+ New Chat" button
3. **Upload Image**: Click "Upload Image" and select a file
4. **Get Caption**: AI will automatically generate a caption
5. **Manage Chats**: View history, delete old chats
6. **Toggle Theme**: Switch between dark/light mode

## 📁 Project Structure

```
ai-caption-generator/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

## 🗄️ Database Schema

**User**
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String
- createdAt: DateTime

**Chat**
- id: UUID (Primary Key)
- title: String
- userId: Foreign Key → User
- createdAt: DateTime
- updatedAt: DateTime

**Message**
- id: UUID (Primary Key)
- chatId: Foreign Key → Chat
- type: String (user/assistant)
- content: Text
- imageUrl: String (Optional)
- caption: Text (Optional)
- createdAt: DateTime

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication (7 day expiry)
- Protected API routes
- User authorization checks
- SQL injection prevention via Prisma
- File upload validation

## 🎨 Customization

### Change Theme Colors

Edit the color values in `frontend/src/App.jsx`:
- Primary: `#ff6600` (Orange)
- Secondary: `#1a1a1a` (Black)
- Accent: `#2d2d2d` (Dark Gray)

### Change AI Model

In `backend/server.js`, replace the model URL:
```javascript
'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large'
```

## 🐛 Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database credentials

**HuggingFace API Error:**
- Verify your API key is correct
- Check if model is loading (wait ~30 seconds)
- Ensure you have API credits

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chats
- `GET /api/chats` - Get all user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `DELETE /api/chats/:id` - Delete chat
- `PATCH /api/chats/:id` - Update chat title

### Messages
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/caption` - Upload image and generate caption

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Shalini Saloni

## 🙏 Acknowledgments

- HuggingFace for the AI model
- Salesforce for BLIP model
- Prisma for the excellent ORM

---

Made with ❤️ and ☕
