import os
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.arxiv import ArxivTools
from agno.tools.duckduckgo import DuckDuckGoTools
from dotenv import load_dotenv

# Env variables load
load_dotenv()

# Verify API key
if not os.getenv("GOOGLE_API_KEY"):
    print("WARNING: GOOGLE_API_KEY not found in environment. Please set it.")

# 1. Research Agent for Arxiv papers
research_agent = Agent(
    name="Research Agent",
    role="AI/ML Researcher",
    description="You find the latest research papers on arXiv and technical blogs.",
    model=Gemini(id="gemini-1.5-flash"),
    tools=[ArxivTools()],
    instructions=[
        "Search for recent papers on arXiv related to the topic.",
        "Include paper titles, authors, summaries, and links.",
        "Focus on the most impactful papers from the last 12-24 months."
    ],
    show_tool_calls=True
)

# 2. GitHub & HuggingFace Agent
code_model_agent = Agent(
    name="GitHub/HF Agent",
    role="Open Source Explorer",
    description="You find relevant repositories on GitHub and models on HuggingFace.",
    model=Gemini(id="gemini-1.5-flash"),
    tools=[DuckDuckGoTools()],
    instructions=[
        "Search for relevant GitHub repositories and HuggingFace models/spaces.",
        "Always use site:github.com and site:huggingface.co in your search queries to find official or popular resources.",
        "Provide direct links and a brief summary of why each repository or model is relevant.",
        "Look for repositories with high star counts or recent activity."
    ],
    show_tool_calls=True
)

# 3. Multi-Agent Tech Analyst Team
tech_team = Agent(
    name="Tech Analyst Team",
    team=[research_agent, code_model_agent],
    model=Gemini(id="gemini-1.5-flash"),
    instructions=[
        "Combine the information from the Research Agent and the GitHub/HF Agent.",
        "Provide a comprehensive technical report on the requested topic.",
        "Format the output using Markdown with the following sections:",
        "## 📑 Research Papers",
        "## 💻 Open Source Repositories (GitHub)",
        "## 🤗 Models and Spaces (HuggingFace)",
        "## 💡 Summary & Conclusion",
        "Ensure all links are interactive and correct."
    ],
    show_tool_calls=True,
    markdown=True
)

if __name__ == "__main__":
    # Example Query
    query = "Latest advancements in Visual Language Models (VLM) and their efficient fine-tuning methods"
    print(f"\n--- Researching: {query} ---\n")
    tech_team.print_response(query, stream=True)
