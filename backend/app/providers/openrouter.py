import os
from agno.models.openai import OpenAIChat

class OpenRouterProvider:
    @staticmethod
    def get_model(model_id: str = "google/gemini-2.0-flash-001") -> OpenAIChat:
        if not os.getenv("OPENROUTER_API_KEY"):
            raise ValueError("OPENROUTER_API_KEY environment variable is not set!")
        
        return OpenAIChat(
            id=model_id,
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
        )
