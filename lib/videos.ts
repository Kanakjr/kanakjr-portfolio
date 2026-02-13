export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  youtubeId: string;
  tags: string[];
  featured?: boolean;
}

/**
 * Returns the YouTube embed URL for a given video ID.
 */
export function getEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
}

/**
 * Returns the high-quality YouTube thumbnail URL for a given video ID.
 */
export function getThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * Returns the maxres YouTube thumbnail URL.
 */
export function getMaxResThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export const videosData: Video[] = [
  // ── Featured ──────────────────────────────────────────────────────────
  {
    id: "xsr-konkan",
    title: "YAMAHA XSR 155: Konkan Coastal Ride",
    description:
      "A cinematic ride through the Konkan coast on the Yamaha XSR 155 -- winding ghats, coastal roads, and the neo-retro machine in its element.",
    category: "Motorcycle",
    youtubeId: "0qTGF9XbxkQ",
    tags: ["Yamaha XSR", "Konkan", "Motovlog"],
    featured: true,
  },

  // ── GenAI & LLMs ─────────────────────────────────────────────────────
  {
    id: "newsgenius",
    title: "NewsGenius - AI Powered News Generation",
    description:
      "A GenAI-driven app for news media publishers that streamlines content creation with AI-assisted article generation, social media posting, summarization, and bullet point generation.",
    category: "GenAI",
    youtubeId: "fmH5PAESSxo",
    tags: ["Python", "GenAI", "React", "LangChain"],
  },
  {
    id: "newsgenius-dalle",
    title: "NewsGenius: AI Image Generation with DALL-E 3",
    description:
      "Demo of AI-powered image generation for news content creation using OpenAI's DALL-E 3 model integrated into the NewsGenius platform.",
    category: "GenAI",
    youtubeId: "D0o0SSXRWEc",
    tags: ["DALL-E 3", "OpenAI", "Image Generation"],
  },
  {
    id: "llm-frameworks",
    title: "Demystifying LLM & Frameworks",
    description:
      "A comprehensive guide breaking down Large Language Models and the frameworks powering modern AI applications.",
    category: "GenAI",
    youtubeId: "ATjjxrY6B4g",
    tags: ["LLM", "AI Frameworks", "Tutorial"],
  },

  // ── IoT / Smart Home ─────────────────────────────────────────────────
  {
    id: "smart-home",
    title: "Building a Truly Intelligent Home",
    description:
      "The ultimate AI dashboard tour -- an ambient intelligence system combining Home Assistant, n8n, and Google Gemini for AI-generated daily digests, context-aware security alerts, and adaptive automation.",
    category: "IoT / AI",
    youtubeId: "Fru0LM9Jgvg",
    tags: ["Home Assistant", "n8n", "Google Gemini", "Telegram API"],
  },
  {
    id: "solar-media-center",
    title: "Solar Powered Home Automated Media Center",
    description:
      "A solar-powered media center running on Raspberry Pi with ambient lighting -- combining renewable energy with home automation.",
    category: "IoT / Hardware",
    youtubeId: "JX4od0RiaQQ",
    tags: ["Raspberry Pi", "Solar", "Home Automation"],
  },
  {
    id: "home-automation-tests",
    title: "Android Home Automation Tests",
    description:
      "Early prototyping and testing of Android-based home automation controls built with the Kanak Assis platform.",
    category: "IoT / Hardware",
    youtubeId: "HNvZss89-rI",
    tags: ["Android", "Home Automation", "IoT"],
  },
  {
    id: "home-automation-app",
    title: "Home Automation Mobile App",
    description:
      "Mobile app interface for controlling home automation systems -- lights, devices, and sensors from a smartphone.",
    category: "IoT / Hardware",
    youtubeId: "mHQQ_jCkaB0",
    tags: ["Mobile App", "Home Automation"],
  },
  {
    id: "lcd-module",
    title: "LCD Module Project",
    description:
      "Hardware project demonstrating an LCD display module integrated with the Kanak Assis automation system.",
    category: "IoT / Hardware",
    youtubeId: "OQce2MAHMHc",
    tags: ["LCD", "Hardware", "Electronics"],
  },
  {
    id: "wireless-remote",
    title: "Wireless Remote Control",
    description:
      "A custom wireless remote system that works across smartphones and tablets for device control.",
    category: "IoT / Hardware",
    youtubeId: "DlSmtugmWLQ",
    tags: ["Wireless", "Remote Control", "IoT"],
  },
  {
    id: "twitter-control",
    title: "Twitter-Controlled Automation",
    description:
      "Controlling hardware devices via Twitter commands -- an early experiment in social media-driven IoT automation.",
    category: "IoT / Hardware",
    youtubeId: "o5Cv7A6jisY",
    tags: ["Twitter API", "IoT", "Automation"],
  },
  {
    id: "pc-control-centre",
    title: "PC Control Centre",
    description:
      "A centralized PC control dashboard for managing connected devices and automation routines.",
    category: "IoT / Hardware",
    youtubeId: "w2QVNRmNByk",
    tags: ["Desktop App", "Control Center"],
  },

  // ── Blockchain ────────────────────────────────────────────────────────
  {
    id: "crypto-vuln",
    title: "Vulnerability Reporting on Blockchain",
    description:
      "A privacy-focused vulnerability reporting and disclosure system built on Hyperledger Fabric blockchain for responsible, transparent security disclosure.",
    category: "Blockchain",
    youtubeId: "TLWH58xnZPQ",
    tags: ["Hyperledger Fabric", "Blockchain", "Node.js", "Go"],
  },

  // ── Cybersecurity ─────────────────────────────────────────────────────
  {
    id: "wifi-jammer",
    title: "WiFi Jammer on Kali NetHunter",
    description:
      "Demonstration of a WiFi deauthentication tool running on Kali NetHunter deployed on a OnePlus X -- for security research and penetration testing.",
    category: "Cybersecurity",
    youtubeId: "grK8dzGemRs",
    tags: ["Kali Linux", "NetHunter", "WiFi Security"],
  },
  {
    id: "macos-hack",
    title: "Mac OS X Exploit via Kali NetHunter",
    description:
      "Security research demo: exploiting Mac OS X using Kali NetHunter running on a OnePlus X with Android Marshmallow.",
    category: "Cybersecurity",
    youtubeId: "egDZYqnrTzs",
    tags: ["Kali Linux", "macOS", "Pentesting"],
  },

  // ── AI Assistants (Jarvis / VERONICA) ─────────────────────────────────
  {
    id: "veronica-cv",
    title: "V.E.R.O.N.I.C.A. - Computer Vision AI",
    description:
      "An AI assistant with computer vision capabilities for image and picture processing -- inspired by Ironman's JARVIS, Mark III.",
    category: "AI Assistant",
    youtubeId: "Bc83_WzByDg",
    tags: ["Computer Vision", "AI", "Image Processing"],
  },
  {
    id: "veronica-ai",
    title: "V.E.R.O.N.I.C.A. - The New AI",
    description:
      "Introducing V.E.R.O.N.I.C.A., a personal AI assistant built as a JARVIS Mark III successor with natural language understanding.",
    category: "AI Assistant",
    youtubeId: "hJ2_DlUiDVE",
    tags: ["AI Assistant", "NLU", "JARVIS"],
  },
  {
    id: "jarvis-prototype",
    title: "Jarvis Core Prototype",
    description:
      "The core prototype of the Jarvis artificial intelligence system -- animation and interface showcase of the AI engine.",
    category: "AI Assistant",
    youtubeId: "ZrwTHgry2dY",
    tags: ["AI", "Prototype", "Animation"],
  },
  {
    id: "jarvis-web-api",
    title: "KanoFi Jarvo - AI Web API",
    description:
      "Web API interface for the Jarvo artificial intelligence platform, enabling programmatic access to AI capabilities.",
    category: "AI Assistant",
    youtubeId: "oxoUJSYC2SE",
    tags: ["Web API", "AI", "Backend"],
  },
  {
    id: "jarvis-macbook",
    title: "JARVIS on MacBook",
    description:
      "Running the Jarvis AI assistant natively on MacBook -- voice-controlled personal computing.",
    category: "AI Assistant",
    youtubeId: "MOHZPuZftLE",
    tags: ["macOS", "AI Assistant", "Voice Control"],
  },
  {
    id: "jarvis-qa",
    title: "Jarvis Intelligent Answering",
    description:
      "Demonstrating the intellectual question-answering capabilities of the Jarvis AI system.",
    category: "AI Assistant",
    youtubeId: "zZJ1rc3sfe4",
    tags: ["Q&A", "NLP", "AI"],
  },
  {
    id: "jarvis-ai",
    title: "Jarvis Artificial Intelligence",
    description:
      "Full showcase of the Jarvis AI system built as part of the Kanak Assis project -- voice interaction and task automation.",
    category: "AI Assistant",
    youtubeId: "R78zyJNmvEU",
    tags: ["AI", "Voice Control", "Automation"],
  },
  {
    id: "jarvis-voice",
    title: "Jarvis Voice Control Demo",
    description:
      "Live demonstration of voice-controlled commands and responses with the Jarvis AI assistant.",
    category: "AI Assistant",
    youtubeId: "9UT9FUalBKQ",
    tags: ["Voice Control", "AI", "Demo"],
  },
  {
    id: "jarvis-voice-assistant",
    title: "Jarvis Voice Assistant",
    description:
      "A voice-activated AI assistant capable of natural conversation, task execution, and smart home integration.",
    category: "AI Assistant",
    youtubeId: "EU8Dcs8mPA0",
    tags: ["Voice Assistant", "AI", "NLP"],
  },
  {
    id: "kanak-assis-live",
    title: "Kanak Assis - Live Demo",
    description:
      "Live demonstration of the Kanak Assis platform showcasing real-time AI assistant capabilities and device control.",
    category: "AI Assistant",
    youtubeId: "yoaU1wll-bo",
    tags: ["Live Demo", "AI Platform"],
  },

  // ── App Development ───────────────────────────────────────────────────
  {
    id: "jarvis-app",
    title: "KanoFi: Jarvis App (Multi-Platform)",
    description:
      "Cross-platform Jarvis app development for Android, iOS, and Windows -- a unified AI assistant experience.",
    category: "App Development",
    youtubeId: "lrNZe5YOm4A",
    tags: ["Android", "iOS", "Windows", "Cross-Platform"],
  },
  {
    id: "kanobook",
    title: "KanoBook - Social Networking Site",
    description:
      "A Facebook-inspired social networking platform built from scratch as a full-stack web development project.",
    category: "App Development",
    youtubeId: "GzTh6bMg2DI",
    tags: ["Social Network", "Full Stack", "Web App"],
  },
  {
    id: "kano-game",
    title: "Kano Game",
    description:
      "A custom-built game project showcasing game development skills and interactive design.",
    category: "App Development",
    youtubeId: "IB7qRjkSNGs",
    tags: ["Game Dev", "Interactive"],
  },
  {
    id: "fb-game-hack",
    title: "Facebook Game Hack (Thug Life)",
    description:
      "A playful exploration of Facebook game mechanics and browser-based game manipulation.",
    category: "App Development",
    youtubeId: "K7uc3_27Lnk",
    tags: ["Browser", "Game", "Hack"],
  },
  {
    id: "app-interface",
    title: "Kanak Assis - New App Interface",
    description:
      "Redesigned app interface for the Kanak Assis platform running in an emulator -- showcasing the updated UI/UX.",
    category: "App Development",
    youtubeId: "A4_FrxP-lps",
    tags: ["UI/UX", "Mobile App", "Emulator"],
  },
  {
    id: "smart-watch",
    title: "Kanak Assis Smart Watch",
    description:
      "Smart watch companion app for the Kanak Assis AI platform -- wearable device integration.",
    category: "App Development",
    youtubeId: "ZjZSnLWZZbI",
    tags: ["Smart Watch", "Wearable", "Companion App"],
  },
  {
    id: "smart-watch-new",
    title: "Smart Watch - New Look",
    description:
      "Updated smart watch interface with a refreshed design language and improved interactions.",
    category: "App Development",
    youtubeId: "j8m6G4OczRQ",
    tags: ["Smart Watch", "UI Design"],
  },
  {
    id: "ios-dev",
    title: "Beginning of iOS Development",
    description:
      "First steps into iOS app development -- learning Swift and building initial prototypes.",
    category: "App Development",
    youtubeId: "11W-ZxnllYo",
    tags: ["iOS", "Swift", "Learning"],
  },
  {
    id: "android-app",
    title: "Kanak Assis Android App",
    description:
      "The Kanak Assis AI assistant packaged as a native Android application with voice and device control.",
    category: "App Development",
    youtubeId: "IjYyESoIKcM",
    tags: ["Android", "Mobile App"],
  },
  {
    id: "android-app-preview",
    title: "Kanak Assis Android App Preview",
    description:
      "Early preview of the Kanak Assis Android app before launch -- sneak peek at features and design.",
    category: "App Development",
    youtubeId: "QXZXB9t5_PU",
    tags: ["Android", "Preview"],
  },
  {
    id: "app-demo",
    title: "Kanak Assis App - Starting Demo",
    description:
      "Initial demonstration of the Kanak Assis app -- the beginning of a personal AI platform journey.",
    category: "App Development",
    youtubeId: "mEr1OZAqtU4",
    tags: ["Demo", "AI Platform"],
  },

  // ── Hardware / Electronics ────────────────────────────────────────────
  {
    id: "kano-shocker",
    title: "Kano Shocker Mark 4",
    description:
      "Basic test of the Kano Shocker Mark 4 -- an electronics project exploring high-voltage circuits.",
    category: "Hardware",
    youtubeId: "8SEABzp9wFk",
    tags: ["Electronics", "Hardware", "Prototype"],
  },
  {
    id: "voice-modulator",
    title: "5$ Voice Modulator / Changer",
    description:
      "A budget voice modulator build that transforms your voice into Batman or Arrow-style effects for just 5 dollars.",
    category: "Hardware",
    youtubeId: "FIMQiv1mMnA",
    tags: ["Voice Modulator", "DIY", "Electronics"],
  },
];
