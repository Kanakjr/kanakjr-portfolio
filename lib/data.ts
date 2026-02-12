export const portfolioData = {
    hero: {
      name: "Kanak Dahake Jr",
      role: "Software Development Specialist - GenAI",
      tagline: "Crafting innovative solutions at the intersection of technology and design. Specialized in cybersecurity, full-stack development, and cutting-edge AI applications.",
      bio: "I build AI Agents, secure systems, and physical machines. Master's in Cybersecurity from Georgia Tech. Currently engineering the future of Telco AI at Amdocs.",
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
        role: "Senior Associate / Associate - Innovation Hub",
        period: "Dec 2020 – June 2024",
        description: "Spearheaded production GenAI enterprise apps (RAG-based search, data insights agents, content creation) on Azure and led InsightsGen, a GenAI accelerator driving multiple client wins. Filed 2 US patents. Built Graph-based anomaly detection for Azure IAM, Federated ML on blockchain, and an NLU pipeline for clinical trial document extraction."
      },
      {
        company: "Digitate (Ignio AI), TCS",
        role: "Technical Lead / Product Developer",
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
        link: "https://resume.kanakjr.in/kanak-dahake_patent-us-12254015-b1.pdf"
      },
      {
        id: "US-20250384199-A1",
        title: "Systems and methods for generating dashboards from images",
        date: "Dec 18, 2025",
        description: "A method for generating dashboards from images using machine learning techniques including object detection, OCR, and natural language processing.",
        link: "https://ppubs.uspto.gov/api/pdf/downloadPdf/20250384199?requestToken=eyJzdWIiOiJiYmQwMWE0Yy05YmJmLTRmM2MtODA3ZS01M2U2NDJiMmFkNTQiLCJ2ZXIiOiIwMDU1OTU2ZS1iYzA3LTQzYjctYWNiZS01OTBiOGEyNTU3MDIiLCJleHAiOjB9"
      }
    ],
    skills: {
      core: [
        "Python", "JavaScript",
        "Azure", "AWS",
        "Docker", "Git", "Kubernetes",
      ],
      ai: [
        "GenAI & NLP", "Machine & Deep Learning",
        "Langchain & Langgraph (Chains & Agents)",
        "RAG", "Transformer (GPT, LLaMA)",
        "FLUX, SDXL, LORA FineTuning",
        "OpenCV", "YOLOv5"
      ],
      stack: [
        "Streamlit","VectorDB (Chroma, ACS, MongoDB)",
        "Neo4j", "Blockchain"
      ]
    },
    projects: [
      {
        title: "NewsGenius - GenAI based News Article Generation",
        category: "GenAI",
        description: "A GenAI-driven app designed for news media publishers, streamlining content creation and assisting tasks like social media posting, summarization, and bullet point creation.",
        tech: ["Python", "GenAI", "React", "LangChain"],
        demoVideo: "https://youtu.be/fmH5PAESSxo",
        icon: "📰"
      },
      {
        title: "SalesCompanionAgent",
        category: "AI Agent",
        description: "A chat app for sales assistants, empowering them with AI-powered features like sales plan generation, progress tracking, meeting scheduling, and email drafting.",
        tech: ["LangChain", "Python", "ChromaDB", "SQLite", "Chainlit"],
        github: "https://github.com/Kanakjr/SalesCompanionAgent",
        icon: "💼"
      },
      {
        title: "BillBot",
        category: "AI Agent",
        description: "An AI bot that simplifies the management and extraction of information from bills and receipts, and provides users simple Q&A access to the data.",
        tech: ["Python", "LangChain", "OCR", "LLMs"],
        github: "https://github.com/Kanakjr/BillBot",
        icon: "🧾"
      },
      {
        title: "CryptoVulnerability - Responsible Vulnerability Reporting",
        category: "Blockchain",
        description: "Developed a privacy-focused vulnerability reporting system on blockchain using Hyperledger Fabric for responsible disclosure.",
        tech: ["Hyperledger Fabric", "Blockchain", "Node.js", "Go"],
        demoVideo: "https://youtu.be/TLWH58xnZPQ?t=403",
        github: "https://github.com/Kanakjr/VulnReporting",
        icon: "⛓️"
      },
      {
        title: "KanoServer",
        category: "Hardware",
        description: "Raspberry Pi home server with NAS, WiFi sniffing, and 10hr battery.",
        tech: ["Raspberry Pi", "Linux", "Python"],
        icon: "🖥️"
      }
    ],
    achievements: [
      {
        title: "Innovator Award",
        organization: "PwC",
        description: "Recognized for innovative contributions in GenAI and Enterprise applications",
        link: "https://www.linkedin.com/posts/kanak-dahake_innovatoraward-innovation-pwc-activity-7089837735628218370-TMf7?utm_source=share&utm_medium=member_desktop"
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
      },
      {
        title: "MS Cybersecurity - 4.0 GPA",
        organization: "Georgia Institute of Technology",
        description: "Perfect GPA in graduate cybersecurity program",
        link: null
      }
    ]
  };