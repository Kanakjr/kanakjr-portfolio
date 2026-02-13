import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

/**
 * Summarizes a conversation history into a compact context string.
 * Called by the client when the conversation grows long, to enable
 * memory across message window truncation.
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_API_KEY || !messages || messages.length < 4) {
      return Response.json({ summary: "" });
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0,
      maxOutputTokens: 150,
    });

    const langchainMessages = [
      new SystemMessage(
        "Summarize the following conversation in 2-3 concise sentences. Focus on what topics the user asked about and what key information was provided. Plain text only."
      ),
      ...messages.map((m: { role: string; content: string }) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
    ];

    const result = await model.invoke(langchainMessages);
    const summary = (result.content as string).trim();

    return Response.json({ summary });
  } catch (error) {
    console.error("[summarize] Error:", error);
    return Response.json({ summary: "" });
  }
}
