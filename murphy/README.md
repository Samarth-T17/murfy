# Murphy - Text to Speech Chrome Extension

A Chrome extension that converts text to natural speech using the Murf AI API.

## Features

- 🎤 **Text to Speech**: Convert any text to natural-sounding speech using Murf AI
- 🎨 **Chrome Extension UI**: Clean, modern interface designed for Chrome extensions
- 💾 **Save Notes**: Save your text content with Chrome notifications
- 🎵 **Audio Playback**: Built-in audio player to listen to generated speech
- ⚡ **Real-time Generation**: Fast speech generation with loading states

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Murf API

1. Sign up at [Murf.ai](https://murf.ai/)
2. Get your API key from the dashboard
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your Murf API key to `.env`:
   ```
   REACT_APP_MURF_API_KEY=your_actual_murf_api_key_here
   ```

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 📂 Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click "Load unpacked" and select the `build` directory.

Your Murphy extension should now be loaded in Chrome!

## Murf API Integration

This extension uses the Murf AI API for high-quality text-to-speech generation. The API provides:

- Natural-sounding voices
- Multiple language support
- High-quality audio output
- Fast generation times

### API Features Used

- **Voice Selection**: Currently uses `en-US-1` voice (configurable)
- **Output Format**: MP3 audio files
- **Sample Rate**: 22050 Hz for optimal quality
- **Error Handling**: Comprehensive error handling with user feedback

## Extension Structure

```
src/
├── App.tsx          # Main application component
├── index.css        # Global styles with Tailwind
├── main.tsx         # React entry point
└── vite-env.d.ts    # TypeScript declarations
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Murf AI API** - Text-to-speech generation

## License

This project is licensed under the MIT License.