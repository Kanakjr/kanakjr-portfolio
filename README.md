# Kanak Dahake Jr - Portfolio Website v2

A modern, neo-retro portfolio website built with Next.js 15, featuring cyberpunk aesthetics and cutting-edge animations.

## Features

- Neo-retro/Cyberpunk design with animated retro grid background
- Responsive and performant with Next.js 15 App Router
- Magic UI components for stunning visual effects
- Dark mode optimized with custom color scheme
- Smooth animations powered by Framer Motion
- Interactive 3D skill cloud
- Project showcase with spotlight effects
- Social media dock with magnification effect

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Magic UI + Custom Components
- **TypeScript**: For type safety
- **Font**: Geist Sans & Geist Mono

## Getting Started

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
kanakjr-website/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles and animations
├── components/
│   ├── magicui/           # Magic UI components
│   │   ├── retro-grid.tsx
│   │   ├── shimmer-button.tsx
│   │   ├── border-beam.tsx
│   │   ├── word-rotate.tsx
│   │   ├── bento-grid.tsx
│   │   ├── magic-card.tsx
│   │   ├── dock.tsx
│   │   └── icon-cloud.tsx
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── Career.tsx
│       ├── Skills.tsx
│       ├── Projects.tsx
│       └── Footer.tsx
└── lib/
    └── utils.ts           # Utility functions
```

## Design System

### Colors

- **Background**: `#0a0a0a` (Deep Carbon)
- **Primary Accent**: `#FFD700` (Cyber Yellow)
- **Secondary Accent**: `#FF4500` (Retro Red)
- **Grid Lines**: White with 5-10% opacity

### Typography

- **Headers**: Geist Mono (Developer feel)
- **Body**: Geist Sans (Readability)

## Key Components

### Hero Section
- Retro grid animated background
- Rotating words animation
- Avatar with border beam effect
- Shimmer CTA buttons

### Career Snapshot
- Bento grid layout
- Animated hover effects
- Custom gradient borders

### Skills Section
- Interactive 3D icon cloud
- Categorized skill tags
- Responsive grid layout

### Projects Showcase
- Magic cards with spotlight effect
- Project details on hover
- Technology tags

### Footer
- Animated dock with social links
- Magnification effect on hover
- Smooth transitions

## Customization

Replace the placeholder avatar at `public/avatar.jpg` with your own photo.

Update social media links in `components/sections/Footer.tsx`.

Modify project data in `components/sections/Projects.tsx`.

Adjust career information in `components/sections/Career.tsx`.

## License

All rights reserved © 2026 Kanak Dahake Jr
