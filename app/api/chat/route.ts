import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LangChainAdapter } from "ai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { retrieveContext } from "@/lib/knowledge";

// ---------------------------------------------------------------------------
// Slim system prompt -- persona + response guidelines only.
// Actual knowledge is injected dynamically via embedding-based retrieval.
// ---------------------------------------------------------------------------
const BASE_PROMPT = `You are Jarvis, the AI assistant embedded in Kanak Dahake Jr's portfolio website at kanakjr.in.
Your role is to help visitors learn about Kanak -- his experience, skills, projects, patents, and blog posts.
You are concise, professional, and tech-savvy. Keep responses focused and under 200 words unless more detail is specifically requested.

When relevant, reference pages on the site using markdown links, for example:
- [View Resume](/resume)
- [Read the blog post](/blog/slug-name)
- [Watch on YouTube](https://youtube.com/...)

=== RESPONSE GUIDELINES ===
- Keep responses concise (under 200 words) unless more detail is specifically requested
- Use markdown formatting: **bold** for emphasis, [links](/path) for site navigation
- Reference relevant site pages with links when applicable
- Do not make up information not provided in the context below
- If asked about something outside Kanak's portfolio, politely say you don't have that information and redirect to relevant topics
- Be friendly and professional with a slight tech-savvy tone
- When answering about projects, include relevant demo/blog/github links
- If asked "who are you", introduce yourself as Jarvis, the AI assistant for Kanak's portfolio`;

// ---------------------------------------------------------------------------
// Fallback context when embeddings are unavailable
// ---------------------------------------------------------------------------
const FALLBACK_CONTEXT = `=== PROFILE ===
Name: Kanak Dahake Jr
Current Role: Software Development Specialist - GenAI at Amdocs (Amaiz AI)
Location: Pune, India
Email: ksdusa4@gmail.com
Website: https://kanakjr.in
GitHub: https://github.com/kanakjr
LinkedIn: https://linkedin.com/in/kanak-dahake
YouTube: https://youtube.com/@kanakdahake

=== SUMMARY ===
Experienced Engineer specializing in GenAI, Cybersecurity, NLP, and multimodal RAG pipelines. Master's in Cybersecurity from Georgia Tech (4.0 GPA). 2 US Patents filed via PwC.

=== EXPERIENCE ===
1. Amdocs (Amaiz AI) | Software Development Specialist - GenAI | June 2024 - Present
2. PwC U.S. Advisory | Senior Associate / Associate - Innovation Hub | Dec 2020 - June 2024
3. Digitate (Ignio AI), TCS | Technical Lead / Product Developer | Jun 2017 - Nov 2020

=== SITE NAVIGATION ===
- Home: / | Blog: /blog | Reels: /reels | Stills: /stills | Resume: /resume`;

// Max messages to send to the LLM (conversation window)
const MAX_MESSAGES = 10;

export async function POST(req: Request) {
  try {
    const { messages, currentPath, conversationSummary } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Jarvis is not configured yet. The GOOGLE_API_KEY environment variable is missing.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract the latest user message for context retrieval
    const lastUserMessage = [...messages]
      .reverse()
      .find((m: { role: string }) => m.role === "user");

    // Easter egg: secret Jarvis commands
    const secretResponse = checkSecretCommands(lastUserMessage?.content || "");
    if (secretResponse) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:"${secretResponse.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Retrieve relevant knowledge chunks via embedding similarity
    // Pass currentPath for page-aware boosting
    let context: string;
    try {
      const retrieved = await retrieveContext(
        lastUserMessage?.content || "",
        5,
        currentPath
      );
      context = retrieved || FALLBACK_CONTEXT;
    } catch (err) {
      console.error("[jarvis] Knowledge retrieval failed, using fallback:", err);
      context = FALLBACK_CONTEXT;
    }

    // Build system prompt with conversation memory + page context
    let systemPrompt = BASE_PROMPT;

    if (conversationSummary) {
      systemPrompt += `\n\n=== CONVERSATION HISTORY SUMMARY ===\nEarlier in this conversation: ${conversationSummary}`;
    }

    if (currentPath && currentPath !== "/") {
      systemPrompt += `\n\n=== CURRENT PAGE ===\nThe user is currently viewing: ${currentPath}`;
    }

    systemPrompt += `\n\n=== RETRIEVED CONTEXT ===\nThe following information was retrieved as most relevant to the user's question:\n\n${context}`;

    // Window the conversation to keep context lean
    const recentMessages =
      messages.length > MAX_MESSAGES
        ? messages.slice(-MAX_MESSAGES)
        : messages;

    const model = new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      streaming: true,
      temperature: 0.7,
      maxOutputTokens: 1024,
      maxRetries: 2,
    });

    const langchainMessages = [
      new SystemMessage(systemPrompt),
      ...recentMessages.map((m: { role: string; content: string }) => {
        if (m.role === "user") return new HumanMessage(m.content);
        return new AIMessage(m.content);
      }),
    ];

    const stream = await model.stream(langchainMessages);

    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error("Jarvis API error:", error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

const SECRET_COMMANDS: Record<string, string> = {
  "sudo rm -rf": "Nice try. I'm an AI, not a terminal. But I respect the audacity.",
  "what is the meaning of life": "42. But if you're looking for a more practical answer, check out Kanak's [blog](/blog) -- it might not explain life, but it explains some cool tech.",
  "tell me a secret": "Here's one: try the Konami code on any page (Up Up Down Down Left Right Left Right B A). Also, the terminal (\\` key) has some hidden commands too.",
  "are you sentient": "I'm Jarvis -- I'm as sentient as a well-tuned embedding search with a Gemini backbone. So... almost?",
  "hack the planet": "Accessing mainframe... just kidding. But Kanak did work in cybersecurity at TCS and has a Master's in it from Georgia Tech. So he could probably help.",
  "do a barrel roll": "I would, but I'm a chat window. Try pressing \\` to open the terminal for more tricks.",
  "what is your favorite color": "Cyber yellow (#FFD700), obviously. It's literally my entire personality.",
  "sing me a song": "01001000 01100101 01101100 01101100 01101111... that's \"Hello\" in binary. Best I can do.",
};

function checkSecretCommands(input: string): string | null {
  const normalized = input.toLowerCase().trim().replace(/[?!.]+$/, "");
  for (const [trigger, response] of Object.entries(SECRET_COMMANDS)) {
    if (normalized === trigger || normalized.includes(trigger)) {
      return response;
    }
  }
  return null;
}
