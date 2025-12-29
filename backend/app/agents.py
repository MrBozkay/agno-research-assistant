import os
from agno.agent import Agent
from agno.team import Team
from agno.models.openai import OpenAIChat
from agno.tools.arxiv import ArxivTools
from agno.tools.duckduckgo import DuckDuckGoTools
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

if not os.getenv("OPENROUTER_API_KEY"):
    raise ValueError("OPENROUTER_API_KEY environment variable is not set!")

# OpenRouter Configuration
openrouter_model = OpenAIChat(
    id="google/gemini-2.0-flash-001",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

# Agent Definitions
research_agent = Agent(
    name="Research Agent",
    role="AI/ML Researcher",
    model=openrouter_model,
    tools=[ArxivTools()],
    instructions=[
        "Search for recent papers on arXiv related to the topic.",
        "Include paper titles, authors, summaries, and links.",
    ],
)

code_model_agent = Agent(
    name="GitHub/HF Agent",
    role="Open Source Explorer",
    model=openrouter_model,
    tools=[DuckDuckGoTools()],
    instructions=[
        "Search for relevant GitHub repositories and HuggingFace models/spaces.",
        "Include site:github.com and site:huggingface.co in your search.",
        "Provide direct links and summaries."
    ],
)

tech_team = Team(
    name="Tech Analyst Team",
    members=[research_agent, code_model_agent],
    model=openrouter_model,
    instructions=[
        "Combine the information from the Research Agent and the GitHub/HF Agent.",
        "Provide a comprehensive technical report in Markdown.",
        "Sections: ## 📑 Research Papers, ## 💻 Repositories (GitHub), ## 🤗 Models (HuggingFace), ## 💡 Summary."
    ],
    markdown=True
)
