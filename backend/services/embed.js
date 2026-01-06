// services/embed.js
import OpenAI from "openai";
const openai = new OpenAI();

export async function embed(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });
  return res.data[0].embedding;
}
