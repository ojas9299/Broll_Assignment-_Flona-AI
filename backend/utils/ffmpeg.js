// utils/ffmpeg.js
import { execSync } from "child_process";

export function extractFrame(videoUrl, outPath) {
  execSync(`ffmpeg -y -i "${videoUrl}" -ss 00:00:01 -frames:v 1 ${outPath}`);
}
