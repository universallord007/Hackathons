import { createWorker } from "tesseract.js";

export async function extractTextFromImage(imageBuffer, lang = "eng") {
  let worker = null;
  
  try {
    // 1. Initialize the worker using v6.0.1 CDN endpoints
    // Note: Do not pass 'lang' here for v6 serverless initialization
    worker = await createWorker({
      workerPath: "https://jsdelivr.net",
      corePath: "https://jsdelivr.net",
      logger: (m) => console.log("[Tesseract Log]:", m),
    });

    // 2. Pass the language parameter directly inside recognize() for v6
    const { data } = await worker.recognize(imageBuffer, { lang });

    const text = (data.text || "").trim();
    const confidence = data.confidence ?? 0; // Score from 0 to 100

    // Return the exact data structure your website expects
    return {
      text,
      confidence,
      isLowConfidence: confidence < 60,
      isEmpty: text.length < 10,
    };
    
  } catch (error) {
    console.error("OCR Serverless Execution Error:", error);
    throw error;
    
  } finally {
    // 3. Terminate cleanly to prevent Vercel 60-second timeouts
    if (worker) {
      await worker.terminate();
    }
  }
}

// Kept here to prevent breaking import references elsewhere in your project
export async function terminateAllWorkers() {
  return true;
}
