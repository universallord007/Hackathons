export async function extractTextFromImage(imageBuffer, lang = "eng") {
  let worker = null;
  
  try {
    // 1. Clean dynamic import that skips Next.js 16 build-time analysis
    const tesseractModule = await import("tesseract.js");
    
    // 2. Direct initialization pointing straight to the v6.0.1 assets
    worker = await tesseractModule.createWorker({
      workerPath: "https://jsdelivr.net",
      corePath: "https://jsdelivr.net",
      logger: (m) => console.log("[Tesseract Next16 Log]:", m),
    });

    // 3. Extract text output mapping
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
    console.error("OCR Next.js 16 Runtime Error:", error);
    throw error;
    
  } finally {
    // 4. Terminate immediately to avoid Vercel Function timeouts
    if (worker) {
      await worker.terminate();
    }
  }
}

export async function terminateAllWorkers() {
  return true;
}
