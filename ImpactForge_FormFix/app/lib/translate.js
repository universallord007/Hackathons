import { translatePool } from "../lib/groq-pool";

// Full names help the model translate accurately — "hi" alone is ambiguous-ish,
// spelling it out avoids weird mistranslations for less common codes.
const LANGUAGE_NAMES = {
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  ur: "Urdu",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  de: "German",
  pt: "Portuguese",
  ar: "Arabic",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  ru: "Russian",
};

function languageName(code) {
  return LANGUAGE_NAMES[code] || code;
}

/**
 * Translates one string via Groq. Falls back to the original text on
 * any failure — translation is a bonus feature, it should never break
 * the core result. Hui hui hui
 */
export async function translateText(text, targetLang, sourceLang = "en") {
  if (!text) return "";
  if (!targetLang || targetLang === sourceLang) return text;

  try {
    const completion = await translatePool.chatCompletion({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are a translation engine. Translate the user's text into ${languageName(
            targetLang
          )}. Keep the same simple, plain-language reading level. Respond with ONLY the translated text — no quotes, no notes, no explanations.`,
        },
        { role: "user", content: text },
      ],
    });

    return completion.choices?.[0]?.message?.content?.trim() || text;
  } catch (err) {
    console.error("GROQ_TRANSLATE_FAILED", err.message);
    return text; // graceful fallback: show English rather than erroring
  }
}

/**
 * Translates every user-facing field of a FormFix result object.
 * Runs field translations in parallel to keep latency down.
 */
export async function translateStructuredResult(result, targetLang) {
  if (!targetLang || targetLang === "en") return result;

  const [summary, mandatoryFields, optionalFields, documentChecklist, warnings] =
    await Promise.all([
      translateText(result.summary, targetLang),
      Promise.all((result.mandatoryFields || []).map((f) => translateText(f, targetLang))),
      Promise.all((result.optionalFields || []).map((f) => translateText(f, targetLang))),
      Promise.all((result.documentChecklist || []).map((f) => translateText(f, targetLang))),
      Promise.all((result.warnings || []).map((f) => translateText(f, targetLang))),
    ]);

  return { ...result, summary, mandatoryFields, optionalFields, documentChecklist, warnings };
}
