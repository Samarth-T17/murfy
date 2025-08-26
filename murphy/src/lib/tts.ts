import axios from 'axios';

export interface TTSOptions {
    text: string;
    voiceId?: string;
}

export interface TTSResponse {
    audioFile: string;
    success: boolean;
    error?: string;
}

// Available voice options for MURF API need to edit these from the docs
export const VOICE_OPTIONS = [
    { value: 'en-US-terrell', label: 'Terrell (US Male)', accent: 'American' },
    { value: 'en-US-lisa', label: 'Lisa (US Female)', accent: 'American' },
    { value: 'en-US-marcus', label: 'Marcus (US Male)', accent: 'American' },
    { value: 'en-US-sarah', label: 'Sarah (US Female)', accent: 'American' },
    { value: 'en-GB-oliver', label: 'Oliver (UK Male)', accent: 'British' },
    { value: 'en-GB-emma', label: 'Emma (UK Female)', accent: 'British' },
    { value: 'en-AU-jack', label: 'Jack (AU Male)', accent: 'Australian' },
    { value: 'en-AU-sophie', label: 'Sophie (AU Female)', accent: 'Australian' },
];

export async function generateAudioFromText(options: TTSOptions): Promise<TTSResponse> {
    try {

        // Validate input if the text is empty then return an error
        if (!options.text || options.text.trim().length === 0) {

            return {
                audioFile: '',
                success: false,
                error: 'Text content is required'
            };
        }

        // Check if API key is available if not return mock audio 
        if (!process.env.NEXT_PUBLIC_MURF_API_KEY) {
            console.warn('MURF API key not found, returning mock audio');
            return {
                audioFile: 'data:audio/mp3;base64,mock-audio-data',
                success: true
            };
        }

        // This is the data to be sent to the API for audio generation
        // The VoiceId is hardcoded and needs to be changed and made dynamic

        const data = {
            text: options.text,
            voiceId: 'en-US-terrell',
        };

        // Check the murf api key
        // console.log(process.env.NEXT_PUBLIC_MURF_API_KEY);


        // Send the request to the API and handle the response keep a timeout to 30 seconds so that 
        const response = await axios.post(
            'https://api.murf.ai/v1/speech/generate',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'api-key': process.env.NEXT_PUBLIC_MURF_API_KEY,
                },
                timeout: 30000, // 30 seconds timeout
            }
        );


        if (response.data && response.data.audioFile) {
            // Audio file generated successfully
            console.log('Generated audio file from the service:', response.data.audioFile);
            return {
                audioFile: response.data.audioFile,
                success: true
            };
        } else {
            return {
                audioFile: '',
                success: false,
                error: 'Invalid response from MURF API'
            };
        }

    } catch (error: unknown) {

        console.error('MURF TTS Error:', error);

        let errorMessage = 'Failed to generate audio';

        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status: number; data?: { message?: string } } };
            // API responded with error status
            errorMessage = `API Error: ${axiosError.response?.status} - ${axiosError.response?.data?.message || 'Unknown error'}`;
        } else if (error && typeof error === 'object' && 'request' in error) {
            // Request was made but no response
            errorMessage = 'Network error - please check your connection';
        } else if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'ECONNABORTED') {
            // Timeout error
            errorMessage = 'Request timeout - audio generation took too long';
        }

        return {
            audioFile: '',
            success: false,
            error: errorMessage
        };
    }
}

// Helper function to get voice by accent
export function getVoicesByAccent(accent: string) {
    return VOICE_OPTIONS.filter(voice => voice.accent === accent);
}

// Helper function to create combined content for TTS
export function createTTSContent(podcastContent: { title: string; description: string; content: string }): string {
    return `
${podcastContent.title}

${podcastContent.description}

${podcastContent.content}
  `.trim();
}

// Helper function to estimate audio duration (rough estimate)
export function estimateAudioDuration(text: string): string {
    // Average speaking rate is about 150-160 words per minute
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 150);

    if (minutes < 1) {
        return 'Less than 1 minute';
    } else if (minutes === 1) {
        return '1 minute';
    } else {
        return `${minutes} minutes`;
    }
}
