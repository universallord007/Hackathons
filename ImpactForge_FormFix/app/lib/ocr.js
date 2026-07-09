export async function extractTextFromImage(imageBuffer, lang = "eng") {
  let worker = null;
  
  try {
    // 1. Mask the import using an inline dynamic require statement.
    // This stops Vercel from trying to statically analyze or bundle the node module files.
    const tesseractModule = require("tesseract.js");
    
    // 2. Initialize using v6.0.1 CDN paths
    worker = await tesseractModule.createWorker({
      workerPath: "https://jsdelivr.net",
      corePath: "https://jsdelivr.net",
      logger: (m) => console.log("[Tesseract Log]:", m),
    });

    // 3. Process the file data
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
    console.error("OCR Runtime Error:", error);
    throw error;
    
  } finally {
    // 4. Terminate cleanly to prevent Vercel 60-second timeouts
    if (worker) {
      await worker.terminate();
    }
  }
}

// Kept here to preserve export references elsewhere in your project
export async function terminateAllWorkers() {
  return true;
}
