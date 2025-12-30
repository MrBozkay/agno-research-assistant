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

# Provider Configuration
provider = os.getenv("LLM_PROVIDER", "openrouter") # Default to openrouter

if provider == "wiro":
    # Wiro Integration
    from app.providers.wiro import WiroAgnoModel
    if not os.getenv("WIRO_API_KEY") or not os.getenv("WIRO_API_SECRET"):
       raise ValueError("WIRO_API_KEY and WIRO_API_SECRET must be set for 'wiro' provider.")
    
    selected_model = WiroAgnoModel(
        api_key=os.getenv("WIRO_API_KEY"),
        api_secret=os.getenv("WIRO_API_SECRET")
    )
else:
    # OpenRouter (Default)
    from app.providers.openrouter import OpenRouterProvider
    # Allows overriding model ID via env var if needed
    model_id = os.getenv("OPENROUTER_MODEL_ID", "google/gemini-2.0-flash-001")
    selected_model = OpenRouterProvider.get_model(model_id)

# Agent Definitions
research_agent = Agent(
    name="Research Agent",
    role="AI/ML Researcher",
    model=selected_model,
    tools=[ArxivTools()],
    instructions=[
        "Search for recent papers on arXiv related to the topic.",
        "Include paper titles, authors, summaries, and links.",
    ],
)

code_model_agent = Agent(
    name="GitHub/HF Agent",
    role="Open Source Explorer",
    model=selected_model,
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
    model=selected_model,
    instructions=[
        "Combine the information from the Research Agent and the GitHub/HF Agent.",
        "Provide a comprehensive technical report in Markdown.",
        "Sections: ## 📑 Research Papers, ## 💻 Repositories (GitHub), ## 🤗 Models (HuggingFace), ## 💡 Summary."
    ],
    markdown=True
)
