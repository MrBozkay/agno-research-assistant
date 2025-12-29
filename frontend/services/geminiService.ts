import { ResearchResult, ResearchSource } from "../types";

/**
 * Conducts research by calling the local Agno/FastAPI backend.
 */
export const conductResearch = async (query: string, category: string): Promise<ResearchResult> => {
  try {
    // Construct the query with category context
    const fullQuery = category && category !== "General"
      ? `[${category}] ${query}`
      : query;

    const response = await fetch("http://localhost:8000/api/research", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: fullQuery }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const markdownResult = data.result || "No result returned.";

    // Simple extraction of sources from markdown links for the UI
    const sources: ResearchSource[] = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(markdownResult)) !== null) {
      sources.push({
        title: match[1],
        uri: match[2],
      });
    }

    // Deduplicate sources
    const uniqueSources = sources.reduce((acc: ResearchSource[], current) => {
      if (!acc.find(item => item.uri === current.uri)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return {
      summary: markdownResult,
      sources: uniqueSources,
    };

  } catch (error: any) {
    console.error("[Agno.Tech] Research Service Error:", error);
    throw new Error(error.message || "Research failed due to a backend error.");
  }
};
