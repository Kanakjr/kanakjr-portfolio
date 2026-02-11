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
        linkedin: "https://linkedin.com/in/kanakjr",
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
    blogPosts: [
      {
        slug: "building-ai-agents-with-langchain",
        title: "Building Production-Ready AI Agents with LangChain and LangGraph",
        date: "2026-01-28",
        readTime: "8 min read",
        category: "GenAI",
        excerpt: "A deep dive into building reliable, production-grade AI agents using LangChain and LangGraph. From tool calling to human-in-the-loop workflows, here is what I have learned shipping agents at scale.",
        coverImage: null,
        content: [
          {
            type: "paragraph",
            text: "Over the past two years, I have been building AI agents across multiple domains -- from telco billing assistants at Amdocs to enterprise data insight tools at PwC. Along the way, I have learned that the gap between a demo agent and a production agent is enormous. In this post, I want to share the patterns and pitfalls I have encountered."
          },
          {
            type: "heading",
            text: "Why Agents, Not Just Chains?"
          },
          {
            type: "paragraph",
            text: "LangChain chains are great for linear workflows: take input, process it through a series of steps, return output. But real-world problems rarely follow a straight line. Users ask ambiguous questions, APIs fail, and context shifts mid-conversation. Agents solve this by introducing a reasoning loop -- the LLM decides which tool to call, interprets the result, and determines the next step."
          },
          {
            type: "heading",
            text: "The LangGraph Advantage"
          },
          {
            type: "paragraph",
            text: "LangGraph takes this further by modeling agent workflows as directed graphs. Each node is a function (an LLM call, a tool invocation, a human approval step), and edges define the control flow. This gives you explicit state management, conditional branching, and the ability to add human-in-the-loop checkpoints -- all critical for production systems."
          },
          {
            type: "code",
            language: "python",
            text: "from langgraph.graph import StateGraph, END\nfrom langchain_core.messages import HumanMessage\n\ndef agent_node(state):\n    messages = state[\"messages\"]\n    response = model.invoke(messages)\n    return {\"messages\": messages + [response]}\n\ndef should_continue(state):\n    last = state[\"messages\"][-1]\n    if last.tool_calls:\n        return \"tools\"\n    return END\n\ngraph = StateGraph(AgentState)\ngraph.add_node(\"agent\", agent_node)\ngraph.add_node(\"tools\", tool_node)\ngraph.add_edge(\"tools\", \"agent\")\ngraph.add_conditional_edges(\"agent\", should_continue)"
          },
          {
            type: "heading",
            text: "Lessons from Production"
          },
          {
            type: "paragraph",
            text: "First, always implement structured output with Pydantic models. Unstructured LLM outputs break downstream systems. Second, add retry logic with exponential backoff for every external API call. Third, log every decision the agent makes -- when things go wrong (and they will), you need an audit trail. Finally, set hard token and time limits. An agent stuck in a reasoning loop can burn through your API budget in minutes."
          },
          {
            type: "paragraph",
            text: "The most underrated pattern is the human-in-the-loop checkpoint. For high-stakes operations like executing database commands or sending emails, have the agent pause and present its plan to a human reviewer. LangGraph makes this straightforward with interrupt_before edges."
          },
          {
            type: "heading",
            text: "What Is Next"
          },
          {
            type: "paragraph",
            text: "I am currently exploring multi-agent architectures where specialized agents collaborate on complex tasks. Think of it as microservices for AI -- a retrieval agent, a reasoning agent, and an action agent, each with their own tools and constraints. The orchestration complexity increases, but so does the reliability and testability of each component."
          }
        ],
        tags: ["LangChain", "LangGraph", "AI Agents", "Python", "Production ML"]
      },
      {
        slug: "cybersecurity-meets-generative-ai",
        title: "When Cybersecurity Meets Generative AI: Threats, Defenses, and the Road Ahead",
        date: "2025-12-15",
        readTime: "6 min read",
        category: "Cybersecurity",
        excerpt: "Generative AI is reshaping the cybersecurity landscape on both sides of the battlefield. From AI-powered phishing to automated threat detection, here is what security professionals need to know.",
        coverImage: null,
        content: [
          {
            type: "paragraph",
            text: "As someone who holds a Master's in Cybersecurity from Georgia Tech and has spent years building both AI systems and security tools, I have a front-row seat to one of the most significant shifts in the security landscape. Generative AI is not just another tool -- it is fundamentally changing how attacks are crafted and how defenses are built."
          },
          {
            type: "heading",
            text: "The Attacker's New Toolkit"
          },
          {
            type: "paragraph",
            text: "Phishing has always been the top attack vector, and GenAI has supercharged it. During my time at Digitate, I built deep learning models for phishing URL and DGA detection that reduced attacks by 25%. But today's AI-generated phishing emails are far more sophisticated -- they mimic writing styles, reference real events, and adapt in real time. The volume of convincing attacks has increased dramatically."
          },
          {
            type: "paragraph",
            text: "Beyond phishing, we are seeing AI-generated malware that morphs its code to evade signature-based detection, deepfake audio used for vishing (voice phishing), and automated vulnerability discovery tools that can scan codebases faster than any human team."
          },
          {
            type: "heading",
            text: "Fighting Fire with Fire"
          },
          {
            type: "paragraph",
            text: "The good news is that defensive AI is evolving just as fast. At PwC, I built graph-based anomaly detection systems for Azure IAM that could identify compromised accounts by analyzing relationship patterns rather than individual events. This approach catches sophisticated attacks that rule-based systems miss entirely."
          },
          {
            type: "code",
            language: "python",
            text: "# Simplified example of graph-based anomaly detection\nimport networkx as nx\nfrom sklearn.ensemble import IsolationForest\n\ndef detect_anomalous_access(graph: nx.DiGraph):\n    features = []\n    for node in graph.nodes():\n        degree = graph.degree(node)\n        centrality = nx.betweenness_centrality(graph)[node]\n        features.append([degree, centrality])\n    \n    clf = IsolationForest(contamination=0.05)\n    predictions = clf.fit_predict(features)\n    return [n for n, p in zip(graph.nodes(), predictions) if p == -1]"
          },
          {
            type: "heading",
            text: "The LLM Security Challenge"
          },
          {
            type: "paragraph",
            text: "A new category of vulnerabilities has emerged around LLMs themselves: prompt injection, data exfiltration through crafted outputs, and training data poisoning. As organizations rush to deploy GenAI applications, many overlook these attack surfaces. Every RAG pipeline is a potential data leakage point. Every agent with tool access is a potential privilege escalation vector."
          },
          {
            type: "heading",
            text: "Practical Recommendations"
          },
          {
            type: "paragraph",
            text: "For security teams looking to navigate this landscape: invest in AI-powered SIEM and SOAR platforms that can process the volume of modern threats. Implement strict input validation and output filtering on all LLM-powered applications. Adopt a zero-trust architecture for AI agent tool access -- every action should require explicit authorization. And most importantly, red-team your AI systems regularly. The attackers certainly will."
          },
          {
            type: "paragraph",
            text: "The convergence of cybersecurity and generative AI is still in its early stages. The organizations that invest in understanding both domains -- not just one -- will be best positioned to defend against the next generation of threats."
          }
        ],
        tags: ["Cybersecurity", "GenAI", "Phishing Detection", "Graph Analytics", "Zero Trust"]
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