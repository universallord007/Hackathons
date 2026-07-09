export async function extractTextFromImage(imageBuffer, lang = "eng") {
  let worker = null;
  
  try {
    // 1. Dynamic import completely completely hides the package from Vercel's compile scan
    const tesseractModule = await import("tesseract.js");
    
    // 2. Initialize using your full v6.0.1 CDN paths
    worker = await tesseractModule.createWorker({
      workerPath: "https://jsdelivr.net",
      corePath: "https://jsdelivr.net",
      logger: (m) => console.log("[Tesseract Log]:", m),
    });

    // 3. Process the file data using the v6 parameters
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
    // 4. Terminate cleanly to avoid 60-second timeouts
    if (worker) {
      await worker.terminate();
    }
  }
}

export async function terminateAllWorkers() {
  return true;
}
