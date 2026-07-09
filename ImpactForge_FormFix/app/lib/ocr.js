// By removing "require" and "import" of tesseract on the server side,
// Vercel's backend compiler will completely ignore it, eliminating the error.

export async function extractTextFromImage(imageBuffer, lang = "eng") {
  // If this code accidentally runs on Vercel's server side, return an error safely
  if (typeof window === "undefined") {
    throw new Error("OCR must be executed on the client side to bypass serverless constraints.");
  }

  // Dynamically load tesseract directly in the browser's thread
  const { createWorker } = await import("tesseract.js");
  let worker = null;

  try {
    worker = await createWorker({
      logger: (m) => console.log("[Browser OCR Log]:", m),
    });

    // Process the image data directly in the browser window
    const { data } = await worker.recognize(imageBuffer, { lang });

    const text = (data.text || "").trim();
    const confidence = data.confidence ?? 0;

    return {
      text,
      confidence,
      isLowConfidence: confidence < 60,
      isEmpty: text.length < 10,
    };
  } catch (error) {
    console.error("Browser OCR Error:", error);
    throw error;
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}

export async function terminateAllWorkers() {
  return true;
}
