import os
import httpx
from typing import List, Dict, Any
from datetime import date

class NasaServiceError(Exception):
    pass

class MarsService:
    BASE = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("NASA_API_KEY", "DEMO_KEY")

    async def search_photos(self, rover: str, earth_date: date = None, sol: int = None) -> Dict[str, Any]:
        params = {"api_key": self.api_key}
        url = f"{self.BASE}/{rover}/photos"
        if earth_date:
            params["earth_date"] = earth_date.isoformat()
        if sol is not None:
            params["sol"] = sol

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params, timeout=15)
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as e:
                raise NasaServiceError(f"NASA API error: {e.response.status_code} - {e.response.text}")
            except Exception as e:
                raise NasaServiceError(str(e))
