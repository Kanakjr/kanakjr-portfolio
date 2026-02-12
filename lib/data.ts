export const portfolioData = {
    hero: {
      name: "Kanak Dahake Jr",
      role: "Software Development Specialist - GenAI",
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
        role: "Software Development Specialist - GenAI",
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
        link: "/patent/US-12254015-B1.pdf"
      },
      {
        id: "US-20250384199-A1",
        title: "Systems and methods for generating dashboards from images",
        date: "Dec 18, 2025",
        description: "A method for generating dashboards from images using machine learning techniques including object detection, OCR, and natural language processing.",
        link: "/patent/US-20250384199-A1.pdf"
      }
    ],
    skills: {
      core: [
        "Python", "Cybersecurity",
        "Azure", "AWS",
        "Docker", "Git", "Kubernetes",
      ],
      ai: [
        "GenAI & NLP", "ML & DL",
        "Langchain & Langgraph",
        "RAG", "Transformer (GPT, LLaMA)",
        "FLUX, SDXL, LORA FineTuning",
        "OpenCV",
      ],
      stack: [
        "Streamlit","VectorDB", "MongoDB",
        "Neo4j", "Blockchain", "FastAPI"
      ]
    },
    projects: [
      {
        title: "NewsGenius - GenAI News Generation",
        category: "GenAI",
        description: "A GenAI-driven app for news media publishers, streamlining content creation with AI-assisted social media posting, summarization, and bullet point generation.",
        tech: ["Python", "GenAI", "React", "LangChain"],
        demoVideo: "https://youtu.be/fmH5PAESSxo"
      },
      {
        title: "AI Companion Agents",
        category: "AI Agent",
        description: "Conversational AI agents built with LangChain for domain-specific tasks -- SalesCompanion for sales planning and email drafting, BillBot for receipt management and data extraction, and PDF Deep Agent for natural language PDF manipulation via MCP.",
        tech: ["Python", "LangChain", "LLMs", "FastMCP", "ChromaDB"],
        githubLinks: [
          { label: "Sales", url: "https://github.com/Kanakjr/SalesCompanionAgent" },
          { label: "Bill", url: "https://github.com/Kanakjr/BillBot" },
          { label: "PDF", url: "https://github.com/Kanakjr/pdf-deep-agent" }
        ]
      },
      {
        title: "InstaGenie - AI Image Bot",
        category: "AI / Automation",
        description: "A Telegram bot that generates personalized AI images from text, voice, and photo inputs using Flux with custom LoRA adaptation, orchestrated entirely through n8n visual workflows.",
        tech: ["n8n", "Flux LoRA", "Replicate", "Supabase", "OpenAI"],
        blog: "/blog/instagenie-ai-image-bot-with-n8n"
      },
      {
        title: "AI-Powered Smart Home",
        category: "IoT / AI",
        description: "An ambient intelligence system combining Home Assistant, n8n, and Google Gemini for AI-generated daily digests, context-aware security alerts with image captioning, and adaptive home automation.",
        tech: ["Home Assistant", "n8n", "Google Gemini", "Telegram API"],
        blog: "/blog/my-house-thinks-smart-home-ai",
        demoVideo: "https://youtu.be/Fru0LM9Jgvg"
      },
      {
        title: "Home Lab & Maker Workshop",
        category: "Hardware / Self-Hosting",
        description: "A Mac Mini-powered home server running 15+ containerized services (Plex, Ollama, Coolify) alongside a Bambu A1 3D printer integrated into Home Assistant for smart monitoring and custom prints.",
        tech: ["Docker", "Mac Mini", "3D Printing", "Home Assistant", "Coolify"],
        blog: "/blog/goodbye-raspberry-pi-hello-mac-mini"
      },
      {
        title: "CryptoVulnerability - Vulnerability Reporting",
        category: "Blockchain",
        description: "A privacy-focused vulnerability reporting system on blockchain using Hyperledger Fabric for responsible disclosure.",
        tech: ["Hyperledger Fabric", "Blockchain", "Node.js", "Go"],
        demoVideo: "https://youtu.be/TLWH58xnZPQ?t=403",
        github: "https://github.com/Kanakjr/VulnReporting"
      }
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
        link: "https://wp3.kanakjr.in/diat-certificate/"
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
        link: "https://wp3.kanakjr.in/rewarded-as-the-best-engineering-student/"
      },
      {
        title: "Promising Innovator",
        organization: "KPIT",
        description: "Recognized as finalist in KPIT Sparkle 2016",
        link: "https://wp3.kanakjr.in/sparkle-2016-finalist/"
      },
      {
        title: "100k+ App Downloads",
        organization: "Kanak Assis",
        description: "Mobile application reached over 100,000 downloads",
        link: null
      }
    ]
  };