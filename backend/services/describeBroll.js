// services/describeBroll.js
import OpenAI from "openai";
const openai = new OpenAI();

export async function describeBroll(imageBase64) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe what is visually happening and what idea this clip represents.",
          },
          { type: "image_url", image_url: { url: imageBase64 } },
        ],
      },
    ],
  });

  return res.choices[0].message.content;
}
