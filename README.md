# 🧠 Agno Research Assistant

> A next-generation AI research assistant powered by **Agno**, **FastAPI**, **Next.js**, and **Google Gemini 2.0 Flash**.

![Agno Research Assistant Banner](https://img.shields.io/badge/Status-Active-success)
![Python Version](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)

## 🚀 Overview

**Agno Research Assistant** is a full-stack application designed to conduct deep, autonomous research on any topic. It orchestrates a team of specialized AI agents to crawl the web, analyze sources, and synthesize comprehensive reports.

The project leverages the **Agno** framework to manage agent interactions and uses **Google's Gemini 2.0 Flash** model (via OpenRouter) for high-speed, cost-effective reasoning.

## ✨ Features

-   **Multi-Agent Orchestration**: A `Tech Analyst Team` coordinates a `Research Agent` (web crawler) and a `GitHub/HF Agent` (code/model researcher).
-   **Modern UI**: Sleek, responsive interface built with Next.js, Tailwind CSS, and Framer Motion.
-   **Real-time Synthesis**: Streaming responses with visible "thought processes" (simulated).
-   **Citation & Sourcing**: Automatically extracts and links to credible sources used in the research.
-   **Configurable LLM**: Easily switch models via the backend configuration (currently optimized for Gemini 2.0 Flash).

## 🛠️ Architecture

The project consists of two main components:

-   **Backend (`/backend`)**: A FastAPI server that hosts the Agno agents and exposes REST endpoints.
-   **Frontend (`/frontend`)**: A Next.js web application that provides the user interface.

```mermaid
graph LR
    A[Frontend (Next.js)] -->|"POST /api/research"| B[Backend (FastAPI)]
    B --> C{Agno Agent Team}
    C -->|Search| D[DuckDuckGo]
    C -->|Papers| E[Arxiv]
    C -->|LLM| F[Gemini 2.0 Flash (OpenRouter)]
    F --> C
    C --> B
    B --> A
```

## 📦 Installation & Setup

### Prerequisites

-   Python 3.11+
-   Node.js 18+
-   OpenRouter API Key

### 1. Clone the Repository

```bash
git clone https://github.com/MrBozkay/agno-research-assistant.git
cd agno-research-assistant
```

### 2. Backend Setup

1.  Navigate to the backend directory (root for Python scripts):
    ```bash
    # Ensure you are in the project root
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    # If requirements.txt is missing, install manually:
    pip install fastapi uvicorn agno openai duckduckgo-search arxiv python-dotenv
    ```
3.  Configure Environment Variables:
    Create a `.env` file in the root directory:
    ```env
    OPENROUTER_API_KEY=sk-or-v1-your-key-here
    ```
4.  Run the Backend Server:
    ```bash
    cd backend
    python main.py
    ```
    The server will start at `http://localhost:8000`.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Run the Development Server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🖥️ Usage

1.  Open your browser to `http://localhost:3000`.
2.  Enter a research topic in the search bar (e.g., "DeepSeek V3 Technical Architecture").
3.  Click **"Araştır"** (Search).
4.  Wait for the agents to gather information and synthesize the report.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
