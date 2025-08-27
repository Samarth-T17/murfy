import axios from "axios";
import fs from "fs";
import { execFile } from "child_process";
import ffmpegPath from "ffmpeg-static";
import os from "os";
import path from "path";

export async function generatePodcastAudio(
    content: string,
    names: string[],
    speakers: string[]
): Promise<string> {

    const voiceMap = new Map<string, string>();
    names.forEach((name, index) => {
        voiceMap.set(name, speakers[index]);
    });

    const parsedContent = parsePodcastContent(content, voiceMap);

}

function parsePodcastContent(content : string, voiceMap: Map<string, string>) {
    content = content.replace(/ +/g, " ");
    const lines = content.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    
    const result = [];

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

    return result;
}

export async function generateAudio(conversations: { [speaker: string]: string }[]): Promise<string> {
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
        const audioResponse = await axios.get<ArrayBuffer>(audioUrl, {
            responseType: "arraybuffer",
        });

        const filename = path.join(os.tmpdir(), `part${idx}.mp3`);
        fs.writeFileSync(filename, Buffer.from(audioResponse.data));
        console.log(`${speaker} -> saved ${filename}`);
        return filename;
        } catch (err: any) {
        console.error(`Error with ${speaker}:`, err.message || err);
        return null;
        }
    });

  const files = (await Promise.all(promises)).filter((f): f is string => Boolean(f));

  return new Promise((resolve, reject) => {
    try {
      const tmpDir = os.tmpdir();
      const listFile = path.join(tmpDir, `ffmpeg_inputs_${Date.now()}.txt`);

      // ffmpeg concat list must have absolute paths and quotes
      fs.writeFileSync(listFile, files.map(f => `file '${path.resolve(f)}'`).join("\n"));

      const outputFile = "final.mp3";

      if (!ffmpegPath) {
        reject(new Error("ffmpeg binary not found."));
        return;
      }

      execFile(
        ffmpegPath,
        ["-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outputFile],
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          console.log("✅ Final audio created as", outputFile);

          // cleanup small clips
          for (const f of files) {
            try {
              fs.unlinkSync(f);
              console.log(`🗑 Deleted ${f}`);
            } catch (e: any) {
              console.error(`Failed to delete ${f}:`, e.message);
            }
          }

          // cleanup list file
          try {
            fs.unlinkSync(listFile);
          } catch (e: any) {
            console.error(`Failed to delete temp list file:`, e.message);
          }

          resolve(outputFile);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}