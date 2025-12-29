from pydantic import BaseModel

class ResearchRequest(BaseModel):
    query: str

class ResearchResponse(BaseModel):
    result: str
