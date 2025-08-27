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

//     const content = `
//     Sarah: Welcome to ‘Project Momentum,’ the podcast dedicated to optimizing project delivery. Today, we’re tackling a pervasive issue that significantly impacts project timelines and budgets: the ‘yo-yo’ effect.  Ken and Marcus, welcome to the show.

// Ken: Thank you, Sarah.  It's a pleasure to be here.

// Marcus:  Likewise. The yo-yo effect is something I've witnessed firsthand in numerous projects, and it's rarely beneficial.
//     `;

//     const names = ["Sarah", "Ken", "Marcus"];
//     const speakers = ["en-US-natalie", "en-US-ken", "en-US-charles"];
//     const audioFilePath = await generatePodcastAudio(content, names, speakers);

//     console.log(`Generated audio file at: ${audioFilePath}`);
//       const fileBuffer = fs.readFileSync(audioFilePath);

//   return new NextResponse(fileBuffer, {
//     status: 200,
//     headers: {
//       "Content-Type": "audio/mpeg",   // correct MIME type for MP3
//       "Content-Disposition": `attachment; filename="podcast.mp3"`,
//     },
//   });

}
