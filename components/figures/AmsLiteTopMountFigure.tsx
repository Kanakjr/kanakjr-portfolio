"use client";

import React, { useState, useId } from "react";
import {
  fitProjection,
  cylinder,
  slabOf,
  ring,
  knurl,
  sideArc,
  iso,
  lineOnTop,
  planOutline,
  insetPlan,
  corners,
  boxCorners,
  radialTicks,
  depthOf,
  type Projection,
  type Point3,
} from "@/components/iso/iso-kit";
import { Solid, Line, Dots, Plate } from "@/components/iso/draw";

export default function AmsLiteTopMountFigure() {
  const [viewMode, setViewMode] = useState<"assembly" | "spools" | "enclosure">("assembly");
  const [explode, setExplode] = useState(0); // 0 (assembled) to 1 (fully exploded)
  const [activeChannel, setActiveChannel] = useState<1 | 2 | 3 | 4>(1);
  const uniqueId = useId();

  // Canvas bounds & camera projection
  // Azimuth 38°, Elevation 26° captures the front 3/4 isometric perspective of the A1
  const W = 760;
  const H = 580;
  const bounds = boxCorners({ x: -85, y: -75, w: 175, d: 160, r: 0 }, -8, 335);
  const P: Projection = fitProjection(bounds, W, H, {
    pad: 36,
    azimuth: 38,
    elevation: 26,
  });

  // Filament channels
  const channels = [
    { id: 1, name: "Ch 1: Black PETG-HF", color: "#38bdf8", stroke: "#0284c7", temp: "245°C", flow: "18 mm³/s" },
    { id: 2, name: "Ch 2: White PLA Basic", color: "#f4f4f5", stroke: "#e4e4e7", temp: "220°C", flow: "22 mm³/s" },
    { id: 3, name: "Ch 3: Cyber Yellow PLA", color: "#facc15", stroke: "#eab308", temp: "215°C", flow: "20 mm³/s" },
    { id: 4, name: "Ch 4: Flame Red PETG", color: "#f87171", stroke: "#ef4444", temp: "240°C", flow: "19 mm³/s" },
  ] as const;
  const currentCh = channels.find((c) => c.id === activeChannel) || channels[0];

  // Explode motion offsets (mm)
  const mountLift = explode * 24;
  const latchDrop = explode * 22;
  const knobSlide = explode * 18;
  const amsLift = mountLift + explode * 32;
  const braceSpread = explode * 16;
  const enclosureLift = amsLift + explode * 24;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DAMPENING MAT & BASE CONSOLE (z = -6 to 14)
  // ─────────────────────────────────────────────────────────────────────────────
  // Navy blue foam dampening mat under printer
  const mat = slabOf({ x: -74, y: -70, w: 148, d: 140, r: 6 }, -6, 6, P, 6);
  // Main white printer base
  const base = slabOf({ x: -68, y: -64, w: 136, d: 128, r: 8 }, 0, 14, P, 8, 0.8);
  const baseGroove = planOutline(insetPlan({ x: -68, y: -64, w: 136, d: 128, r: 8 }, 3.5), 14, P);
  const baseScrews = corners({ x: -68, y: -64, w: 136, d: 128, r: 8 }, 9).map(([x, y]) => iso([x, y, 14], P));
  // Y-axis linear rail central recessed channel
  const railGrooveL = lineOnTop([-4, -58], [-4, 56], 14, P);
  const railGrooveR = lineOnTop([4, -58], [4, 56], 14, P);

  // PEI heated build plate on Y-carriage (z = 14 to 17)
  const bedPlate = slabOf({ x: -52, y: -46, w: 104, d: 94, r: 4 }, 14, 3, P, 6, 0.4);
  const bedGridOutline = planOutline(insetPlan({ x: -52, y: -46, w: 104, d: 94, r: 4 }, 4), 17, P);
  // Bambu Lab 4-quadrant alignment grid marks on PEI plate
  const bedCrossH = lineOnTop([-46, 1], [46, 1], 17, P);
  const bedCrossV = lineOnTop([0, -40], [0, 42], 17, P);

  // Front right control touchscreen console (z = 8 to 22)
  const screenArm = slabOf({ x: 54, y: -62, w: 16, d: 8, r: 2 }, 6, 6, P, 4);
  const screenBody = slabOf({ x: 58, y: -72, w: 26, d: 22, r: 3 }, 10, 8, P, 6, 0.5);
  const screenGroove = planOutline(insetPlan({ x: 58, y: -72, w: 26, d: 22, r: 3 }, 2), 18, P);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. LOWER Z-AXIS TRIANGULAR TRUSS STIFFENERS (Custom printed white PETG)
  // Look at PXL_20261015_102645526.jpg - clamps Z-column and forms rear triangle
  // ─────────────────────────────────────────────────────────────────────────────
  const leftBraceX = -62 - braceSpread;
  const rightBraceX = 48 + braceSpread;

  // Left stiffener collar & rear triangular foot
  const leftCollar = slabOf({ x: leftBraceX - 4, y: -12, w: 18, d: 24, r: 3 }, 14, 26, P, 6, 0.5);
  const leftFoot = slabOf({ x: leftBraceX - 3, y: 12, w: 16, d: 42, r: 3 }, 0, 14, P, 6, 0.5);
  const leftStrut = slabOf({ x: leftBraceX - 2, y: 14, w: 14, d: 28, r: 2 }, 14, 20, P, 4, 0.4);
  const leftBraceBolts = [
    iso([leftBraceX + 5, -10, 24], P),
    iso([leftBraceX + 5, -10, 34], P),
    iso([leftBraceX + 5, 36, 14], P),
    iso([leftBraceX + 5, 48, 8], P),
  ];

  // Right stiffener collar & rear triangular foot
  const rightCollar = slabOf({ x: rightBraceX - 2, y: -12, w: 18, d: 24, r: 3 }, 14, 26, P, 6, 0.5);
  const rightFoot = slabOf({ x: rightBraceX - 1, y: 12, w: 16, d: 42, r: 3 }, 0, 14, P, 6, 0.5);
  const rightStrut = slabOf({ x: rightBraceX, y: 14, w: 14, d: 28, r: 2 }, 14, 20, P, 4, 0.4);
  const rightBraceBolts = [
    iso([rightBraceX + 7, -10, 24], P),
    iso([rightBraceX + 7, -10, 34], P),
    iso([rightBraceX + 7, 36, 14], P),
    iso([rightBraceX + 7, 48, 8], P),
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Z-COLUMNS, LEAD SCREWS & TOP CROSSBEAM (z = 14 to 184)
  // ─────────────────────────────────────────────────────────────────────────────
  const zLeftColumn = slabOf({ x: -62, y: -9, w: 14, d: 18, r: 2 }, 14, 156, P, 6);
  const zRightColumn = slabOf({ x: 48, y: -9, w: 14, d: 18, r: 2 }, 14, 156, P, 6);
  const leadScrewL = cylinder(-55, 6, 3, 16, 152, P, 16);
  const leadScrewR = cylinder(55, 6, 3, 16, 152, P, 16);
  // Column top endcaps
  const zCapL = slabOf({ x: -63, y: -10, w: 16, d: 20, r: 2 }, 170, 4, P, 4);
  const zCapR = slabOf({ x: 47, y: -10, w: 16, d: 20, r: 2 }, 170, 4, P, 4);

  // Top horizontal crossbeam connecting columns
  const crossbeam = slabOf({ x: -64, y: -10, w: 128, d: 20, r: 2.5 }, 170, 15, P, 6, 0.8);
  const beamGroove = planOutline(insetPlan({ x: -64, y: -10, w: 128, d: 20, r: 2.5 }, 2), 185, P);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. X-AXIS GANTRY, TOOLHEAD & PURGE WIPER (z = 82 to 118)
  // ─────────────────────────────────────────────────────────────────────────────
  const xRail = slabOf({ x: -60, y: -6, w: 120, d: 13, r: 1.5 }, 90, 12, P, 6);
  // Rail mounting bolts along the face
  const railBolts = [-45, -30, -15, 0, 15, 30, 45].map((bx) => iso([bx, -6, 96], P));

  // Toolhead extruder assembly
  const toolhead = slabOf({ x: -14, y: -15, w: 28, d: 23, r: 3 }, 84, 25, P, 8, 0.6);
  const toolheadGroove = planOutline(insetPlan({ x: -14, y: -15, w: 28, d: 23, r: 3 }, 2), 109, P);
  const toolheadHub = cylinder(0, -6, 5, 109, 8, P, 20); // 4-in-1 PTFE connector hub on top
  const nozzleBlock = slabOf({ x: -6, y: -10, w: 12, d: 12, r: 2 }, 78, 6, P, 4);

  // Left purge wiper basket (white perforated 3D printed box from PXL_20261015_103400933.jpg)
  const purgeBasket = slabOf({ x: -74, y: -12, w: 14, d: 18, r: 2 }, 82, 18, P, 6, 0.4);
  const purgeHoles = [
    iso([-74, -8, 88], P),
    iso([-74, 0, 88], P),
    iso([-74, -8, 94], P),
    iso([-74, 0, 94], P),
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TOP MOUNT CLAMP ASSEMBLY (MakerWorld #92486)
  // Saddle, underside latch hook, and front tightening knob
  // ─────────────────────────────────────────────────────────────────────────────
  const clampZ = 185 + mountLift;
  const latchZ = 168 - latchDrop;

  // Underside latch hook (pulls downward on explode)
  const mountLatch = slabOf({ x: -20, y: -12, w: 40, d: 24, r: 3 }, latchZ, 10, P, 6);
  const latchGroove = planOutline(insetPlan({ x: -20, y: -12, w: 40, d: 24, r: 3 }, 2), latchZ + 10, P);
  const latchBolts = [-12, 12].map((lx) => iso([lx, -12, latchZ + 5], P));

  // Upper saddle straddling the crossbeam
  const mountSaddle = slabOf({ x: -22, y: -13, w: 44, d: 26, r: 3 }, clampZ, 13, P, 8, 0.6);
  const saddleGroove = planOutline(insetPlan({ x: -22, y: -13, w: 44, d: 26, r: 3 }, 2.5), clampZ + 13, P);

  // Center vertical riser column
  const riserZ = clampZ + 13;
  const mountRiser = slabOf({ x: -16, y: -11, w: 32, d: 22, r: 3 }, riserZ, 18, P, 6, 0.5);

  // Front tightening dial/knob (prominent feature in PXL_20261015_103400933.jpg)
  const knobY = -15 - knobSlide;
  const clampKnob = cylinder(0, knobY, 5.5, riserZ + 4, 5, P, 22, 0.3);
  const knobKnurl = knurl(0, knobY, 5.5, riserZ + 4.5, riserZ + 8.5, 20, P);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. AMS LITE STADIUM-SHAPED BODY & FEEDER MOTORS (z = 216 to 282)
  // Look at PXL_20261015_103400933.jpg: wide capsule shell with 2 front hubs
  // ─────────────────────────────────────────────────────────────────────────────
  const amsZ = 216 + amsLift;

  // Stadium shell (r=16 on w=104 gives the exact rounded gamepad contour)
  const amsShell = slabOf({ x: -52, y: -8, w: 104, d: 16, r: 16 }, amsZ, 36, P, 12, 0.8);
  const amsGroove = planOutline(insetPlan({ x: -52, y: -8, w: 104, d: 16, r: 16 }, 2.5), amsZ + 36, P, 12);

  // Central dual feeder drive motor module (dark charcoal housing on top)
  const feederZ = amsZ + 34;
  const feederBody = slabOf({ x: -18, y: -10, w: 36, d: 20, r: 3 }, feederZ, 26, P, 6, 0.6);
  const feederGroove = planOutline(insetPlan({ x: -18, y: -10, w: 36, d: 20, r: 3 }, 2), feederZ + 26, P);

  // 4 transparent orange filament entry funnels on top of feeder
  const funnelZ = feederZ + 26;
  const funnels = [
    { id: 1, cx: -9, cy: -6, active: activeChannel === 1 },
    { id: 2, cx: 9, cy: -6, active: activeChannel === 2 },
    { id: 3, cx: -9, cy: 4, active: activeChannel === 3 },
    { id: 4, cx: 9, cy: 4, active: activeChannel === 4 },
  ];
  const funnelSolids = funnels.map((f) => cylinder(f.cx, f.cy, 3, funnelZ, 6, P, 16));

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. ROTARY SPOOL SPINDLES & FILAMENT SPOOLS
  // Mode 1: Bare 3-fin spring hubs (PXL_20261015_103400933.jpg)
  // Mode 2: Loaded black filament spools (PXL_20261015_110443755.MP.jpg)
  // Mode 3: Dry enclosure capsules (MakerWorld #486153)
  // ─────────────────────────────────────────────────────────────────────────────
  const hubLeftX = -35;
  const hubRightX = 35;
  const hubY = -8;
  const hubZ = amsZ + 12;

  // Left & Right rotary hubs
  const hubL = cylinder(hubLeftX, hubY, 11, hubZ, 12, P, 24, 0.5);
  const hubR = cylinder(hubRightX, hubY, 11, hubZ, 12, P, 24, 0.5);
  const hubArcL = sideArc(hubLeftX, hubY, 11, hubZ + 6, P, 16);
  const hubArcR = sideArc(hubRightX, hubY, 11, hubZ + 6, P, 16);

  // 3-fin spring gripper blades on each hub (Mode 1: bare inspection view)
  const leftFins = [0, 120, 240].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const fx = hubLeftX + 9 * Math.cos(rad);
    const fy = hubY + 9 * Math.sin(rad);
    return cylinder(fx, fy, 2, hubZ + 4, 10, P, 10);
  });
  const rightFins = [0, 120, 240].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const fx = hubRightX + 9 * Math.cos(rad);
    const fy = hubY + 9 * Math.sin(rad);
    return cylinder(fx, fy, 2, hubZ + 4, 10, P, 10);
  });

  // Loaded filament spools (Mode 2)
  const spoolL = cylinder(hubLeftX, hubY, 34, hubZ - 4, 20, P, 36, 0.8);
  const spoolR = cylinder(hubRightX, hubY, 34, hubZ - 4, 20, P, 36, 0.8);
  const spoolTicksL = radialTicks(hubLeftX, hubY, 32, 24, 6, hubZ + 16, [1.5, 3], P);
  const spoolTicksR = radialTicks(hubRightX, hubY, 32, 24, 6, hubZ + 16, [1.5, 3], P);

  // Dry box enclosure capsules (Mode 3)
  const encZ = amsZ + enclosureLift - 6;
  const encL = cylinder(hubLeftX, hubY, 40, encZ, 32, P, 36, 1.0);
  const encR = cylinder(hubRightX, hubY, 40, encZ, 32, P, 36, 1.0);
  const encBridge = slabOf({ x: -16, y: -10, w: 32, d: 20, r: 3 }, encZ + 10, 18, P, 6, 0.5);
  const hygroL = cylinder(0, -6, 5.5, encZ + 28, 2, P, 20);
  const hygroR = cylinder(0, 4, 5.5, encZ + 28, 2, P, 20);

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. OVERHEAD CURVED PTFE GUIDE CRANE MAST / BOOM
  // Look at PXL_20261015_103400933.jpg: rises up, arches left, guides 4 tubes
  // ─────────────────────────────────────────────────────────────────────────────
  // Vertical mast boom segment behind AMS unit
  const mastBase = cylinder(-4, 6, 4, amsZ + 10, 56, P, 16);
  // Upper arched elbow boom extending to the left
  const mastElbow = cylinder(-18, 6, 3.5, amsZ + 66, 18, P, 16);
  const mastApex = cylinder(-38, 8, 3, amsZ + 78, 12, P, 16);

  // Guide ring clip at apex holding the 4 tubes
  const mastClipRing = ring(-38, 8, 5, amsZ + 84, P, 20);

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. 4 PTFE BOWDEN TUBES (Emerging from funnels, through mast, into toolhead)
  // ─────────────────────────────────────────────────────────────────────────────
  // Waypoint paths projected to 2D screen coordinates
  const toolheadEntry = iso([0, -6, 117], P);

  const ptfeCurves = [
    // Tube 1 (Front Left)
    {
      id: 1,
      start: iso([-9, -6, funnelZ + 6], P),
      midUp: iso([-16, 2, amsZ + 60], P),
      apex: iso([-36, 8, amsZ + 86], P),
      swoop: iso([-50, -4, 210], P),
      entry: [toolheadEntry[0] - 2, toolheadEntry[1]],
    },
    // Tube 2 (Front Right)
    {
      id: 2,
      start: iso([9, -6, funnelZ + 6], P),
      midUp: iso([-12, 4, amsZ + 60], P),
      apex: iso([-38, 8, amsZ + 84], P),
      swoop: iso([-46, -4, 205], P),
      entry: [toolheadEntry[0] + 2, toolheadEntry[1]],
    },
    // Tube 3 (Rear Left)
    {
      id: 3,
      start: iso([-9, 4, funnelZ + 6], P),
      midUp: iso([-18, 6, amsZ + 62], P),
      apex: iso([-40, 8, amsZ + 87], P),
      swoop: iso([-52, -2, 215], P),
      entry: [toolheadEntry[0] - 1, toolheadEntry[1] - 1],
    },
    // Tube 4 (Rear Right)
    {
      id: 4,
      start: iso([9, 4, funnelZ + 6], P),
      midUp: iso([-14, 8, amsZ + 62], P),
      apex: iso([-42, 8, amsZ + 85], P),
      swoop: iso([-48, -2, 210], P),
      entry: [toolheadEntry[0] + 1, toolheadEntry[1] - 1],
    },
  ];

  // Helper to build smooth SVG bezier curve string
  const tubePaths = ptfeCurves.map((c) => {
    return `M ${c.start[0]} ${c.start[1]} C ${c.midUp[0]} ${c.midUp[1]} ${c.apex[0] + 6} ${c.apex[1] + 8} ${c.apex[0]} ${c.apex[1]} C ${c.swoop[0]} ${c.swoop[1]} ${c.entry[0] - 8} ${c.entry[1] - 22} ${c.entry[0]} ${c.entry[1]}`;
  });

  // Callout coordinates
  const calKnob = iso([0, knobY, riserZ + 6], P);
  const calClamp = iso([22, -13, clampZ + 6], P);
  const calMast = iso([-38, 8, amsZ + 84], P);
  const calBrace = iso([leftBraceX + 5, 20, 20], P);

  // Status readout strings
  const readoutStatus =
    explode > 0.05
      ? `EXPLODED VIEW ${Math.round(explode * 100)}% · TOP MOUNT & BRACE ISOLATION`
      : viewMode === "assembly"
      ? `ASSEMBLY VIEW · 3-FIN ROTARY SPINDLES · ACTIVE: ${currentCh.name.toUpperCase()} · ${currentCh.temp}`
      : viewMode === "spools"
      ? `PRINT OPERATION · BAMBU SPOOLS LOADED · ACTIVE: ${currentCh.name.toUpperCase()} · ${currentCh.flow}`
      : `DRY ENCLOSURE TYPE 01 · SEALED CHAMBER: 14% RH · 28.4°C`;

  return (
    <div className="iso my-10 not-prose">
      <Plate
        fig="FIG. 1"
        title="BAMBU LAB A1 · AMS LITE TOP MOUNT & RIG ASSEMBLY"
        hint="SLIDE EXPLODE · SELECT VIEW MODE · CLICK FILAMENT CH 1-4"
        readout={readoutStatus}
        keys={[
          { label: "Bambu A1 Frame & Gantry", mark: "dim" },
          { label: "Printed Top Mount & Stiffeners", mark: "raised" },
          { label: "AMS Lite Feeder & Spindles", mark: "lit" },
          { label: "Overhead PTFE Crane Mast", mark: "dashed" },
          { label: `Active PTFE Tube (${currentCh.name.split(":")[1]?.trim()})`, mark: "lit" },
        ]}
        caption={
          "Crafted isometric model of the Bambu Lab A1 equipped with the AMS Lite Top Mount (MakerWorld #92486) " +
          "and anti-resonance gantry stiffeners, referenced directly from Kanak's physical build (PXL_20261015_103400933.jpg). " +
          "The white clamp wraps the top crossbeam with a front tightening dial; the tall overhead crane mast cleanly routes " +
          "4 PTFE tubes down to the toolhead without gantry collisions."
        }
      >
        <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0d] p-3 shadow-2xl">
          {/* Main SVG Render */}
          <svg
            className="iso-svg mx-auto w-full max-h-[560px]"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Bambu Lab A1 AMS Lite Top Mount Isometric Diagram"
          >
            <defs>
              {/* Active tube glow filter */}
              <filter id={`tube-glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Enclosure translucent gradient */}
              <radialGradient id={`enc-glass-${uniqueId}`} cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.08" />
              </radialGradient>
            </defs>

            {/* Ground Shadow */}
            <g className="iso-floor opacity-50">
              <ellipse
                cx={iso([0, 10, -6], P)[0]}
                cy={iso([0, 10, -6], P)[1] + 20}
                rx={150}
                ry={65}
                fill="black"
                filter="blur(20px)"
              />
            </g>

            {/* ══════════════════════════════════════════════════════════════
                PAINTER'S ORDER (Back to Front, Bottom to Top)
                1. Dampening mat & Base & Bed
                2. Rear triangular stiffeners
                3. Dual Z-columns & lead screws
                4. X-rail, toolhead & purge wiper
                5. Front touchscreen console
                6. Top crossbeam
                7. Top mount clamp & front dial
                8. Overhead crane boom
                9. AMS Lite stadium shell & feeder
               10. Spindles / Spools / Enclosures
               11. PTFE tubes (with active glowing route)
               12. Precision callout annotations
            ════════════════════════════════════════════════════════════════ */}

            {/* 1 ── Mat, Base & Heated Bed */}
            <g id="base-assembly">
              <Solid paths={mat} tone="lo" className="fill-[#1e293b]" />
              <Solid paths={base} tone="mid" />
              <Line d={baseGroove} tone="faint" />
              <Dots points={baseScrews} size={0.5} tone="lo" />
              {/* Center Y linear rails */}
              <Line d={railGrooveL} tone="faint" />
              <Line d={railGrooveR} tone="faint" />
              {/* Heated Bed Plate with Bambu grid */}
              <Solid paths={bedPlate} tone="lo" className="fill-[#3f3f46]" />
              <Line d={bedGridOutline} tone="lo" />
              <Line d={bedCrossH} tone="faint" />
              <Line d={bedCrossV} tone="faint" />
            </g>

            {/* 2 ── Lower Z Stiffeners (White triangular truss braces) */}
            <g id="stiffeners">
              {/* Left Brace */}
              <Solid paths={leftFoot} tone="hi" className="fill-white" />
              <Solid paths={leftStrut} tone="hi" className="fill-white" />
              <Solid paths={leftCollar} tone="hi" className="fill-white" />
              <Dots points={leftBraceBolts} size={0.6} tone="mid" />
              {/* Right Brace */}
              <Solid paths={rightFoot} tone="hi" className="fill-white" />
              <Solid paths={rightStrut} tone="hi" className="fill-white" />
              <Solid paths={rightCollar} tone="hi" className="fill-white" />
              <Dots points={rightBraceBolts} size={0.6} tone="mid" />
            </g>

            {/* 3 ── Dual Z-Columns & Lead Screws */}
            <g id="z-columns">
              <Solid paths={leadScrewL} tone="faint" />
              <Solid paths={leadScrewR} tone="faint" />
              <Solid paths={zLeftColumn} tone="lo" />
              <Solid paths={zRightColumn} tone="lo" />
              <Solid paths={zCapL} tone="faint" />
              <Solid paths={zCapR} tone="faint" />
            </g>

            {/* 4 ── X Gantry, Toolhead & Purge Wiper */}
            <g id="x-gantry">
              <Solid paths={xRail} tone="lo" />
              <Dots points={railBolts} size={0.45} tone="faint" />
              {/* Left Purge Wiper Basket */}
              <Solid paths={purgeBasket} tone="hi" className="fill-white" />
              <Dots points={purgeHoles} size={0.55} tone="faint" />
              {/* Toolhead */}
              <Solid paths={nozzleBlock} tone="faint" />
              <Solid paths={toolhead} tone="hi" lit={true} className="fill-white" />
              <Line d={toolheadGroove} tone="faint" />
              <Solid paths={toolheadHub} tone="mid" />
              {/* Gold Bambu Lab circular logo badge */}
              <circle
                cx={iso([0, -15.1, 96], P)[0]}
                cy={iso([0, -15.1, 96], P)[1]}
                r={3}
                fill="#ca8a04"
                stroke="#a16207"
                strokeWidth={0.5}
              />
            </g>

            {/* 5 ── Touchscreen Console (Foreground Right) */}
            <g id="touchscreen">
              <Solid paths={screenArm} tone="lo" />
              <Solid paths={screenBody} tone="lo" className="fill-[#18181b]" />
              <Line d={screenGroove} tone="faint" />
              {/* Glowing UI screen rectangle */}
              <rect
                x={iso([62, -70, 19], P)[0] - 8}
                y={iso([62, -70, 19], P)[1] - 4}
                width={16}
                height={9}
                rx={1}
                fill="#09090b"
                stroke="#22c55e"
                strokeWidth={0.5}
                opacity={0.8}
              />
            </g>

            {/* 6 ── Top Crossbeam */}
            <g id="top-crossbeam">
              <Solid paths={crossbeam} tone="mid" />
              <Line d={beamGroove} tone="faint" />
              {/* Monospace laser engraved brand text */}
              <text
                x={iso([-40, -10, 178], P)[0]}
                y={iso([-40, -10, 178], P)[1]}
                fill="#71717a"
                fontSize={6.5}
                fontFamily="ui-monospace, monospace"
                fontWeight="bold"
                letterSpacing="0.08em"
              >
                BAMBU LAB A1
              </text>
            </g>

            {/* Explode center alignment axis */}
            {explode > 0.05 && (
              <line
                x1={iso([0, 0, 170], P)[0]}
                y1={iso([0, 0, 170], P)[1]}
                x2={iso([0, 0, amsZ + 95], P)[0]}
                y2={iso([0, 0, amsZ + 95], P)[1]}
                stroke="#eab308"
                strokeWidth={0.8}
                strokeDasharray="4 3"
                opacity={0.5}
              />
            )}

            {/* 7 ── Top Mount Clamp & Front Dial */}
            <g id="top-mount-bracket">
              {/* Underside Latch Hook */}
              <Solid paths={mountLatch} tone="hi" className="fill-white" />
              <Line d={latchGroove} tone="faint" />
              <Dots points={latchBolts} size={0.5} tone="mid" />
              {/* Upper Clamp Saddle */}
              <Solid paths={mountSaddle} tone="hi" className="fill-white" />
              <Line d={saddleGroove} tone="faint" />
              {/* Riser Column */}
              <Solid paths={mountRiser} tone="hi" className="fill-white" />
              {/* Front Tightening Dial */}
              <Solid paths={clampKnob} tone="hi" lit={explode > 0.05} />
              <Line d={knobKnurl} tone="faint" />
              <circle
                cx={iso([0, knobY, riserZ + 6.5], P)[0]}
                cy={iso([0, knobY, riserZ + 6.5], P)[1]}
                r={1.2}
                fill="#52525b"
              />
            </g>

            {/* 8 ── Overhead Crane Mast Boom */}
            <g id="crane-mast">
              <Solid paths={mastBase} tone="hi" className="fill-white" />
              <Solid paths={mastElbow} tone="hi" className="fill-white" />
              <Solid paths={mastApex} tone="hi" className="fill-white" />
              <Line d={mastClipRing} tone="hi" />
            </g>

            {/* 9 ── AMS Lite Stadium Shell & Feeder Module */}
            <g id="ams-lite-console">
              <Solid paths={amsShell} tone="mid" />
              <Line d={amsGroove} tone="faint" />
              {/* Feeder Module */}
              <Solid paths={feederBody} tone="lo" className="fill-[#27272a]" />
              <Line d={feederGroove} tone="faint" />
              {/* 4 Orange/Lit Funnels */}
              {funnelSolids.map((paths, idx) => (
                <Solid
                  key={idx}
                  paths={paths}
                  tone={funnels[idx].active ? "hi" : "mid"}
                  lit={funnels[idx].active}
                  className={funnels[idx].active ? "fill-amber-400" : "fill-orange-500"}
                />
              ))}
            </g>

            {/* 10 ── Rotary Spool Spindles / Spools / Enclosures */}
            <g id="spindles-and-spools">
              {/* Left & Right Hubs */}
              <Solid paths={hubL} tone="mid" />
              <Solid paths={hubR} tone="mid" />
              <Line d={hubArcL} tone="faint" />
              <Line d={hubArcR} tone="faint" />

              {/* Mode 1: Bare 3-Fin Grippers (Inspection Mode) */}
              {viewMode === "assembly" && (
                <>
                  {leftFins.map((fin, i) => (
                    <Solid key={`l-${i}`} paths={fin} tone="hi" className="fill-zinc-300" />
                  ))}
                  {rightFins.map((fin, i) => (
                    <Solid key={`r-${i}`} paths={fin} tone="hi" className="fill-zinc-300" />
                  ))}
                </>
              )}

              {/* Mode 2: Loaded Black Bambu Spools */}
              {viewMode === "spools" && (
                <>
                  <Solid paths={spoolL} tone="lo" className="fill-[#18181b]" />
                  <Solid paths={spoolR} tone="lo" className="fill-[#18181b]" />
                  <Line d={spoolTicksL.minor} tone="faint" />
                  <Line d={spoolTicksL.major} tone="lo" />
                  <Line d={spoolTicksR.minor} tone="faint" />
                  <Line d={spoolTicksR.major} tone="lo" />
                  {/* Spool label badges */}
                  <text
                    x={iso([hubLeftX, hubY, hubZ + 18], P)[0] - 12}
                    y={iso([hubLeftX, hubY, hubZ + 18], P)[1]}
                    fill="#a1a1aa"
                    fontSize={5.5}
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                  >
                    BAMBU PETG
                  </text>
                  <text
                    x={iso([hubRightX, hubY, hubZ + 18], P)[0] - 10}
                    y={iso([hubRightX, hubY, hubZ + 18], P)[1]}
                    fill="#a1a1aa"
                    fontSize={5.5}
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                  >
                    BAMBU PLA
                  </text>
                </>
              )}

              {/* Mode 3: Dry Box Enclosure Capsules */}
              {viewMode === "enclosure" && (
                <>
                  <Solid paths={encBridge} tone="mid" />
                  <Solid paths={hygroL} tone="lo" />
                  <Solid paths={hygroR} tone="lo" />
                  {/* Translucent domes */}
                  <ellipse
                    cx={iso([hubLeftX, hubY, encZ + 16], P)[0]}
                    cy={iso([hubLeftX, hubY, encZ + 16], P)[1]}
                    rx={38 * P.scale * 0.9}
                    ry={22 * P.scale * 0.9}
                    fill={`url(#enc-glass-${uniqueId})`}
                    stroke="rgba(56,189,248,0.4)"
                    strokeWidth={0.7}
                  />
                  <ellipse
                    cx={iso([hubRightX, hubY, encZ + 16], P)[0]}
                    cy={iso([hubRightX, hubY, encZ + 16], P)[1]}
                    rx={38 * P.scale * 0.9}
                    ry={22 * P.scale * 0.9}
                    fill={`url(#enc-glass-${uniqueId})`}
                    stroke="rgba(56,189,248,0.4)"
                    strokeWidth={0.7}
                  />
                  {/* Digital LCD readout on bridge */}
                  <text
                    x={iso([0, -6, encZ + 30], P)[0]}
                    y={iso([0, -6, encZ + 30], P)[1]}
                    textAnchor="middle"
                    fill="#22c55e"
                    fontSize={4.5}
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                  >
                    14% RH
                  </text>
                </>
              )}
            </g>

            {/* 11 ── 4 Arched PTFE Bowden Tubes */}
            <g id="ptfe-tubes">
              {tubePaths.map((d, idx) => {
                const isSelected = activeChannel === idx + 1;
                return (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke={isSelected ? currentCh.color : "#71717a"}
                    strokeWidth={isSelected ? 2.6 : 1.2}
                    strokeLinecap="round"
                    strokeDasharray={isSelected ? "none" : "3 2"}
                    opacity={isSelected ? 1 : 0.45}
                    filter={isSelected ? `url(#tube-glow-${uniqueId})` : undefined}
                  />
                );
              })}
            </g>

            {/* 12 ── Precision Callout Annotations */}
            <g
              className="pointer-events-none font-mono text-[9px] font-bold"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {/* Tightening Dial Callout */}
              <path
                d={`M ${calKnob[0]} ${calKnob[1]} l 22 -10 l 46 0`}
                fill="none"
                stroke="#facc15"
                strokeWidth={0.8}
              />
              <text x={calKnob[0] + 72} y={calKnob[1] - 8} fill="#facc15">
                CLAMP TIGHTENING DIAL
              </text>

              {/* Beam Clamp Saddle Callout */}
              <path
                d={`M ${calClamp[0]} ${calClamp[1]} l 20 8 l 48 0`}
                fill="none"
                stroke="#e4e4e7"
                strokeWidth={0.8}
              />
              <text x={calClamp[0] + 72} y={calClamp[1] + 11} fill="#e4e4e7">
                CROSSBEAM SADDLE
              </text>

              {/* Overhead Crane Mast Callout */}
              <path
                d={`M ${calMast[0]} ${calMast[1]} l -20 -10 l -54 0`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth={0.8}
              />
              <text x={calMast[0] - 128} y={calMast[1] - 8} fill="#38bdf8">
                PTFE CRANE MAST
              </text>

              {/* Lower Stiffener Callout */}
              <path
                d={`M ${calBrace[0]} ${calBrace[1]} l -22 6 l -54 0`}
                fill="none"
                stroke="#a1a1aa"
                strokeWidth={0.8}
              />
              <text x={calBrace[0] - 134} y={calBrace[1] + 9} fill="#d4d4d8">
                TRIANGULAR TRUSS STIFFENER
              </text>
            </g>
          </svg>

          {/* Interactive Controls Bar */}
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
            {/* Control 1: View Mode Toggle */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">VIEW MODE</span>
                <span className="text-yellow-400 font-semibold capitalize">{viewMode}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setViewMode("assembly")}
                  className={`rounded py-1.5 text-xs font-mono font-bold transition-all border ${
                    viewMode === "assembly"
                      ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-sm"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  Inspection
                </button>
                <button
                  onClick={() => setViewMode("spools")}
                  className={`rounded py-1.5 text-xs font-mono font-bold transition-all border ${
                    viewMode === "spools"
                      ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-sm"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  Loaded
                </button>
                <button
                  onClick={() => setViewMode("enclosure")}
                  className={`rounded py-1.5 text-xs font-mono font-bold transition-all border ${
                    viewMode === "enclosure"
                      ? "border-sky-400 bg-sky-400/20 text-sky-300 shadow-sm"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  Dry Box
                </button>
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {viewMode === "assembly" && "Bare 3-fin spring hubs & clamp mechanism"}
                {viewMode === "spools" && "Bambu Lab reusable spools mounted"}
                {viewMode === "enclosure" && "Type 01 sealed desiccant capsules"}
              </div>
            </div>

            {/* Control 2: Explode View Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">EXPLODE ASSEMBLY</span>
                <span className="text-yellow-400 font-semibold">{Math.round(explode * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explode}
                onChange={(e) => setExplode(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-yellow-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>0% (Clamped & Locked)</span>
                <span>100% (Full Isolation)</span>
              </div>
            </div>

            {/* Control 3: Active Filament Channel */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">ACTIVE FEED TUBE</span>
                <span className="text-yellow-400 font-semibold">CH {activeChannel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id as 1 | 2 | 3 | 4)}
                    className={`rounded py-1 text-xs font-mono font-bold transition-all border ${
                      activeChannel === ch.id
                        ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 shadow-sm"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    #{ch.id}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-neutral-400 truncate">
                Routing: <span className="text-neutral-200">{currentCh.name}</span>
              </div>
            </div>
          </div>
        </div>
      </Plate>
    </div>
  );
}
