import { createWorker } from "tesseract.js";

const workerCache = new Map();

async function getWorker(lang = "eng") {
  if (!workerCache.has(lang)) {
    const worker = await createWorker(lang);
    workerCache.set(lang, worker);
  }

  return workerCache.get(lang);
}

export async function extractTextFromImage(imageBuffer, lang = "eng") {
  const worker = await getWorker(lang);
  const { data } = await worker.recognize(imageBuffer);

  const text = (data.text || "").trim();
  const confidence = data.confidence ?? 0; // 0-100

  return {
    text,
    confidence,
    isLowConfidence: confidence < 60,
    isEmpty: text.length < 10,
  };
}

// Optional: call this once on server shutdown if you want a clean exit.
// Not required for Vercel's serverless model.
export async function terminateAllWorkers() {
  for (const workerPromise of workerCache.values()) {
    const worker = await workerPromise;
    await worker.terminate();
  }
  workerCache.clear();
}
