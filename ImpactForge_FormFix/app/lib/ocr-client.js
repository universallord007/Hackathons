// This file is only ever imported from client components ("use client" pages).
// tesseract.js runs entirely in the browser here via real Web Workers + WASM —
// it never touches the Vercel serverless runtime, so the Node worker-script
// bundling problem simply doesn't apply.

import { createWorker } from "tesseract.js";

const LOW_CONFIDENCE_THRESHOLD = 60;
const MIN_TEXT_LENGTH = 10;

export async function extractTextFromImage(file, lang = "eng", onProgress) {
  const worker = await createWorker(lang, 1, {
    logger: onProgress ? (m) => onProgress(m) : undefined,
  });

  try {
    const { data } = await worker.recognize(file);
    const text = (data.text || "").trim();
    const confidence = data.confidence ?? 0;
    const isLowConfidence = confidence < LOW_CONFIDENCE_THRESHOLD;

    if (text.length < MIN_TEXT_LENGTH) {
      const err = new Error(
        "We couldn't find readable text in this image. Try a clearer, well-lit photo."
      );
      err.code = "OCR_NO_TEXT_FOUND";
      throw err;
    }

    return {
      text,
      confidence,
      isLowConfidence,
      warning: isLowConfidence
        ? "This scan came out blurry — results may be less accurate. Consider retaking the photo in better light."
        : null,
    };
  } finally {
    await worker.terminate();
  }
}
