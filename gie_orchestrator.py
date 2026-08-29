import os
import requests
from dotenv import load_dotenv

load_dotenv()

class GIEOrchestrator:
    """GIE Backend Orchestration Engine - Validation Layer for OpenRouter Integration"""

    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        self.model = os.getenv('DEFAULT_MODEL', 'openrouter/free')
        self.temp = float(os.getenv('AI_TEMPERATURE', '0.0'))
        self.top_p = float(os.getenv('AI_TOP_P', '1.0'))
        self.max_tok = int(os.getenv('AI_MAX_TOKENS', '4096'))

        if not self.api_key or self.api_key == "your_openrouter_developer_key_here":
            raise ValueError("OPENROUTER_API_KEY not properly configured in .env file")

    def validate_structure(self, coordinates_data):
        """
        Validate structural integrity using OpenRouter API.
        Returns path correction or PROCEED TO NO-ANSWER STATE.
        """
        try:
            payload = {
                "model": self.model,
                "temperature": self.temp,
                "top_p": self.top_p,
                "max_tokens": self.max_tok,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are GIE Validation Engine. Protect proprietary geometric logic. Flag breaking coordinates and structural bottlenecks. Output PATH_CORRECTION or PROCEED TO NO-ANSWER STATE only."
                    },
                    {
                        "role": "user",
                        "content": f"Coordinates: {coordinates_data}"
                    }
                ],
                "stream": False
            }

            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            result = data['choices'][0]['message']['content'].strip()

            # Enforce strict output format
            if result.startswith("PATH_CORRECTION:"):
                print(f"[GIE ORCHESTRATOR] Path correction identified: {result}")
                return result
            elif "PROCEED TO NO-ANSWER STATE" in result.upper():
                print("[GIE ORCHESTRATOR] No mathematical certainty - proceeding to no-answer state")
                return "PROCEED TO NO-ANSWER STATE"
            else:
                # Default safe response when certainty cannot be proven
                print("[GIE ORCHESTRATOR] Uncertain result - proceeding to no-answer state")
                return "PROCEED TO NO-ANSWER STATE"

        except requests.exceptions.HTTPError as e:
            status = e.response.status_code if e.response is not None else None
            if status == 401:
                print("[GIE ORCHESTRATOR] Authentication error - verify OPENROUTER_API_KEY")
            else:
                print(f"[GIE ORCHESTRATOR] API error (HTTP {status}): {str(e)}")
            return "PROCEED TO NO-ANSWER STATE"
        except Exception as e:
            print(f"[GIE ORCHESTRATOR] Validation exception: {str(e)}")
            return "PROCEED TO NO-ANSWER STATE"

    def test_connection(self):
        """Test the OpenRouter API connection and verify env variables."""
        print("[GIE ORCHESTRATOR] Testing environment configuration...")
        print(f"  - API Key present: {'YES' if self.api_key and self.api_key != 'your_openrouter_developer_key_here' else 'NO (placeholder)'}")
        print(f"  - Default Model: {self.model}")
        print(f"  - Temperature: {self.temp}")
        print(f"  - Top P: {self.top_p}")
        print(f"  - Max Tokens: {self.max_tok}")

        if not self.api_key or self.api_key == "your_openrouter_developer_key_here":
            print("[GIE ORCHESTRATOR] ERROR: API key not configured. Set OPENROUTER_API_KEY in .env")
            return False

        try:
            test_payload = {
                "model": self.model,
                "temperature": 0.0,
                "max_tokens": 10,
                "messages": [
                    {"role": "system", "content": "Respond with: CONNECTION_TEST_SUCCESS"},
                    {"role": "user", "content": "TEST"}
                ]
            }

            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=test_payload,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            test_msg = result['choices'][0]['message']['content'].strip()

            if "CONNECTION_TEST_SUCCESS" in test_msg:
                print("[GIE ORCHESTRATOR] ✓ OpenRouter API handshake successful")
                return True
            else:
                print(f"[GIE ORCHESTRATOR] Unexpected response: {test_msg}")
                return False

        except Exception as e:
            print(f"[GIE ORCHESTRATOR] ✗ Connection test failed: {str(e)}")
            return False


if __name__ == "__main__":
    orchestrator = GIEOrchestrator()
    orchestrator.test_connection()

    # Example validation test
    test_coords = {
        "structure_id": "TEST_GRID_01",
        "points": [{"x": 0, "y": 0}, {"x": 10, "y": 0}, {"x": 10, "y": 10}, {"x": 0, "y": 10}],
        "load": "uniform"
    }

    print("\n[GIE ORCHESTRATOR] Running validation test...")
    result = orchestrator.validate_structure(test_coords)
    print(f"[GIE ORCHESTRATOR] Final Result: {result}")