# Text-to-Speech (TTS) Integration with MURF API

## Overview

The Murphy Podcast Creator now includes AI-powered text-to-speech functionality using the MURF API. This allows users to convert their finalized podcast content into high-quality audio using various AI voices.

## Features

### 🎤 Voice Selection
- 8 different AI voices with various accents:
  - **American**: Terrell (Male), Lisa (Female), Marcus (Male), Sarah (Female)
  - **British**: Oliver (Male), Emma (Female)
  - **Australian**: Jack (Male), Sophie (Female)

### 🔊 Audio Generation
- Convert complete podcast content (title + description + content) to audio
- Real-time progress tracking during generation
- Estimated duration calculation
- Error handling with detailed feedback

### 🎵 Audio Player
- Built-in HTML5 audio player
- Play/pause controls
- Download functionality
- Audio file saved as MP3 format

## How to Use

### 1. Setup API Key
1. Get your MURF API key from [murf.ai](https://murf.ai/)
2. Add it to your `.env.local` file:
   ```env
   NEXT_PUBLIC_MURF_API_KEY=your_murf_api_key_here
   ```

### 2. Generate Podcast Content
1. Enter your podcast idea in the input field
2. Select a theme for content generation
3. Click "Generate Content" to create AI-powered content
4. Review and optionally edit the generated content
5. Click "Finalize Generated" or "Finalize Edited" to prepare for TTS

### 3. Generate Audio
1. After finalizing content, the TTS section will appear
2. Select your preferred voice from the dropdown
3. Click "Generate Audio" and wait for processing
4. Once generated, use the audio player to listen
5. Download the audio file if needed

## Technical Implementation

### Files Structure
```
src/
├── lib/
│   └── tts.ts              # TTS service and utilities
├── app/
│   └── create-podcast/
│       └── page.tsx        # Main UI with TTS integration
└── .env.local             # Environment variables
```

### API Integration
The TTS functionality uses the MURF API with the following structure:

```javascript
const data = {
  text: "Combined podcast content",
  voiceId: "en-US-terrell"
};

axios.post("https://api.murf.ai/v1/speech/generate", data, {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "api-key": process.env.NEXT_PUBLIC_MURF_API_KEY,
  },
});
```

### Key Functions
- `generateAudioFromText()`: Main TTS generation function
- `createTTSContent()`: Combines podcast content for TTS
- `estimateAudioDuration()`: Estimates audio length
- `getVoicesByAccent()`: Filters voices by accent

## Error Handling

The system handles various error scenarios:
- **Network Issues**: Connection problems or timeouts
- **API Errors**: Invalid API key or rate limits
- **Content Issues**: Empty or invalid content
- **Browser Issues**: Unsupported audio formats

## Fallback Behavior

When the MURF API key is not available, the system:
- Returns mock audio data for development
- Shows appropriate error messages
- Continues to function without breaking the UI

## Cost Considerations

- MURF API charges per character of generated speech
- Estimated costs are displayed based on content length
- Consider implementing usage limits for production use

## Browser Compatibility

- Requires modern browsers with HTML5 audio support
- Audio download works in all modern browsers
- Tested on Chrome, Firefox, Safari, and Edge

## Development Notes

- Uses TypeScript for type safety
- Implements proper error boundaries
- Follows React best practices
- Uses Shadcn/UI components for consistent styling
- Includes accessibility features (tooltips, ARIA labels)

## Future Enhancements

Potential improvements for future versions:
- Voice preview functionality
- Custom voice training
- Audio editing capabilities
- Batch processing for multiple episodes
- Integration with podcast hosting platforms
