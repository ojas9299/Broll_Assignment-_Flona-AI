// services/planner.js
import { cosineSimilarity } from "../utils/similarity.js";

export function generateTimeline(transcript, brolls) {
  const insertions = [];
  let lastInsert = -Infinity;

  for (const seg of transcript) {
    if (seg.start < 5) continue;
    if (seg.end > transcript.at(-1).end - 5) continue;

    let best = null;

    for (const b of brolls) {
      const score = cosineSimilarity(seg.embedding, b.embedding);
      if (!best || score > best.score) {
        best = { ...b, score };
      }
    }

    if (
      best &&
      best.score > 0.6 &&
      seg.start - lastInsert > 7 &&
      insertions.length < 6
    ) {
      insertions.push({
        start_sec: Number(seg.start.toFixed(1)),
        duration_sec: 2.5,
        broll_id: best.id,
        confidence: Number(best.score.toFixed(2)),
        reason: `Visual reinforces: "${seg.text}"`,
      });

      lastInsert = seg.start;
    }
  }

  return insertions;
}
