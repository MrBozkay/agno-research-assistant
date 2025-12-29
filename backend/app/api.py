from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ResearchRequest, ResearchResponse
from .agents import tech_team

app = FastAPI(title="Agno Tech Researcher API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/research", response_model=ResearchResponse)
async def perform_research(request: ResearchRequest):
    try:
        # Run agent and get response content
        response = tech_team.run(request.query)
        # Handle different response types (Agno run returns a RunResponse object)
        if hasattr(response, 'content'):
            return ResearchResponse(result=response.content)
        return ResearchResponse(result=str(response))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
