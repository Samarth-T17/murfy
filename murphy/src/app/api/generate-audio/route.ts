import { NextRequest, NextResponse } from 'next/server';
import { generatePodcastAudio } from '@/murphy/contents';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const { content, names, speakers } = await request.json();

        // Validate input
        if (!content || !names || !speakers) {
            return NextResponse.json(
                { error: 'Missing required fields: content, names, speakers' },
                { status: 400 }
            );
        }

        if (names.length !== speakers.length) {
            return NextResponse.json(
                { error: 'Names and speakers arrays must have the same length' },
                { status: 400 }
            );
        }

        if (!process.env.MURF_API_KEY) {
            return NextResponse.json(
                { error: 'Murf API key not configured' },
                { status: 500 }
            );
        }

        console.log('Generating audio for content with speakers:', names, speakers);
        

        // Generate audio
        const audioFilePath = await generatePodcastAudio(content, names, speakers);

        // Read the generated audio file
        const audioBuffer = fs.readFileSync(audioFilePath);
        
        // Convert to base64 for transmission
        const audioBase64 = audioBuffer.toString('base64');

        // Clean up the temporary file
        try {
            fs.unlinkSync(audioFilePath);
        } catch (e) {
            console.warn('Failed to cleanup audio file:', e);
        }

        return NextResponse.json({
            success: true,
            audio: audioBase64,
            mimeType: 'audio/mpeg',
            fileName: path.basename(audioFilePath)
        });

    } catch (error) {
        console.error('Audio generation error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate audio',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
