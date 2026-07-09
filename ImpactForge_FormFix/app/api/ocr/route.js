import { NextResponse } from "next/server";
import { extractTextFromImage } from "../../lib/ocr";

export const runtime = "nodejs";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const lang = formData.get("lang") || "eng";

    if (!file) {
      return NextResponse.json(
        { error: "NO_IMAGE_PROVIDED", message: "Please upload an image of the form." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await extractTextFromImage(buffer, lang);

    if (result.isEmpty) {
      return NextResponse.json(
        {
          error: "OCR_NO_TEXT_FOUND",
          message:
            "We couldn't read any text from this image. Try a clearer, well-lit, non-blurry photo.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: result.text,
      confidence: result.confidence,
      isLowConfidence: result.isLowConfidence,
      warning: result.isLowConfidence
        ? "This image quality is low — results may be inaccurate. Consider retaking the photo in better light."
        : null,
    });
  } catch (err) {
    console.error("OCR_ROUTE_ERROR", err);
    return NextResponse.json(
      {
        error: "OCR_FAILED",
        message: "Something went wrong reading this image. Please try again.",
      },
      { status: 500 }
    );
  }
}
