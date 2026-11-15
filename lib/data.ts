export const portfolioData = {
    hero: {
      name: "Kanak Dahake Jr",
      role: "AI Tech Lead",
      tagline: "Turning complex problems into intelligent systems - from enterprise GenAI and cybersecurity to smart home automation.",
      bio: "Master's in Cybersecurity from Georgia Tech, 2 US patents, and a relentless urge to automate everything. Currently at Amdocs engineering Telco AI.",
      location: "Pune, India",
      email: "ksdusa4@gmail.com",
      links: {
        github: "https://github.com/kanakjr",
        linkedin: "https://www.linkedin.com/in/kanak-dahake/",
        medium: "https://medium.com/@kanakjr"
      }
    },
    experience: [
      {
        company: "Amdocs (Amaiz AI)",
        role: "AI Tech Lead",
        period: "June 2024 – Present",
        description: "Built a configurable Multimodal RAG pipeline, human-in-loop command generation with pydantic models for API integration, and context entity management. Developed AI agents for personalized telco billing support and product recommendations."
      },
      {
        company: "PwC U.S. Advisory",
        role: "Senior Associate - Innovation Hub",
        period: "Dec 2020 – June 2024",
        description: "Spearheaded production GenAI enterprise apps (RAG-based search, data insights agents, content creation) on Azure and led InsightsGen, a GenAI accelerator driving multiple client wins. Filed 2 US patents. Built Graph-based anomaly detection for Azure IAM, Federated ML on blockchain, and an NLU pipeline for clinical trial document extraction."
      },
      {
        company: "Digitate (Ignio AI), TCS",
        role: "Technical Lead",
        period: "Jun 2017 – Nov 2020",
        description: "Trained deep learning models for Phishing URL and DGA detection (patented), reducing phishing attacks by 25%. Built phishing campaign detection using Neo4J graph algorithms and ML services via Flask APIs. Developed just-in-time IAM access systems, cloud security controls, and oversaw SAAS security architecture."
      }
    ],
    education: [
      {
        school: "Georgia Institute of Technology",
        degree: "MS in Cyber Security",
        year: "2021 - 2022",
        gpa: "4.0/4.0"
      },
      {
        school: "Prof. Ram Meghe Institute",
        degree: "BE Electronics & Telecomm",
        year: "2013 - 2017",
        gpa: "8.42/10.0"
      }
    ],
    patents: [
      {
        id: "US-12254015-B1",
        title: "Systems and methods for relational database insight extraction and visualization",
        date: "Mar 18, 2025",
        description: "A system for processing relational database data using generative AI language models to extract insights and generate visualizations from user queries.",
        link: "/patent/US-12254015-B1.pdf",
        googlePatents: "https://patents.google.com/patent/US12254015B1/en"
      },
      {
        id: "US-20250384199-A1",
        title: "Systems and methods for generating dashboards from images",
        date: "Dec 18, 2025",
        description: "A method for generating dashboards from images using machine learning techniques including object detection, OCR, and natural language processing.",
        link: "/patent/US-20250384199-A1.pdf",
        googlePatents: "https://patents.google.com/patent/US20250384199A1/en"
      }
    ],
    skillGroups: [
      {
        title: "Agentic AI",
        featured: true,
        blurb: "Agents that use tools, keep memory, and hand off to humans when it matters.",
        items: [
          "LangGraph", "LangChain", "Deep Agents", "Model Context Protocol (MCP)", "FastMCP",
          "Tool / function calling", "Multi-agent workflows", "Human-in-the-loop", "Structured output (Pydantic)",
          "LangSmith tracing & evals", "n8n automations"
        ],
        usedIn: ["HomeBotAI", "PDF Deep Agent", "Amdocs Telco AI"]
      },
      {
        title: "Models & modalities",
        items: [
          "Gemini", "GPT", "Ollama (local LLMs)", "Vision models",
          "Whisper (speech-to-text)", "ElevenLabs (voice)", "FLUX + LoRA fine-tuning"
        ]
      },
      {
        title: "RAG & memory",
        items: ["Multimodal RAG", "pgvector", "ChromaDB", "Neo4j / graph RAG", "Embeddings"]
      },
      {
        title: "Build & ship",
        items: ["Python", "TypeScript", "FastAPI", "Next.js", "Docker", "Kubernetes", "Azure", "AWS", "Home Assistant"]
      },
      {
        title: "Security",
        items: ["IAM & cloud security", "ML threat detection", "Anomaly detection", "Security+"]
      },
      {
        title: "AI-native dev",
        items: ["Claude Code", "Cursor", "Prompt & eval design"]
      }
    ],
    projects: [
      {
        title: "HomeBotAI",
        image: "/projects/homebot.jpg",
        wide: true,
        category: "IoT / AI Agent",
        description: "An intelligent smart-home assistant powered by LangChain + Gemini with 59 tools, live Home Assistant awareness, learnable skills, proactive Telegram automations, a voice assistant, and a full Next.js dashboard -- evolved from an n8n-based ambient intelligence system into a production AI agent.",
        tech: ["LangChain", "Home Assistant", "Google Gemini", "Next.js", "Telegram API"],
        blog: "/blog/homebot-ai-smart-home-assistant",
        demoVideos: [
          { label: "v2", url: "https://youtu.be/og9YRxQFgDE" },
          { label: "Voice", url: "https://youtu.be/YOOdyF5BlpM" },
          { label: "v1", url: "https://youtu.be/Fru0LM9Jgvg" }
        ]
      },
      {
        title: "OpenWrt Travel Gateway",
        category: "Networking / Self-Hosting",
        image: "/blog/openwrt-travel-gateway/architecture.jpg",
        description: "A discarded TP-Link Archer C6 turned pocket travel router: in-kernel WireGuard over IPv6 back to a Mac Mini at home (beating CGNAT), plus a 5.6 KB mobile portal for joining hotel Wi-Fi in one tap.",
        tech: ["OpenWrt", "WireGuard", "IPv6", "Shell CGI"],
        github: "https://github.com/Kanakjr/openwrt-travel-gateway",
        blog: "/blog/openwrt-travel-gateway"
      },
      {
        title: "LogPose",
        category: "AI / Habit tracking",
        image: "/projects/logpose.jpg",
        imagePosition: "top",
        wide: true,
        description: "A One Piece-themed habit tracker PWA where real-world actions raise your Bounty and train your Haki. A Gemini vision \"Marine Verifier\" checks photo evidence and returns a structured verdict before a voyage counts.",
        tech: ["Gemini Vision", "FastAPI", "PWA", "Docker"],
        github: "https://github.com/Kanakjr/LogPose"
      },
      {
        title: "AI File Organiser",
        category: "AI / Desktop",
        image: "/projects/ai-file-organiser.jpg",
        imagePosition: "top",
        description: "A desktop app that asks an LLM to plan how a messy folder should be renamed and sorted, shows the plan for review, and only moves files after you approve. Works with local models (Ollama, LM Studio) or Gemini via LiteLLM.",
        tech: ["LiteLLM", "Gemini", "Ollama", "Python"],
        github: "https://github.com/Kanakjr/AI-File-Organiser"
      },
      {
        title: "InstaGenie - AI Image Bot",
        image: "/projects/instagenie.jpg",
        imagePosition: "right",
        category: "AI / Automation",
        description: "A Telegram bot that generates personalized AI images from text, voice, and photo inputs using Flux with custom LoRA adaptation, orchestrated entirely through n8n visual workflows.",
        tech: ["n8n", "Flux LoRA", "Replicate", "Supabase", "OpenAI"],
        blog: "/blog/instagenie-ai-image-bot-with-n8n"
      },
      {
        title: "Home Lab & Maker Workshop",
        image: "/projects/homelab.jpg",
        wide: true,
        category: "Hardware / Self-Hosting",
        description: "A Mac Mini-powered home server running 15+ containerized services (Plex, Ollama, Coolify) alongside a Bambu A1 3D printer integrated into Home Assistant for smart monitoring and custom prints.",
        tech: ["Docker", "Mac Mini", "3D Printing", "Home Assistant", "Coolify"],
        blog: "/blog/goodbye-raspberry-pi-hello-mac-mini"
      }
    ],
    recognition: [
      { icon: "trophy", title: "Innovator Award", org: "PwC", year: "2023", note: "For building the GenAI Insights app.", highlight: true,
        link: "https://www.linkedin.com/posts/kanak-dahake_innovatoraward-innovation-pwc-activity-7089837735628218370-TMf7" },
      { icon: "patent", title: "2 US patents", org: "PwC", year: "2025", note: "1 granted, 1 published: GenAI database insights and image-to-dashboard.", highlight: true, link: "#patents" },
      { icon: "grad", title: "4.0 GPA, MS Cybersecurity", org: "Georgia Institute of Technology", year: "2022", note: "Information Security track.", highlight: true, link: null },
      { icon: "download", title: "100k+ app downloads", org: "Kanak Assis", year: null, note: "Personal mobile app.", link: null },
      { icon: "star", title: "Best Engineering Student", org: "The Institution of Engineers (India)", year: null, note: "Academic and technical excellence.", link: null },
      { icon: "bulb", title: "Promising Innovator", org: "KPIT Sparkle", year: "2016", note: "National innovation challenge finalist.", link: null },
      { icon: "rocket", title: "FBStart sponsorship", org: "Facebook", year: null, note: "Backed a chatbot app.", link: null },
      { icon: "code", title: "CodeVita finalist", org: "TCS", year: null, note: "Global coding contest.", link: null },
      { icon: "shield", title: "Security+", org: "CompTIA", year: null, note: "Certification.", link: "https://www.credly.com/users/kanak-dahake.8271bc9e/badges" },
      { icon: "lock", title: "Information Assurance Professional", org: "DIAT / DRDO", year: null, note: "Certification.", link: null }
    ],
    achievements: [
      {
        title: "MS Cybersecurity - 4.0 GPA",
        organization: "Georgia Institute of Technology",
        description: "Information Security track covering applied cryptography, secure systems, network security, and binary reverse engineering",
        link: null
      },
      {
        title: "2 US Patents Filed",
        organization: "PwC",
        description: "Database Insight Extraction & Visualization, Dashboard Generation from Images",
        link: null
      },
      {
        title: "Certified Security+",
        organization: "CompTIA",
        description: "Industry-leading cybersecurity certification",
        link: "https://www.credly.com/users/kanak-dahake.8271bc9e/badges"
      },
      {
        title: "Certified Information Assurance Professional",
        organization: "DIAT/DRDO",
        description: "Advanced certification in Information Security",
        link: null
      },
      {
        title: "Innovator Award",
        organization: "PwC",
        description: "Recognized for innovative contributions in GenAI and Enterprise applications",
        link: "https://www.linkedin.com/posts/kanak-dahake_innovatoraward-innovation-pwc-activity-7089837735628218370-TMf7?utm_source=share&utm_medium=member_desktop"
      },
      {
        title: "The Best Engineering Student",
        organization: "The Institution of Engineers (India)",
        description: "Awarded for outstanding academic and technical excellence",
        link: null
      },
      {
        title: "Promising Innovator",
        organization: "KPIT",
        description: "Recognized as finalist in KPIT Sparkle 2016",
        link: null
      },
      {
        title: "100k+ App Downloads",
        organization: "Kanak Assis",
        description: "Mobile application reached over 100,000 downloads",
        link: null
      }
    ]
  };