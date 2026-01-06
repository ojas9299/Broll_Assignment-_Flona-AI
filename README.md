Smart B-Roll Inserter for UGC Videos
Overview

This project implements an intelligent system that automatically plans how B-roll clips should be inserted into an A-roll (talking-head / UGC) video.
Instead of manual editing or random insertion, the system analyzes what is being said, when it is said, and which visuals add value at that moment, and outputs a structured timeline plan.

Problem Framing

B-roll insertion is treated as a semantic planning problem, not a video editing problem.

The system:

Understands spoken content over time (A-roll)

Understands the semantic meaning of each B-roll clip

Matches moments in speech where visuals reinforce meaning

Enforces pacing and narrative guardrails

Produces an explainable timeline plan in JSON

System Architecture
A-roll Video
   ↓
Speech-to-Text (timestamped)
   ↓
Sentence-level semantic meaning
   ↓
B-roll semantic representations
   ↓
Similarity scoring + narrative rules
   ↓
Timeline plan (JSON)

Key Design Decisions
1. A-Roll Understanding

A-roll speech is represented as timestamped sentence segments.

Each segment acts as a potential candidate for B-roll insertion.

2. B-Roll Understanding

Each B-roll clip is converted into a short textual description that captures:

Visual content

Conceptual meaning (context, hygiene risk, healthy choice, etc.)

3. Semantic Matching

Both A-roll sentences and B-roll descriptions are embedded into a shared semantic space.

Cosine similarity is used to measure conceptual alignment.

Only high-confidence matches are considered.

4. Narrative Guardrails

To avoid poor UX and visual overload:

No B-roll in the first or last few seconds

Minimum time gap between insertions

Maximum number of insertions capped

B-roll inserted only where it reinforces meaning, not during emotional emphasis

5. Output Planning

The final output is a structured JSON plan containing:

Insertion timestamps

Duration

Selected B-roll ID

Confidence score

Human-readable reasoning

Mock vs Live AI Mode

The system supports two modes:

Live AI Mode: Uses OpenAI APIs for transcription and embeddings

Mock Mode: Uses cached transcripts and synthetic embeddings to allow deterministic execution without API quota

This allows the planning logic to be evaluated independently of external API availability.

Running in Mock Mode vs Live AI Mode

This system supports two execution modes to balance reproducibility and real-world API usage.

Mock Mode (Default)

By default, the system runs in mock mode, which:

Does not require an OpenAI API key

Does not make any external API calls

Uses a cached transcript and synthetic embeddings

Allows deterministic, quota-free execution of the planning logic

This mode exists to ensure the core B-roll planning system can be evaluated independently of API availability.

// index.js
const USE_MOCK_AI = true;

Output Example
{
  "start_sec": 25.5,
  "duration_sec": 2.5,
  "broll_id": "broll_6",
  "confidence": 0.77,
  "reason": "Visual reinforces hygiene concerns discussed by the speaker."
}

Tech Stack

Node.js

OpenAI API (Whisper, Embeddings)

ffmpeg (optional rendering)

JSON-based planning output

How to Run
npm install
node index.js


Output:

backend/output/timeline.json

Future Extensions

Final video rendering via ffmpeg

React UI for transcript and timeline visualization

Scene-aware B-roll duration adjustment

Emotion-aware insertion suppression
