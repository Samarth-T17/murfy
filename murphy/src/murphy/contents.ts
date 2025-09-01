import axios from "axios";
import fs from "fs";
import { spawn } from "child_process";
import os from "os";
import path from "path";
import { langVoiceMap } from "@/lib/langVoiceType"

const langCodes: Record<string, string> = {
    english: "en-US",
    bengali: "bn-IN",
    hindi: "hi-IN",
    tamil: "ta-IN",
    italian: "it-IT",
    french: "fr-FR",
    german: "de-DE"
};

export async function generatePodcastAudio(
    content: string,
    names: string[],
    allSpeakers: langVoiceMap, 
    uniqueId: string
): Promise<Record<string, string>> {

    const paths: Record<string, string> = {};
    console.log("Generating audio for languages:", allSpeakers);
    
    for(const key in allSpeakers) {
        const speakers = allSpeakers[key];
        const voiceMap = new Map<string, string>();
        names.forEach((name, index) => {
            voiceMap.set(name, speakers[index]);
        });

        const parsedContent = parsePodcastContent(content, voiceMap);
        if(key != "english" && allSpeakers[key].length != 0) {
            console.log("Translating content for language:", key);
            const translatedContent = await translatePodcastContent(parsedContent, key);
            const audioFilePath = await generateAudio(translatedContent, uniqueId + key);
            paths[key] = audioFilePath;
        } else if(allSpeakers[key].length != 0) {
            console.log("Generating audio for language:", key);
            const audioFilePath = await generateAudio(parsedContent, uniqueId + key);
            paths[key] = audioFilePath;
        }   
    }
    return paths;

}

async function translatePodcastContent(
  content: { [key: string]: string }[], targetLanguage: string
): Promise<{ [key: string]: string }[]> {
    const srcContent: string[] = [];
    const keys: string[] = [];

    for (const obj of content) {
        for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            keys.push(key);
            srcContent.push(obj[key]);
        }
        }
    }

    const options = {
        method: "POST",
        url: "https://api.murf.ai/v1/text/translate",
        headers: {
        "api-key": process.env.MURF_API_KEY,
        "Content-Type": "application/json",
        },
        data: {
        targetLanguage: langCodes[targetLanguage], 
        texts: srcContent,
        },
    };

    try {
        const response = await axios.request(options);
        const translations = response.data.translations;

        const targetPodcastContent: { [key: string]: string }[] = keys.map(
        (key, index) => ({
            [key]: translations[index].translated_text,
        })
        );
        console.log("Translated podcast content:", targetPodcastContent);
        return targetPodcastContent;
    } catch (error) {
        console.error("Translation API error:", error);
        throw error;
    }
}

function parsePodcastContent(
  content: string,
  voiceMap: Map<string, string>
): { [key: string]: string }[] {
    content = content.replace(/ +/g, " ");
    const lines = content.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    const result: { [key: string]: string }[] = [];

    for (const line of lines) {
        for (const name of voiceMap.keys()) {
        if (line.startsWith(name + ":")) {
            result.push({
            [voiceMap.get(name)!]: line.slice(name.length + 1).trim()
            });
            break;
        }
        }
    }

    console.log("Parsed podcast content:", result);
    return result;
}

export async function generateAudio(conversations: { [speaker: string]: string }[], uniqueId: string): Promise<string> {



    const promises = conversations.map(async (dialogue, idx) => {
        const [speaker, text] = Object.entries(dialogue)[0];
        const data = { text, voiceId: speaker, style: "Conversational" };

        try {
            const response = await axios.post(
                "https://api.murf.ai/v1/speech/generate",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "api-key": process.env.MURF_API_KEY ?? "",
                    },
                }
            );

            const audioUrl: string = response.data.audioFile;
            console.log(`Generated audio URL for ${speaker}:`, audioUrl);

            const audioResponse = await axios.get<ArrayBuffer>(audioUrl, {
                responseType: "arraybuffer",
            });

            const filename = path.join(os.tmpdir(), `${uniqueId}_part${idx}.mp3`);
            fs.writeFileSync(filename, Buffer.from(audioResponse.data));
            console.log(`${speaker} -> saved ${filename}`);
            return filename;
        } catch (err: unknown) {
            console.error(`Error with ${speaker}:`, err instanceof Error ? err.message : err);
            return null;
        }
    });

    const files = (await Promise.all(promises)).filter((f): f is string => Boolean(f));

    return new Promise((resolve, reject) => {
        try {
            const tmpDir = os.tmpdir();
            const listFile = path.join(tmpDir, `${uniqueId}_ffmpeg_inputs.txt`);

            // ffmpeg concat list must have absolute paths and quotes
            fs.writeFileSync(listFile, files.map(f => `file '${path.resolve(f)}'`).join("\n"));
            console.log("Written list file contents:\n", fs.readFileSync(listFile, "utf-8"));

            const outputFile = path.join(os.tmpdir(), `${uniqueId}_final.mp3`);

            const ffmpegPath = process.env.FFMPEG_PATH!;

            const child = spawn(ffmpegPath, [
                "-f", "concat",
                "-safe", "0",
                "-i", listFile,
                "-c:a", "libmp3lame",
                "-b:a", "192k",
                outputFile, "-y"
            ]);

            child.on("close", (code) => {
                if (code === 0) {
                    console.log("✅ Final audio created as", outputFile);
                    resolve(outputFile);
                    cleanup(files, listFile);
                } else {
                    reject(new Error(`ffmpeg exited with code ${code}`));
                    cleanup(files, listFile);
                }
            });

            child.on("error", (error) => {
                reject(error);
            });
        } catch (e) {
            reject(e);
        }
    });
}

function cleanup(files: string[], listFile: string) {
    for (const f of files) {
        try {
            fs.unlinkSync(f);
            console.log(`🗑 Deleted ${f}`);
        } catch (e: unknown) {
            console.error(`Failed to delete ${f}:`, e instanceof Error ? e.message : e);
        }
    }

    try {
        fs.unlinkSync(listFile);
    } catch (e: unknown) {
        console.error(`Failed to delete temp list file:`, e instanceof Error ? e.message : e);
    }
}
