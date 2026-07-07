import prisma from "@/lib/prisma";

export type StoredChatMessage = {
  id: number;
  text: string;
  sender: "bot" | "user" | "agent";
  time: string;
  channel: string;
};

export async function getOrCreateConversation(sessionId: string) {
  return prisma.customerConversation.upsert({
    where: { sessionId },
    update: { updatedAt: new Date() },
    create: { sessionId },
    select: { id: true, sessionId: true },
  });
}

export async function appendMessage(
  sessionId: string,
  message: {
    sender: "bot" | "user" | "agent";
    text: string;
    channel?: string;
    whatsappMessageId?: string | null;
  },
) {
  const conversation = await getOrCreateConversation(sessionId);

  const created = await prisma.customerMessage.create({
    data: {
      conversationId: conversation.id,
      sender: message.sender,
      channel: message.channel || "WEB",
      text: message.text,
      whatsappMessageId: message.whatsappMessageId ?? null,
    },
    select: {
      id: true,
      text: true,
      sender: true,
      channel: true,
      createdAt: true,
    },
  });

  await prisma.customerConversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date(), latestMessageAt: new Date() },
  });

  return mapMessage(created);
}

export async function listMessages(sessionId: string) {
  const conversation = await prisma.customerConversation.findUnique({
    where: { sessionId },
    select: { id: true },
  });

  if (!conversation) return [];

  const rows = await prisma.customerMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      text: true,
      sender: true,
      channel: true,
      createdAt: true,
    },
  });

  return rows.map(mapMessage);
}

export async function ensureWelcomeMessage(sessionId: string) {
  const messages = await listMessages(sessionId);

  if (messages.length > 0) {
    return messages;
  }

  await appendMessage(sessionId, {
    sender: "bot",
    text: "Hi there! Welcome to Royal Braids. Ask me about products, prices, order tracking, delivery, returns, or contact details.",
  });

  return listMessages(sessionId);
}

function mapMessage(row: {
  id: number;
  text: string;
  sender: string;
  channel: string;
  createdAt: Date;
}): StoredChatMessage {
  return {
    id: row.id,
    text: row.text,
    sender: row.sender as StoredChatMessage["sender"],
    channel: row.channel,
    time: formatTime(row.createdAt),
  };
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
