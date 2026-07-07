import { NextResponse } from "next/server";
import { appendMessage } from "@/lib/chat-store";
import { getWhatsAppConfig } from "@/lib/whatsapp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const { verifyToken } = getWhatsAppConfig();

  if (mode === "subscribe" && token && token === verifyToken) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const changes = payload?.entry?.flatMap((entry: any) => entry?.changes || []) || [];
    const incomingMessages = changes.flatMap(
      (change: any) => change?.value?.messages || [],
    );
    const { agentNumber } = getWhatsAppConfig();

    for (const message of incomingMessages) {
      const from = String(message?.from || "").replace(/[^0-9]/g, "");
      const text = message?.text?.body?.trim();

      if (!from || !text) {
        continue;
      }

      if (from === agentNumber && text.toLowerCase().startsWith("#web ")) {
        const [, sessionId, ...replyParts] = text.split(" ");
        const replyText = replyParts.join(" ").trim();

        if (sessionId && replyText) {
          await appendMessage(sessionId, {
            sender: "agent",
            text: replyText,
            channel: "WHATSAPP",
            whatsappMessageId: message?.id || null,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WhatsApp webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
