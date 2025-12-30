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
            "Content-Type": "multipart/form-data" 
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
        
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        if response.status_code != 200:
            raise Exception(f"Failed to submit task. Status: {response.status_code}, Response: {response.text}")
            
        return response.json()

    def get_task_detail(self, task_id: str) -> Dict[str, Any]:
        """Retrieves details for a specific task."""
        url = f"{API_BASE_URL}{TASK_DETAIL_ENDPOINT}"
        headers = self._get_headers()
        
        payload = {"taskid": task_id}
        
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        if response.status_code != 200:
            raise Exception(f"Failed to get task detail. Status: {response.status_code}, Response: {response.text}")

        return response.json()

    def poll_task(self, task_id: str, interval: int = 2, timeout: int = 60) ->  Dict[str, Any]:
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

# --- Limited Agno Adapter (Placeholder) ---
# To fully integrate with Agno, we would need to implement a class inheriting from agno.models.base.Model
# and mapping the 'generate' and 'stream' methods to this client's submit/poll logic using Wiro.
# Since Wiro is async/polling based, streaming might be simulated or non-existent in this first version.
