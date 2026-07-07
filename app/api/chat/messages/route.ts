import { NextResponse } from "next/server";
import { appendMessage, listMessages } from "@/lib/chat-store";
import { getChatbotReply } from "@/lib/chatbot-replies";
import {
  getWhatsAppConfig,
  isWhatsAppConfigured,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId")?.trim();

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    const messages = await listMessages(sessionId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat messages." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = String(body?.sessionId || "").trim();
    const text = String(body?.text || "").trim();

    if (!sessionId || !text) {
      return NextResponse.json(
        { error: "sessionId and text are required." },
        { status: 400 },
      );
    }

    const userMessage = await appendMessage(sessionId, {
      sender: "user",
      text,
    });

    let whatsappNotification:
      | { success: boolean; error?: string; messageId?: string }
      | undefined;

    if (isWhatsAppConfigured()) {
      const { agentNumber } = getWhatsAppConfig();
      whatsappNotification = await sendWhatsAppTextMessage(
        agentNumber,
        `[Royal Braids Web Chat]\nSession: ${sessionId}\nCustomer: ${text}\n\nReply with:\n#web ${sessionId} Your reply`,
      );
    }

    const replyText = await getChatbotReply(text);

    const botReply = await appendMessage(sessionId, {
      sender: "bot",
      text: replyText,
      channel: whatsappNotification?.success ? "WEB+WHATSAPP" : "WEB",
    });

    return NextResponse.json({
      messages: [userMessage, botReply],
      whatsappNotification,
    });
  } catch (error) {
    console.error("Failed to post chat message:", error);
    return NextResponse.json(
      { error: "Failed to post chat message." },
      { status: 500 },
    );
  }
}
