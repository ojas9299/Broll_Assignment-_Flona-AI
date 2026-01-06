// services/transcribe.js
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeARoll(filePath) {
  const res = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    response_format: "verbose_json",
  });

  return res.segments.map((s) => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }));
}
