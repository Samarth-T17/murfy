# Murphy Podcast Content Creator

A sophisticated Next.js application for creating and enhancing podcast content using AI-powered assistance with Google's Gemini API.

## ✨ Features

- **📝 Content Creation**: Write podcast titles, descriptions, and main content with real-time word count
- **🤖 AI Enhancement**: Use Google Gemini to improve content according to different themes
- **🎨 8 Unique Themes**: Choose from professionally designed content themes:
  - 👥 **Casual & Friendly**: Conversational and approachable tone
  - 💼 **Professional**: Formal and business-oriented
  - 📚 **Educational**: Informative and teaching-focused
  - 🎉 **Entertaining**: Engaging and fun approach
  - 📖 **Storytelling**: Narrative-driven content
  - 🎤 **Interview Style**: Question and answer format
  - 📰 **News/Current Events**: Journalistic and factual
  - 💪 **Motivational**: Inspiring and uplifting
- **📊 Dual Tab Interface**: Compare original and AI-enhanced content side by side
- **✏️ Editable AI Content**: Modify AI-generated content to your preferences
- **🔧 Content Management**: Copy, discard, or finalize content versions with rich feedback
- **🎯 Beautiful UI**: Built with Shadcn/UI components, Tailwind CSS, and smooth animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key (optional - app works with mock data if no key provided)

### Installation

1. **Clone and install**:
```bash
git clone <repository-url>
cd murphy
npm install
```

2. **Set up environment** (Optional for real AI enhancement):
```bash
cp .env.example .env.local
```

3. **Add your Gemini API key** to `.env.local` (Optional):
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

4. **Run the application**:
```bash
npm run dev
```

5. **Open in browser**: Navigate to [http://localhost:3000/create-podcast](http://localhost:3000/create-podcast)

## 🔑 Getting a Gemini API Key (Optional)

The app works with mock AI enhancement by default. For real AI enhancement:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file
5. Restart the development server

**Note**: The API key is used on the client side, so it should be added as `NEXT_PUBLIC_GEMINI_API_KEY`.

## 🎯 How to Use

### Creating Content

1. **📝 Write Original Content**: 
   - Enter your podcast title (with live word count)
   - Add a description 
   - Write your main content
   - Track word counts for each section

2. **🎨 Select a Theme**:
   - Choose from 8 beautifully designed themes
   - Each theme has unique icons and color coding
   - Preview the theme description before applying

3. **🤖 Generate AI Enhancement**:
   - Click "Enhance with AI" to generate improved content
   - Watch the progress indicator during generation
   - The AI will restructure your content according to the selected theme

4. **👀 Review and Edit**:
   - Compare original and AI-enhanced versions in tabs
   - Edit the AI-generated content if needed
   - Toggle editing mode for AI content

5. **✅ Finalize**:
   - Choose to keep either the original or enhanced version
   - Use rich copy functionality with formatted output
   - Discard unwanted versions
   - Finalize your preferred content with detailed feedback

### UI Features

- **🎨 Theme Visualization**: Each theme has its own color scheme and icon
- **📊 Word Counts**: Real-time word counting for all content fields
- **🔄 Smooth Animations**: Hover effects, transitions, and loading states
- **💡 Tooltips**: Helpful tooltips throughout the interface
- **🚨 Smart Alerts**: Contextual alerts and notifications
- **📱 Responsive**: Perfect on all device sizes

## 🛠 Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Shadcn/UI components
- **AI Integration**: Google Gemini API with fallback to mock enhancement
- **TypeScript**: Full type safety throughout
- **State Management**: React hooks with optimized re-renders

### Key Components

- `src/app/create-podcast/page.tsx`: Main podcast creation interface with enhanced UI
- `src/gemini/content.ts`: Gemini API integration with intelligent fallback
- `src/components/ui/`: Comprehensive UI components from Shadcn/UI

### Enhanced Features

- **🎯 Smart API Integration**: Automatically falls back to mock enhancement if no API key
- **📊 Real-time Analytics**: Word counts and content statistics
- **🎨 Theme System**: Visual theme representation with icons and colors
- **💫 Rich Interactions**: Smooth animations and micro-interactions
- **🔔 Advanced Notifications**: Rich toast notifications with descriptions
- **📋 Enhanced Copy**: Formatted clipboard output with branding

## 🎨 Customization

### Adding New Themes

1. Add the theme to the `themes` array in the main component
2. Add corresponding enhancement logic in `src/gemini/content.ts`
3. Update the `themePrompts` configuration
4. Choose an appropriate icon and color scheme

### Styling Customization

The app uses Tailwind CSS with a carefully crafted design system:
- Primary colors: Purple to blue gradient
- Theme-specific color coding
- Consistent spacing and typography
- Smooth animations and transitions

## 📦 Development

### Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Project Structure

```
src/
├── app/
│   ├── create-podcast/
│   │   └── page.tsx          # Enhanced podcast creation interface
│   ├── layout.tsx            # Root layout with toast notifications
│   └── globals.css           # Global styles and animations
├── components/
│   └── ui/                   # Shadcn/UI components with customizations
├── gemini/
│   └── content.ts           # Gemini API integration with fallback
└── lib/
    └── utils.ts             # Utility functions
```

## 🔮 Future Enhancements

- **🎵 Audio Preview**: Generate audio previews of content
- **📄 Export Options**: Export to various formats (PDF, Word, etc.)
- **📊 Analytics Dashboard**: Track content performance
- **🔄 Version History**: Save and manage multiple versions
- **🤝 Collaboration**: Real-time collaborative editing
- **🎯 Custom Themes**: User-created custom themes

## 🐛 Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Make sure to use `NEXT_PUBLIC_GEMINI_API_KEY` (not `GEMINI_API_KEY`)
   - Restart the development server after adding the key
   - The app works without an API key using mock enhancement

2. **Build Issues**:
   - Clear `.next` folder and rebuild
   - Check Node.js version (18+ required)

3. **Styling Issues**:
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Support

For issues and feature requests, please create an issue in the repository.

---

**Built with ❤️ using Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, and Google Gemini AI**
