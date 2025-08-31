# 🎙️ Murphy - AI-Powered Podcast Generator

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-blue?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</div>

<div align="center">
  <h3>Generate professional podcasts from ideas using AI-powered content creation and multi-language voice synthesis</h3>
</div>

---

## 🌟 Features

### 🤖 AI-Powered Content Generation
- **Smart Content Creation**: Transform simple ideas into comprehensive podcast scripts using Google's Gemini AI
- **Multiple Themes**: Choose from 8 different podcast styles (Casual, Professional, Educational, Entertaining, etc.)
- **Intelligent Script Structure**: Automatically generates titles, descriptions, and structured content with speaker assignments

### 🎧 Multi-Language Audio Generation
- **7 Supported Languages**: English, Hindi, Bengali, French, German, Italian, Tamil
- **Multiple Voice Options**: Choose from a variety of high-quality voices for each language
- **Multi-Speaker Support**: Add up to 5 different speakers per language for dynamic conversations
- **Audio Playback & Download**: Built-in audio player with download functionality

### 📚 Podcast Management
- **Personal Library**: Browse and manage all your generated podcasts
- **User Authentication**: Secure login/signup with NextAuth
- **All Podcasts vs My Podcasts**: Toggle between viewing all podcasts and your personal creations
- **Search & Filter**: Find podcasts by title, description, or content

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beautiful Components**: Built with Radix UI and TailwindCSS
- **Dark/Light Mode**: Automatic theme switching support
- **Real-time Feedback**: Toast notifications and loading states

---

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or MongoDB Atlas)
- **Google Gemini API** key
- **Azure Blob Storage** account (for audio file storage)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/murphy
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/murphy

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Azure Blob Storage (for audio files)
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=your-container-name

# Text-to-Speech API (if using external service)
TTS_API_URL=your-tts-api-endpoint
TTS_API_KEY=your-tts-api-key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samarth-T17/murfy.git
   cd murfy/murphy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
murphy/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── generate-audio/ # Audio generation API
│   │   │   └── podcasts/      # Podcast CRUD operations
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── generate-podcast/  # Podcast creation interface
│   │   ├── podcasts/          # Podcast browsing & details
│   │   │   └── [id]/          # Individual podcast page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/ui components
│   │   └── Navigation.tsx     # Main navigation component
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── firebase.ts       # MongoDB connection & operations
│   │   ├── voices.ts         # Voice options for TTS
│   │   ├── langVoiceType.ts  # Language-voice mapping types
│   │   └── utils.ts          # General utilities
│   ├── gemini/               # Google Gemini AI integration
│   │   └── content.ts        # Content generation logic
│   └── murphy/               # Additional modules
│       └── contents.ts       # Content management
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🛠️ Technologies Used

### Frontend
- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.0** - Type-safe JavaScript
- **TailwindCSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **MongoDB** - NoSQL database for podcast storage
- **NextAuth.js** - Authentication solution
- **Azure Blob Storage** - Cloud storage for audio files

### AI & Voice
- **Google Gemini AI** - Content generation
- **Text-to-Speech APIs** - Multi-language voice synthesis
- **FFmpeg** - Audio processing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

---

## 🎯 Usage Guide

### Creating Your First Podcast

1. **Sign Up/Login**
   - Navigate to the authentication page
   - Create an account or sign in with existing credentials

2. **Generate Content**
   - Go to "Generate Podcast" page
   - Enter your podcast idea
   - Select a theme (Casual, Professional, Educational, etc.)
   - Click "Generate Content" to create your script

3. **Configure Audio**
   - Choose target languages for audio generation
   - Select voice options for each language
   - Add multiple speakers if desired (up to 5 per language)

4. **Generate Audio**
   - Review and edit the generated content if needed
   - Click "Generate Audio" to create voice files
   - Preview audio with built-in player
   - Download generated audio files

5. **Manage Podcasts**
   - View all your podcasts in the "My Podcasts" section
   - Browse community podcasts in "All Podcasts"
   - Search and filter podcasts by content

### Advanced Features

#### Content Editing
- Switch between "Generated" and "Edited" tabs
- Make custom modifications to AI-generated content
- Real-time word count tracking
- Copy content to clipboard

#### Multi-Language Support
- Generate podcasts in multiple languages simultaneously
- Language-specific voice selection
- Automatic script translation (when supported)

#### Voice Customization
- Choose from various voice personas
- Add/remove speakers dynamically
- Preview voice options before generation

---

## 🔧 API Reference

### Authentication Endpoints

```typescript
POST /api/auth/signin          # User sign in
POST /api/auth/signup          # User registration
GET  /api/auth/session         # Get current session
```

### Podcast Management

```typescript
GET    /api/podcasts           # Get all podcasts or user's podcasts
GET    /api/podcasts/[id]      # Get specific podcast
POST   /api/podcasts           # Create new podcast
PUT    /api/podcasts/[id]      # Update podcast
DELETE /api/podcasts/[id]      # Delete podcast
```

### Audio Generation

```typescript
POST /api/generate-audio       # Generate audio from content
```

---

## 🔐 Security Features

- **Secure Authentication** - NextAuth.js with secure session handling
- **Password Hashing** - bcryptjs for secure password storage
- **Environment Variables** - Sensitive data protection
- **API Route Protection** - Server-side authentication checks
- **Input Validation** - Client and server-side validation

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your GitHub repository on Vercel
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables**
   Add all required environment variables in Vercel dashboard

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For intelligent content generation
- **Radix UI** - For accessible component primitives
- **Vercel** - For hosting and deployment platform
- **MongoDB** - For reliable database services
- **Azure** - For cloud storage solutions

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Samarth-T17/murfy/issues)
- **Documentation**: Check our [Wiki](https://github.com/Samarth-T17/murfy/wiki) for detailed guides
- **Community**: Join our discussions in [GitHub Discussions](https://github.com/Samarth-T17/murfy/discussions)

---

<div align="center">
  <p>Made with ❤️ by Samarth and Pavan :) </p>
  <p>
    <a href="https://github.com/Samarth-T17/murfy">⭐ Star this repository</a> •
    <a href="https://github.com/Samarth-T17/murfy/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Samarth-T17/murfy/issues">✨ Request Feature</a>
  </p>
</div>


