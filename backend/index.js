// index.js
import "dotenv/config";
import fs from "fs";
import { transcribeARoll } from "./services/transcribe.js";
import { embed } from "./services/embed.js";
import { generateTimeline } from "./services/planner.js";
import mockTranscript from "./data/mock_transcript.json" assert { type: "json" };

// ---- CONFIG ----
const A_ROLL_PATH = "./data/a_roll.mp4";
const B_ROLLS = [
  {
    id: "broll_1",
    metadata: "Mumbai street food context shot, everyday urban food culture.",
  },
  {
    id: "broll_2",
    metadata: "Indoor takeaway food containers, calm everyday eating scenario.",
  },
  {
    id: "broll_3",
    metadata: "Uncovered food at stall, highlighting hygiene concerns.",
  },
  {
    id: "broll_4",
    metadata: "Clean indoor kitchen with hygienic food preparation.",
  },
  {
    id: "broll_5",
    metadata:
      "Organized cafe or restaurant food display, conscious food choice.",
  },
  {
    id: "broll_6",
    metadata:
      "Minimal dining table with fruits and water, calm healthy closure.",
  },
];

// ---- SANITY CHECKS ----
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not loaded");
}

if (!fs.existsSync(A_ROLL_PATH)) {
  throw new Error("a_roll.mp4 not found in backend/data/");
}

// ---- MAIN ----
const USE_MOCK_AI = true;
function fakeEmbedding() {
  return Array(1536)
    .fill(0)
    .map(() => Math.random());
}

async function run() {
  console.log("Transcribing A-roll...");
  const transcript = USE_MOCK_AI
    ? mockTranscript.map((s) => ({ ...s, embedding: fakeEmbedding() }))
    : await transcribeARoll(A_ROLL_PATH);

  console.log("Embedding transcript...");
  for (const seg of transcript) {
    if (!seg.embedding) {
      seg.embedding = USE_MOCK_AI ? fakeEmbedding() : await embed(seg.text);
    }
  }

  console.log("Embedding B-rolls...");
  const cachePath = "./data/broll_embeddings.json";
  const cache = fs.existsSync(cachePath)
    ? JSON.parse(fs.readFileSync(cachePath, "utf-8"))
    : {};

  const brolls = [];

  for (const b of B_ROLLS) {
    let embedding;

    if (USE_MOCK_AI) {
      embedding = fakeEmbedding();
    } else if (cache[b.id]) {
      embedding = cache[b.id];
    } else {
      embedding = await embed(b.metadata);
      cache[b.id] = embedding;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
    }

    brolls.push({
      id: b.id,
      embedding,
    });
  }

  console.log("Planning timeline...");
  const insertions = generateTimeline(transcript, brolls);

  const output = {
    aroll_duration_sec: transcript.at(-1).end,
    insertions,
  };

  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }

  fs.writeFileSync("./output/timeline.json", JSON.stringify(output, null, 2));

  console.log("Done. Timeline generated.");
}

run();
