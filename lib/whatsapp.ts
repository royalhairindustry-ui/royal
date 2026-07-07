const GRAPH_VERSION = "v23.0";

export function getWhatsAppConfig() {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "",
    agentNumber: (process.env.WHATSAPP_AGENT_NUMBER || "256781662904").replace(
      /[^0-9]/g,
      "",
    ),
  };
}

export function isWhatsAppConfigured() {
  const config = getWhatsAppConfig();
  return Boolean(config.accessToken && config.phoneNumberId);
}

export async function sendWhatsAppTextMessage(to: string, body: string) {
  const config = getWhatsAppConfig();

  if (!config.accessToken || !config.phoneNumberId) {
    return { success: false, error: "WhatsApp API is not configured." };
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          body,
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data?.error?.message || "Failed to send WhatsApp message.",
    };
  }

  return {
    success: true,
    messageId: data?.messages?.[0]?.id as string | undefined,
  };
}
