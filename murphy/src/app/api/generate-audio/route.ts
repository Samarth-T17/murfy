import { NextRequest, NextResponse } from 'next/server';
import { generatePodcastAudio } from '@/murphy/contents';
import { uploadMp3 } from "@/lib/azureBlob";
import { v4 as uuidv4 } from "uuid";
import { addPodcast } from '@/lib/firebase';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {

        const { content, names, langVoiceMap, description, title } = await request.json();
        
        if (!process.env.MURF_API_KEY) {
            return NextResponse.json(
                { error: 'Murf API key not configured' },
                { status: 500 }
            );
        }

        console.log('Generating audio for content with speakers:', names, langVoiceMap);
        const podcastUniqueId = uuidv4();

        const audioFilePaths: Record<string, string> = await generatePodcastAudio(
            content,
            names,
            langVoiceMap,
            podcastUniqueId
        );

        const url: Record<string, string> = {};
        for (const lang in audioFilePaths) {
            const filePath = audioFilePaths[lang];
            const uploadedUrl = await uploadMp3(filePath, path.basename(filePath));
            url[lang] = uploadedUrl;
        }

        
        await addPodcast(description, title, podcastUniqueId, content, uuidv4(), url);

        
        const audioFiles: Record<
            string,
            { audio: string; mimeType: string; fileName: string }
        > = {};

        for (const lang in audioFilePaths) {
            const filePath = audioFilePaths[lang];
            const audioBuffer = fs.readFileSync(filePath);
            const audioBase64 = audioBuffer.toString("base64");

            audioFiles[lang] = {
                audio: audioBase64,
                mimeType: "audio/mpeg",
                fileName: path.basename(filePath),
            };

            
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                console.warn(`Failed to cleanup audio file (${filePath}):`, e);
            }
        }

        return NextResponse.json({
            success: true,
            files: audioFiles, 
            urls: url          
        });

    } catch (error) {
        console.error("Audio generation error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate audio",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
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

