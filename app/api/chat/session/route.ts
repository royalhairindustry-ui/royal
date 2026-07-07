import { NextResponse } from "next/server";
import {
  ensureWelcomeMessage,
  getOrCreateConversation,
} from "@/lib/chat-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = String(body?.sessionId || "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    await getOrCreateConversation(sessionId);
    const messages = await ensureWelcomeMessage(sessionId);

    return NextResponse.json({ sessionId, messages });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    return NextResponse.json(
      { error: "Failed to initialize chat session." },
      { status: 500 },
    );
  }
}
