"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

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

const SOURCE_COLORS: Record<string, string> = {
  profile: "#f5c542",
  summary: "#f5c542",
  experience: "#a78bfa",
  education: "#c084fc",
  patents: "#fbbf24",
  skills: "#22d3ee",
  projects: "#60a5fa",
  certifications: "#34d399",
  awards: "#f87171",
  volunteer: "#fb923c",
  blog: "#34d399",
  videos: "#f87171",
};

const SOURCE_LABELS: Record<string, string> = {
  profile: "Profile",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  patents: "Patents",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certs",
  awards: "Awards",
  volunteer: "Speaking",
  blog: "Blog",
  videos: "Videos",
};

export default function ContentGraph({ data }: { data: GraphData }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));

  const connectedToHovered = new Set<string>();
  if (hoveredNode) {
    for (const edge of data.edges) {
      if (edge.source === hoveredNode) connectedToHovered.add(edge.target);
      if (edge.target === hoveredNode) connectedToHovered.add(edge.source);
    }
  }

  const handleNodeHover = useCallback(
    (node: GraphNode | null, event?: React.MouseEvent) => {
      if (node && event && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setTooltip({
          label: node.label,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 15,
        });
        setHoveredNode(node.id);
      } else {
        setTooltip(null);
        setHoveredNode(null);
      }
    },
    []
  );

  // Build legend from unique sources
  const sources = Array.from(new Set(data.nodes.map((n) => n.source)));

  // Compute node sizes based on connection count
  const connectionCount = new Map<string, number>();
  for (const edge of data.edges) {
    connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
    connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {sources.map((source) => (
          <div key={source} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: SOURCE_COLORS[source] || "#666" }}
            />
            <span className="text-[11px] font-mono text-neutral-400">
              {SOURCE_LABELS[source] || source}
            </span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${data.width} ${data.height}`}
          className="w-full h-auto"
          style={{ maxHeight: "70vh" }}
        >
          {/* Edges */}
          {data.edges.map((edge, i) => {
            const s = nodeMap.get(edge.source);
            const t = nodeMap.get(edge.target);
            if (!s || !t) return null;

            const isHighlighted =
              hoveredNode &&
              (edge.source === hoveredNode || edge.target === hoveredNode);
            const isDimmed =
              hoveredNode && !isHighlighted;

            return (
              <line
                key={i}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={isHighlighted ? "#f5c542" : "#ffffff"}
                strokeOpacity={isDimmed ? 0.03 : isHighlighted ? 0.5 : 0.08}
                strokeWidth={isHighlighted ? 2 : 1}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node) => {
            const color = SOURCE_COLORS[node.source] || "#666";
            const connections = connectionCount.get(node.id) || 0;
            const radius = Math.max(5, Math.min(14, 4 + connections * 1.5));

            const isHighlighted =
              hoveredNode === node.id || connectedToHovered.has(node.id);
            const isDimmed = hoveredNode && !isHighlighted && hoveredNode !== node.id;

            return (
              <g
                key={node.id}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                opacity={isDimmed ? 0.2 : 1}
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={() => handleNodeHover(null)}
                onClick={() => router.push(node.url)}
              >
                {/* Glow ring for hovered node */}
                {hoveredNode === node.id && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 6}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.3}
                    strokeWidth={2}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={color}
                  fillOpacity={hoveredNode === node.id ? 1 : 0.8}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.4}
                />
                {/* Label for larger nodes or hovered */}
                {(radius > 8 || hoveredNode === node.id) && (
                  <text
                    x={node.x}
                    y={node.y + radius + 14}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-neutral-400"
                    style={{ pointerEvents: "none" }}
                  >
                    {node.label.length > 25
                      ? node.label.slice(0, 25) + "..."
                      : node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-xs font-mono text-white shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.label}
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-neutral-600 font-mono mt-3">
        Nodes represent content chunks. Edges connect chunks with high semantic
        similarity. Click a node to navigate.
      </p>
    </div>
  );
}
