import os
import time
import json
import hmac
import hashlib
import requests
from typing import Optional, Dict, Any, List, Iterator

# --- API Configuration ---
API_BASE_URL = "https://api.wiro.ai/v1"
RUN_ENDPOINT = "/Run/deepseek-ai/deepseek-r1-distill-qwen-32b"
TASK_DETAIL_ENDPOINT = "/Task/Detail"
KILL_TASK_ENDPOINT = "/Task/Kill"

class WiroClient:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret

    def _generate_signature(self, nonce: str) -> str:
        """
        Generates the HMAC-SHA256 signature required by Wiro API.
        Signature = HMAC-SHA256(Secret + Nonce, Key=API_KEY)
        """
        message = f"{self.api_secret}{nonce}".encode('utf-8')
        key = self.api_key.encode('utf-8')
        signature = hmac.new(key, message, hashlib.sha256).hexdigest()
        return signature

    def _get_headers(self) -> Dict[str, str]:
        """Prepares authentication headers."""
        nonce = str(int(time.time()))
        signature = self._generate_signature(nonce)
        
        return {
            "x-api-key": self.api_key,
            "x-nonce": nonce,
            "x-signature": signature,
        }

    def submit_task(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Submits a run task to the API."""
        url = f"{API_BASE_URL}{RUN_ENDPOINT}"
        headers = self._get_headers()
        
        payload = {
            "prompt": prompt,
            "user_id": "",
            "session_id": "",
            "system_prompt": system_prompt or "You are a helpful assistant.",
            "temperature": "0.7",
            "top_p": "0.95",
            "top_k": 0,
            "repetition_penalty": "1.0",
            "length_penalty": "1",
            "max_tokens": 0,
            "min_tokens": 0,
            "max_new_tokens": 0,
            "min_new_tokens": -1,
            "stop_sequences": "",
            "seed": "123456",
            "quantization": "--quantization",
            "do_sample": "--do_sample",
            "callbackUrl": ""
        }
        
        # Send as JSON (standard API behavior)
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise Exception(f"Failed to submit task. Status: {response.status_code}, Response: {response.text}")
            
        return response.json()

    def get_task_detail(self, task_id: str) -> Dict[str, Any]:
        """Retrieves details for a specific task."""
        url = f"{API_BASE_URL}{TASK_DETAIL_ENDPOINT}"
        headers = self._get_headers()
        
        payload = {"taskid": task_id}
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise Exception(f"Failed to get task detail. Status: {response.status_code}, Response: {response.text}")

        return response.json()

    def poll_task(self, task_id: str, interval: int = 2, timeout: int = 300) ->  Dict[str, Any]:
        """Polls the task status until it completes or times out."""
        start_time = time.time()
        
        running_statuses = {
            "task_queue", "task_accept", "task_assign", 
            "task_preprocess_start", "task_preprocess_end", 
            "task_start", "task_output"
        }
        
        while time.time() - start_time < timeout:
            details = self.get_task_detail(task_id)
            
            if "tasklist" not in details or not details["tasklist"]:
                time.sleep(interval)
                continue
                
            task_info = details["tasklist"][0]
            status = task_info.get("status")
            
            if status == "task_postprocess_end":
                return task_info
            elif status == "task_cancel":
                raise Exception("Task was cancelled.")
            elif status not in running_statuses:
                return task_info
                
            time.sleep(interval)
            
        raise Exception("Polling timed out.")

from agno.models.base import Model
from agno.utils.log import logger

class WiroAgnoModel(Model):
    id: str = "deepseek-ai/deepseek-r1-distill-qwen-32b"
    name: str = "WiroDeepSeek"
    provider: str = "Wiro"
    client: Optional[WiroClient] = None

    def __init__(self, api_key: str, api_secret: str, **kwargs):
        kwargs['id'] = self.id
        super().__init__(**kwargs)
        self.client = WiroClient(api_key, api_secret)

    def response(self, messages: List[Dict[str, Any]], **kwargs) -> Any:
        # Convert messages to prompt string
        prompt = ""
        system_prompt = None
        
        for msg in messages:
            if hasattr(msg, "role"):
                role = msg.role
                content = msg.content
            else:
                role = msg.get("role")
                content = msg.get("content")
            
            if role == "system":
                system_prompt = content
            elif role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Assistant: {content}\n"
        
        prompt += "Assistant: "
        
        logger.info(f"Submitting Wiro task with prompt length: {len(prompt)}")
        
        try:
            submission = self.client.submit_task(prompt, system_prompt)
            if not submission.get("result"):
                raise Exception(f"Wiro submission failed: {submission}")
            
            task_id = submission.get("taskid")
            logger.info(f"Polling Wiro task: {task_id}")
            
            result = self.client.poll_task(task_id)
            
            # Wiro output parsing (Assumes text output)
            # The structure based on documentation example is complex.
            # Assuming the text is in outputs[0]['url'] if it's an image, or somewhere else for text.
            # DEEPSEEK is an LLM, so we expect text. 
            # If the documentation only showed image examples, we might have to guess or check 'debugoutput' or similar.
            # However, usually for LLMs, it's just in a 'text' field or similar or we return the whole structure object.
            # Let's inspect the 'outputs' list.
            
            # For now, return a Mock response object compatible with Agno
            # Agno expects an object with .content attribute usually.
            
            # Since we don't know the exact text output field from the docs provided (they were image gen examples),
            # Wiro usually puts generation in 'outputs' or a 'result' field.
            # Let's try to find text content.
            
            output_content = "Thinking..." # Placeholder
            if "outputs" in result and result["outputs"]:
                 # If it's a file (like the image example), it has a URL.
                 # If it's text, deeply inspecting...
                 # We will return the raw result as string for now to debug.
                 output_content = str(result)
            
            # Match Agno's ModelResponse structure roughly
            class MockMessage:
                def __init__(self, content):
                    self.content = content
                    self.role = "assistant"
                    self.reasoning_content = None # Required for R1 models

            class Response:
                def __init__(self, content):
                    self.content = content
                    self.message = MockMessage(content)
                    self.reasoning_content = None
            
            return Response(output_content)

        except Exception as e:
            logger.error(f"Wiro Error: {e}")
            class ErrorMessage:
                content = f"Error: {e}"
                role = "assistant"
                reasoning_content = None
            class ErrorResponse:
                content = f"Error: {e}"
                message = ErrorMessage()
                reasoning_content = None
            return ErrorResponse()
    async def ainvoke(self, *args, **kwargs) -> Any:
        # Since we don't have async Wiro client yet, just run sync
        return self.invoke(*args, **kwargs)

    async def ainvoke_stream(self, *args, **kwargs) -> Any:
        # Since we don't have async stream, mock it
        yield self.invoke(*args, **kwargs)

    def invoke(self, messages: List[Dict[str, Any]]) -> Any:
         return self.response(messages)
    
    def invoke_stream(self, messages: List[Dict[str, Any]]) -> Iterator[Any]:
        yield self.response(messages)

    # These parsing methods are for internal Agno structured output logic.
    # We can mock them or implement basic json parsing if needed.
    # For this research agent, simple content return is key.
    
    def _parse_provider_response(self, response: Any) -> Any:
        # Our response() method already mocks an object with .content
        # But if Agno passes the raw provider response here, we handle it.
        # Since we control response(), we can just return it.
        return response

    def _parse_provider_response_delta(self, response_delta: Any) -> Any:
        return response_delta
