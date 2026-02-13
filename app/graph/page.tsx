import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import RetroGrid from "@/components/magicui/retro-grid";
import ContentGraph from "@/components/ContentGraph";

interface GraphNode {
  id: string;
  label: string;
  source: string;
  url: string;
  x: number;
  y: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

interface GraphData {
  width: number;
  height: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function GraphPage() {
  const filePath = join(process.cwd(), "data", "content-graph.json");
  let graphData: GraphData | null = null;

  if (existsSync(filePath)) {
    graphData = JSON.parse(readFileSync(filePath, "utf-8"));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
            Knowledge <span className="text-cyber-yellow">Graph</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            How skills, projects, experience, and content connect -- computed
            from embedding similarity.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </div>

        {/* Graph */}
        {graphData ? (
          <ContentGraph data={graphData} />
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-mono">
              Graph data not generated yet. Run: npm run embeddings
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
