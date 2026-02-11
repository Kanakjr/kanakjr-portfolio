Technical Plan: Kanakjr.in v2 (Neo-Retro Edition)

1. Project Vision

Goal: Migrate from WordPress to a high-performance Next.js application.
Aesthetic: "Neo-Retro" / Cyberpunk Lite. Dark mode default, neon accents (Yellow/Red from original design), grid lines, and terminal-inspired typography.
Core Tech: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
UI Library: Magic UI (Primary Visuals) + Shadcn/UI (Functional Layouts).

2. Design System & Assets

Color Palette:

Background: #0a0a0a (Deep Carbon) or #000000 (True Black).

Primary Accent: #FFD700 (Cyber Yellow - matches your current "Kanak" text).

Secondary Accent: #FF4500 (Retro Red - matches your current icons).

Grid Lines: White with 5-10% opacity.

Typography:

Headers: Geist Mono or Space Mono (Developer feel).

Body: Inter or Geist Sans (Readability).

3. Homepage Architecture (Component Mapping)

This section maps the specific content seen in image_c681c9.jpg to Magic UI components.

A. The Hero Section (Top Fold)

Current Content: Profile photo (circular), Name "I'm Kanak Dahake Jr", Description text, "Designer/Developer".

The Upgrade:

Background: Retro Grid (Magic UI). A scrolling, perspective grid that sets the "flight sim/retro bike" tone immediately.

Headline: Word Rotate or Typing Animation.

Animation: "I'm Kanak Dahake Jr. I am a [Developer]... [Designer]... [Maker]."

Avatar: Border Beam wrapped around your profile picture. A subtle rotating light border to draw attention.

CTA Button: Shimmer Button. "View Resume" with a metallic shine effect.

B. Career Snapshot (The Timeline)

Current Content: 4 columns: Sole Proprietor, Innovation Hub (PWC), MS Cybersecurity, Research Assistant.

The Upgrade:

Component: Bento Grid (Magic UI).

Layout: Instead of a boring row, arrange these as unequal boxes (Bento style) that fit together like a puzzle.

Interactivity: Meteor Effect (Magic UI). Subtle meteors streaking across the background of these cards to signify "speed/innovation".

C. Competency Spectrum (Skills)

Current Content: 3 Columns: Programming (C++, Java, Python), Systems, Tools.

The Upgrade:

Component: Icon Cloud (Magic UI).

Visual: A 3D interactive sphere of tag icons (Python, AWS, Next.js, Docker). The user can spin it with their mouse. It’s highly engaging and screams "Tech Wiz."

Alternative (Minimalist): Marquee. Two infinite scrolling rows of logos. One row moving left, one right.

D. Project Showcase (The Grid)

Current Content: Icons for "News Feed", "Blockchain", "IoT Server", "E-Health", "Remote Mouse", "Space Game".

The Upgrade:

Component: Magic Card (Magic UI).

Effect: The "Spotlight" effect. When the mouse hovers over the grid, a subtle spotlight follows the cursor, revealing the border and gradient of the card.

Images: Replace generic icons with high-res thumbnails or Safari component frames (Magic UI) showing a browser mockup of the project.

E. Achievements & Extra-Curricular

Current Content: Bullet points of hackathon wins and leadership roles.

The Upgrade:

Component: Particles background with simple clean typography.

Layout: Use Shadcn Accordion to save space. Titles like "Hackathons" are visible; clicking expands to show the details. Keeps the UI clean.

F. Footer & Socials

Component: Dock (Magic UI).

Visual: A macOS-style floating dock at the bottom of the screen containing your social links (GitHub, LinkedIn, YouTube). It magnifies slightly on hover.

4. Technical Stack: The "Flash" AI Integration

This architecture ignores the JSON file for now and focuses on the live API connection.

The Brain (LangChain.js + Gemini Flash)

Model: gemini-1.5-flash (Optimized for sub-second latency).

Framework: LangChain.js for structured output and memory.

Implementation:

System Prompt: Hardcode your core bio into the system_instruction.

Streaming: Use Vercel AI SDK useChat hook to stream text character-by-character (looks like a hacker terminal).

File Structure (Next.js 15 App Router)

/kanakjr-web
├── app
│   ├── layout.tsx         # Wraps app in Dark Mode provider
│   ├── page.tsx           # Home: Hero + Bento Grid + Icon Cloud
│   ├── blog/              # MDX Blog
│   │   ├── page.tsx       # List of posts
│   │   └── [slug]/        # Individual post page
│   └── api
│       └── chat/          # Edge Runtime API for Gemini
├── components
│   ├── magicui/           # (RetroGrid, ShimmerButton, etc.)
│   ├── ui/                # (Shadcn Card, Button, Input)
│   ├── sections/          # Major page sections
│   │   ├── Hero.tsx
│   │   ├── SkillsOrbit.tsx
│   │   └── ProjectsBento.tsx
│   └── ChatBot.tsx        # Floating AI Widget
├── content                # Markdown files
│   └── blog/              # "AI Art", "SQL Injection" posts
└── lib
    └── utils.ts           # Tailwind helper


5. Implementation Checklist

Setup: npx create-next-app@latest + Tailwind + TypeScript.

Magic UI Install: npm install framer-motion and add Retro Grid, Bento Grid, Dock.

Migration:

Convert "Career Snapshot" text -> Bento Grid items.

Convert "Project" icons -> Magic Cards.

AI Integration:

Get GOOGLE_API_KEY.

Setup app/api/chat/route.ts with LangChain + Gemini Flash.

Deployment: Vercel (Zero config).

6. Why This Fits "Neo-Retro"

Grid Background: Nods to 80s synth-wave/cyberpunk.

Monospace Font: Nods to terminal/coding roots.

Fast Animations: The site feels "alive" (like a bike engine or flight sim dashboard) rather than a static brochure.