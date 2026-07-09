import Groq from "groq-sdk";

/**
 * Builds a small pool of Groq clients that round-robins across keys on
 * every call (spreads load) and, if a specific key comes back rate-limited
 * (HTTP 429), automatically retries the SAME request on the next key in
 * the pool before giving up. Non-rate-limit errors (bad prompt, invalid
 * key, etc.) are NOT retried — they bubble up immediately so you don't
 * waste 4 keys' worth of calls masking a real bug.
 */
function makePool(keys, poolName) {
  const clients = keys.filter(Boolean).map((key) => new Groq({ apiKey: key }));
  let cursor = 0;

  async function chatCompletion(params) {
    if (clients.length === 0) {
      throw new Error(`NO_GROQ_KEYS_CONFIGURED_FOR_${poolName}`);
    }

    let lastErr;
    for (let i = 0; i < clients.length; i++) {
      const idx = (cursor + i) % clients.length;
      try {
        const result = await clients[idx].chat.completions.create(params);
        cursor = (idx + 1) % clients.length; // next call starts on the next key
        return result;
      } catch (err) {
        lastErr = err;
        const status = err?.status || err?.response?.status;
        if (status !== 429) throw err; // real error — don't mask it, fail fast
        console.warn(`[${poolName}] key #${idx + 1}/${clients.length} rate-limited, rotating`);
      }
    }

    // every key in the pool was rate-limited
    throw lastErr;
  }

  return { chatCompletion, size: clients.length };
}

// 2 keys dedicated to translation calls (lots of small parallel requests
// per document — summary + each field — so this pool gets hit hardest).
export const translatePool = makePool(
  [process.env.GROQ_API_KEY1, process.env.GROQ_API_KEY2],
  "TRANSLATE"
);

// 2 keys dedicated to the OCR-simplification "agent" call.
export const agentPool = makePool(
  [process.env.GROQ_API_KEY3, process.env.GROQ_API_KEY4],
  "AGENT"
);
