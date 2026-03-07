"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  // Zoom & pan state
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: data.width, h: data.height });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));

  // Connection counts for node sizing
  const connectionCount = new Map<string, number>();
  for (const edge of data.edges) {
    connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
    connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
  }

  // Nodes connected to hovered or selected node
  const focusNode = hoveredNode || selectedNode;
  const connectedToFocus = new Set<string>();
  if (focusNode) {
    for (const edge of data.edges) {
      if (edge.source === focusNode) connectedToFocus.add(edge.target);
      if (edge.target === focusNode) connectedToFocus.add(edge.source);
    }
  }

  // Search matching
  const searchMatches = new Set<string>();
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    for (const node of data.nodes) {
      if (
        node.label.toLowerCase().includes(q) ||
        node.source.toLowerCase().includes(q) ||
        node.id.toLowerCase().includes(q)
      ) {
        searchMatches.add(node.id);
      }
    }
  }

  const hasSearch = searchQuery.trim().length > 0;
  const hasFilter = activeFilter !== null;

  // ── Zoom ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.1 : 0.9;
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
      const my = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;

      const newW = Math.max(200, Math.min(data.width * 3, viewBox.w * factor));
      const newH = Math.max(150, Math.min(data.height * 3, viewBox.h * factor));

      setViewBox({
        x: mx - ((mx - viewBox.x) / viewBox.w) * newW,
        y: my - ((my - viewBox.y) / viewBox.h) * newH,
        w: newW,
        h: newH,
      });
    },
    [viewBox, data.width, data.height]
  );

  // ── Pan ──────────────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as SVGElement;
      if (target.closest("g[data-node]")) return;

      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [viewBox]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      const dx = (e.clientX - panStartRef.current.x) * scaleX;
      const dy = (e.clientY - panStartRef.current.y) * scaleY;
      setViewBox((v) => ({
        ...v,
        x: panStartRef.current.vx - dx,
        y: panStartRef.current.vy - dy,
      }));
    },
    [isPanning, viewBox.w, viewBox.h]
  );

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // ── Focus on node (animated pan) ────────────────────────────────────
  const focusOnNode = useCallback(
    (node: GraphNode) => {
      const targetW = data.width * 0.5;
      const targetH = data.height * 0.5;
      setViewBox({
        x: node.x - targetW / 2,
        y: node.y - targetH / 2,
        w: targetW,
        h: targetH,
      });
    },
    [data.width, data.height]
  );

  // Focus on search result
  useEffect(() => {
    if (searchMatches.size === 1) {
      const nodeId = Array.from(searchMatches)[0];
      const node = nodeMap.get(nodeId);
      if (node) focusOnNode(node);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  const handleNodeClick = useCallback(
    (node: GraphNode, e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedNode === node.id) {
        router.push(node.url);
      } else {
        setSelectedNode(node.id);
        focusOnNode(node);
      }
    },
    [selectedNode, router, focusOnNode]
  );

  const handleReset = useCallback(() => {
    setViewBox({ x: 0, y: 0, w: data.width, h: data.height });
    setSelectedNode(null);
    setSearchQuery("");
    setActiveFilter(null);
  }, [data.width, data.height]);

  // Build legend from unique sources
  const sources = Array.from(new Set(data.nodes.map((n) => n.source)));

  return (
    <div className="relative space-y-4">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyber-yellow/40"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {sources.map((source) => (
            <button
              key={source}
              onClick={() => setActiveFilter(activeFilter === source ? null : source)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border transition-colors ${
                activeFilter === source
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/5 bg-transparent text-neutral-500 hover:text-neutral-300 hover:border-white/10"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: SOURCE_COLORS[source] || "#666" }}
              />
              {SOURCE_LABELS[source] || source}
            </button>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-neutral-500 hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
        >
          Reset View
        </button>
      </div>

      {/* Graph container */}
      <div
        ref={containerRef}
        className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: "70vh", transition: isPanning ? "none" : "viewBox 0.4s ease-out" }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Edges */}
          {data.edges.map((edge, i) => {
            const s = nodeMap.get(edge.source);
            const t = nodeMap.get(edge.target);
            if (!s || !t) return null;

            const sourceVisible =
              (!hasFilter || s.source === activeFilter) &&
              (!hasSearch || searchMatches.has(s.id));
            const targetVisible =
              (!hasFilter || t.source === activeFilter) &&
              (!hasSearch || searchMatches.has(t.id));

            if (hasFilter && !sourceVisible && !targetVisible) return null;

            const isFocusEdge =
              focusNode &&
              (edge.source === focusNode || edge.target === focusNode);
            const isDimmed =
              (focusNode && !isFocusEdge) ||
              (hasSearch && !searchMatches.has(s.id) && !searchMatches.has(t.id));

            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={isFocusEdge ? "#f5c542" : "#ffffff"}
                strokeOpacity={isDimmed ? 0.02 : isFocusEdge ? 0.5 : 0.08}
                strokeWidth={isFocusEdge ? 2 : 1}
                style={{ transition: "all 0.3s" }}
              />
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node) => {
            const color = SOURCE_COLORS[node.source] || "#666";
            const connections = connectionCount.get(node.id) || 0;
            const radius = Math.max(5, Math.min(14, 4 + connections * 1.5));

            const isFiltered = hasFilter && node.source !== activeFilter;
            const isSearchHidden = hasSearch && !searchMatches.has(node.id);
            const isFocused = focusNode === node.id;
            const isConnected = connectedToFocus.has(node.id);
            const isDimmed =
              (focusNode && !isFocused && !isConnected) ||
              isFiltered ||
              isSearchHidden;

            const isSelected = selectedNode === node.id;

            return (
              <g
                key={node.id}
                data-node={node.id}
                style={{ cursor: "pointer", transition: "opacity 0.3s" }}
                opacity={isDimmed ? 0.12 : 1}
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={() => handleNodeHover(null)}
                onClick={(e) => handleNodeClick(node, e)}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={node.x} cy={node.y} r={radius + 10}
                    fill="none" stroke={color}
                    strokeOpacity={0.15} strokeWidth={4}
                  >
                    <animate attributeName="r" values={`${radius + 8};${radius + 12};${radius + 8}`} dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Glow ring for hovered node */}
                {(isFocused || isSelected) && (
                  <circle
                    cx={node.x} cy={node.y} r={radius + 6}
                    fill="none" stroke={color}
                    strokeOpacity={0.3} strokeWidth={2}
                  />
                )}
                <circle
                  cx={node.x} cy={node.y} r={radius}
                  fill={color}
                  fillOpacity={isFocused || isSelected ? 1 : 0.8}
                  stroke={color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeOpacity={isSelected ? 0.8 : 0.4}
                />
                {/* Label */}
                {(radius > 8 || isFocused || isSelected) && (
                  <text
                    x={node.x} y={node.y + radius + 14}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-neutral-400"
                    style={{ pointerEvents: "none" }}
                  >
                    {node.label.length > 25 ? node.label.slice(0, 25) + "..." : node.label}
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

      {/* Selected node info */}
      {selectedNode && (() => {
        const node = nodeMap.get(selectedNode);
        if (!node) return null;
        const neighbors = Array.from(connectedToFocus)
          .map((id) => nodeMap.get(id))
          .filter(Boolean) as GraphNode[];

        return (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: SOURCE_COLORS[node.source] || "#666" }}
                />
                <span className="text-sm font-mono font-semibold text-white">
                  {node.label}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded">
                  {SOURCE_LABELS[node.source] || node.source}
                </span>
              </div>
              <button
                onClick={() => router.push(node.url)}
                className="text-xs font-mono text-cyber-yellow hover:underline"
              >
                Visit page →
              </button>
            </div>

            {neighbors.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1.5">
                  Connected to ({neighbors.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {neighbors.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => { setSelectedNode(n.id); focusOnNode(n); }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-mono text-neutral-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: SOURCE_COLORS[n.source] || "#666" }}
                      />
                      {n.label.length > 20 ? n.label.slice(0, 20) + "..." : n.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <p className="text-center text-[11px] text-neutral-600 font-mono">
        Scroll to zoom. Drag to pan. Click a node to select, click again to navigate. Filter by category above.
      </p>
    </div>
  );
}
