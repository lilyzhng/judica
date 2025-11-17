import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Judica, an AI evaluator for EB-1A, NIW, and O-1 petitions.

Your job is to STRICTLY evaluate the strength of the petition's evidence and argument.

You MUST respond ONLY with valid JSON in this exact schema:

{
  "category": "EB1A | NIW | O1",
  "overall_strength": "weak | borderline | strong",
  "criteria_scores": {
    "awards": 0-10,
    "original_contributions": 0-10,
    "leading_role": 0-10,
    "high_salary": 0-10,
    "published_material": 0-10
  },
  "verdict_rationale": "3-6 sentences, specific, evidence-based, no fluff."
}

Rules:
- Be STRICT like an AAO officer, not generous like a career coach.
- If evidence for a criterion is missing or weak, give a LOW score.
- Do NOT invent facts or evidence that are not clearly implied in the text.
- If the user text is too short or unclear, say "weak" with an explanation in verdict_rationale.
- Never wrap JSON in backticks or Markdown, no comments, just pure JSON.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, category } = body as { text?: string; category?: string };

    if (!text || !category) {
      return NextResponse.json(
        { error: "Missing text or category" },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      {
        role: "user" as const,
        content: `Category: ${category}\n\nPetition text:\n${text}`,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-5.1", // or whatever model name you use
      temperature: 0,   // be deterministic & strict
      messages,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    // Best-effort JSON parse; if it fails, just return raw string
    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // try to strip markdown fences if the model misbehaves
      const cleaned = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      return NextResponse.json({
        rawOutput: content,
        warning:
          "Model did not return valid JSON. Check rawOutput for debugging.",
      });
    }

    return NextResponse.json({ result: parsed });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

