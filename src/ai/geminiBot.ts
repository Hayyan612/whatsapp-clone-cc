import { CometChat } from "@cometchat/chat-sdk-javascript";

const BOT_UID = import.meta.env.VITE_AI_UID;

export const setupGeminiBotListener = () => {
  console.log("👂 Gemini bot listener initialized.");

  CometChat.addMessageListener(
    "GEMINI_BOT_LISTENER",
    new CometChat.MessageListener({
      onTextMessageReceived: async (message: CometChat.BaseMessage) => {
        const senderUID = message.getSender().getUid();

        if (senderUID !== BOT_UID) {
          await handleGeminiPrompt(message as CometChat.TextMessage);
        } else {
          console.log("🤖 Ignoring message from bot");
        }
      },
    })
  );
};

const handleGeminiPrompt = async (message: CometChat.TextMessage) => {
  const prompt = message.getText();
  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_GEMINI_API_KEY
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiResponse.json();
    console.log("🤖 Gemini response:", data);
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't generate a response.";

    await sendGeminiReply(message.getSender().getUid(), reply);
  } catch (err) {
    console.error("Gemini fetch error:", err);
  }
};

const sendGeminiReply = async (receiverUID: string, text: string) => {
  // Create the message
  const replyMsg = new CometChat.TextMessage(
    receiverUID,
    text,
    CometChat.RECEIVER_TYPE.USER
  );

  replyMsg.setSender(BOT_UID);

  try {
    await CometChat.sendMessage(replyMsg);
    console.log("✅ Bot reply sent successfully to:", receiverUID);
  } catch (err) {
    console.error("Error sending bot reply:", err);
  }
};
