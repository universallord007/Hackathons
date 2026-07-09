import { NextResponse } from "next/server";
import { simplifyFormText } from "../../lib/groq";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "NO_TEXT_PROVIDED", message: "No text was provided to simplify." },
        { status: 400 }
      );
    }

    const result = await simplifyFormText(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("SIMPLIFY_ROUTE_ERROR", err);

    if (err.message === "EXTRACTED_TEXT_TOO_SHORT") {
      return NextResponse.json(
        {
          error: "TEXT_TOO_SHORT",
          message: "Not enough readable text was found in this document to process.",
        },
        { status: 422 }
      );
    }

    if (err.message === "GROQ_INVALID_JSON" || err.message === "GROQ_EMPTY_RESPONSE") {
      return NextResponse.json(
        {
          error: "SIMPLIFY_PARSE_FAILED",
          message: "The AI response couldn't be understood. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: "SIMPLIFY_FAILED",
        message: "We couldn't process this document right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
