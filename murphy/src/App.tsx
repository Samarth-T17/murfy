import { useState } from 'react';
import axios from 'axios';

// Chrome extension API types
interface NotificationOptions {
  type: string;
  iconUrl: string;
  title: string;
  message: string;
}

declare global {
  interface Window {
    chrome?: {
      notifications?: {
        create: (options: NotificationOptions) => void;
      };
    };
  }
}

function App() {
  const [textAreaStuff, setTextAreaStuff] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Murf API configuration - Replace with your actual API key
  const MURF_API_KEY = import.meta.env.VITE_MURF_API_KEY || 'ap2_eb5e430f-36ae-4954-9449-311832ec9ff6';
  const MURF_API_URL = 'https://api.murf.ai/v1/speech/generate';

  const generateSpeech = async () => {
    if (!textAreaStuff.trim()) {
      setError("Please enter some text to generate speech");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const data = {
        text: textAreaStuff,
        voice_id: "en-US-amara",
        style: "Conversational"
      };

      const response = await axios.post(MURF_API_URL, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": MURF_API_KEY,
        },
      });

      console.log(response.data.audioFile);
      
      if (response.data.audioFile) {
        setAudioUrl(response.data.audioFile);
        
        // Show notification
        if (window.chrome?.notifications) {
          window.chrome.notifications.create({
            type: 'basic',
            iconUrl: '/vite.svg',
            title: 'Murphy Extension',
            message: 'Speech generated successfully!'
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate speech';
      setError(errorMessage);
      console.error('Murf API Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const onClickFunction = () => {
    // Chrome extension style notification instead of alert
    if (window.chrome?.notifications) {
      window.chrome.notifications.create({
        type: 'basic',
        iconUrl: '/vite.svg',
        title: 'Murphy Extension',
        message: textAreaStuff || 'No text entered'
      });
    } else {
      // Fallback for non-extension environment
      alert(textAreaStuff || 'No text entered');
    }
  };

  return (
    <div className="w-80 min-h-96 bg-white shadow-lg">
      {/* Chrome Extension Header */}
      <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="Murphy" className="w-5 h-5" />
          <h1 className="text-sm font-semibold">Murphy Extension</h1>
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Extension Content */}
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-1">
            Text to Speech Generator
          </h2>
          <p className="text-xs text-gray-500">
            Type text and convert it to natural speech using Murf AI
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Enter Text to Convert:
          </label>
          <textarea
            rows={6}
            value={textAreaStuff}
            onChange={e => setTextAreaStuff(e.target.value)}
            placeholder="Type your text here to generate speech..."
            className="w-full p-3 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
          ></textarea>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs text-green-600 mb-2">Speech generated successfully!</p>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={generateSpeech}
            disabled={isGenerating || !textAreaStuff.trim()}
            className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {isGenerating ? 'Generating...' : '🎤 Generate Speech'}
          </button>
          <button
            onClick={onClickFunction}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
          <button
            onClick={() => {
              setTextAreaStuff("");
              setAudioUrl(null);
              setError(null);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear
          </button>
        </div>

        {/* Extension Footer */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>v1.0.0</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
