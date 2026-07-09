import { NextResponse } from "next/server";
import { translateStructuredResult } from "../../lib/translate";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { result, targetLang } = await req.json();

    if (!result || !targetLang) {
      return NextResponse.json(
        { error: "MISSING_PARAMS", message: "result and targetLang are both required." },
        { status: 400 }
      );
    }

    const translated = await translateStructuredResult(result, targetLang);
    return NextResponse.json(translated);
  } catch (err) {
    console.error("TRANSLATE_ROUTE_ERROR", err);
    // translateStructuredResult already falls back to English per-field,
    // so we should rarely land here — but just in case:
    return NextResponse.json(
      {
        error: "TRANSLATE_FAILED",
        message: "Translation failed, showing the original language instead.",
      },
      { status: 500 }
    );
  }
}
