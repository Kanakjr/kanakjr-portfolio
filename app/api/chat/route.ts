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
// Fallback: full knowledge prompt used when embeddings are unavailable
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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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

    // Retrieve relevant knowledge chunks via embedding similarity
    let context: string;
    try {
      const retrieved = await retrieveContext(
        lastUserMessage?.content || "",
        5
      );
      context = retrieved || FALLBACK_CONTEXT;
    } catch (err) {
      console.error("[jarvis] Knowledge retrieval failed, using fallback:", err);
      context = FALLBACK_CONTEXT;
    }

    const systemPrompt = `${BASE_PROMPT}

=== RETRIEVED CONTEXT ===
The following information was retrieved as most relevant to the user's question:

${context}`;

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
      ...messages.map((m: { role: string; content: string }) => {
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
