# Murphy Podcast Content Creator

A Next.js application for creating and enhancing podcast content using AI-powered assistance with Google's Gemini API.

## Features

- **Content Creation**: Write podcast titles, descriptions, and main content
- **AI Enhancement**: Use Google Gemini to improve content according to different themes
- **Multiple Themes**: Choose from 8 different content themes:
  - Casual & Friendly
  - Professional
  - Educational
  - Entertaining
  - Storytelling
  - Interview Style
  - News/Current Events
  - Motivational
- **Dual Tab Interface**: Compare original and AI-enhanced content side by side
- **Editable AI Content**: Modify AI-generated content to your preferences
- **Content Management**: Copy, discard, or finalize content versions
- **Beautiful UI**: Built with Shadcn/UI components and Tailwind CSS

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd murphy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env.local` file

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

Navigate to `/create-podcast` to access the podcast content creation page.

## Usage

### Creating Content

1. **Write Original Content**: 
   - Enter your podcast title
   - Add a description
   - Write your main content

2. **Select a Theme**:
   - Choose from 8 available themes
   - Each theme has a different style and approach

3. **Generate AI Enhancement**:
   - Click "Enhance with AI" to generate improved content
   - The AI will restructure your content according to the selected theme

4. **Review and Edit**:
   - Compare original and AI-enhanced versions in tabs
   - Edit the AI-generated content if needed

5. **Finalize**:
   - Choose to keep either the original or enhanced version
   - Discard the version you don't want
   - Finalize your preferred content

### Theme Descriptions

- **Casual & Friendly**: Conversational and approachable tone
- **Professional**: Formal and business-oriented
- **Educational**: Informative and teaching-focused
- **Entertaining**: Engaging and fun approach
- **Storytelling**: Narrative-driven content
- **Interview Style**: Question and answer format
- **News/Current Events**: Journalistic and factual
- **Motivational**: Inspiring and uplifting

## Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Shadcn/UI components
- **AI Integration**: Google Gemini API
- **TypeScript**: Full type safety throughout

### Key Components

- `src/app/create-podcast/page.tsx`: Main podcast creation interface
- `src/lib/gemini.ts`: Gemini API integration and content enhancement
- `src/components/ui/`: Reusable UI components from Shadcn/UI

### Customization

To add new themes:

1. Add the theme to the `themes` array in the main component
2. Add corresponding enhancement logic in `src/lib/gemini.ts`
3. Update the `themePrompts` configuration

## Development

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### File Structure

```
src/
├── app/
│   ├── create-podcast/
│   │   └── page.tsx          # Main podcast creation page
│   ├── layout.tsx            # Root layout with Toaster
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # Shadcn/UI components
├── lib/
│   ├── gemini.ts            # Gemini API integration
│   └── utils.ts             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please create an issue in the repository.
