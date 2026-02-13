import { searchContent } from "@/lib/knowledge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query || !query.trim()) {
    return Response.json({ results: [] });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return Response.json(
      { error: "Search is not configured." },
      { status: 500 }
    );
  }

  try {
    const results = await searchContent(query.trim(), 8);
    return Response.json({ results });
  } catch (error) {
    console.error("[search] Error:", error);
    return Response.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
