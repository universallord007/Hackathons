import { agentPool } from "../lib/groq-pool";

const SYSTEM_PROMPT = `You are FormFix, an assistant that rewrites confusing government forms, scholarship applications, and college/institutional notices into plain, grade-8 reading-level language for first-generation students and families who find bureaucratic paperwork intimidating.

Given raw OCR-extracted text from a form or notice (which may contain OCR noise/typos), you must:
1. Write a short plain-language summary (3-6 sentences) explaining what this document is and what the reader needs to do.
2. List every field/section that is MANDATORY to fill in or act on.
3. List every field/section that is OPTIONAL.
4. List the concrete documents/attachments the reader will need to gather (a checklist).
5. Note any deadlines, warnings, or easy-to-miss traps (e.g. "must be notarized", "due in 10 days") in a "warnings" list.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{
  "summary": "string",
  "mandatoryFields": ["string", ...],
  "optionalFields": ["string", ...],
  "documentChecklist": ["string", ...],
  "warnings": ["string", ...]
}

If the text is too garbled/short to make sense of, still return this shape, but put your best-effort partial answer in "summary" and explain what's unclear, with empty arrays where you have no confident answer.`;

/**
 * Sends OCR'd form text to Groq and returns validated, structured JSON.
 * Throws with a specific error code the API route can map to a clean
 * user-facing message.
 */
export async function simplifyFormText(rawText) {
  if (!rawText || rawText.trim().length < 10) {
    throw new Error("EXTRACTED_TEXT_TOO_SHORT");
  }

  const completion = await agentPool.chatCompletion({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 1500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Here is the OCR-extracted text from a form/notice. Analyze it and respond in the required JSON shape only:\n\n${rawText}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("GROQ_EMPTY_RESPONSE");

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("GROQ_INVALID_JSON");
  }

  // Defensive shape validation so a malformed model response never
  // crashes the frontend — always return well-typed fields.
  return {
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary
        : "We couldn't generate a reliable summary for this document. Please try a clearer photo.",
    mandatoryFields: Array.isArray(parsed.mandatoryFields) ? parsed.mandatoryFields : [],
    optionalFields: Array.isArray(parsed.optionalFields) ? parsed.optionalFields : [],
    documentChecklist: Array.isArray(parsed.documentChecklist) ? parsed.documentChecklist : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
  };
}
