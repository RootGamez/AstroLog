import httpx
from typing import List, Dict, Any
from datetime import date
import logging

from app.core import config

logger = logging.getLogger(__name__)


class NasaServiceError(Exception):
    pass


class MarsService:
    BASE = "https://api.nasa.gov/mars-photos/api/v1/rovers"

    def __init__(self, api_key: str | None = None):
        # Prefer explicit api_key, otherwise use server env config
        self.api_key = api_key or config.NASA_API_KEY
        if config.is_using_demo_key():
            logger.warning("NASA API key not set or using DEMO_KEY — requests may be rate-limited or fail.")

    async def search_photos(self, rover: str, earth_date: date = None, sol: int = None) -> Dict[str, Any]:
        if not self.api_key:
            raise NasaServiceError("NASA API key not configured on the server. Set NASA_API_KEY in environment.")

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
                # expose useful information for debugging while keeping key secret
                status = e.response.status_code
                text = e.response.text
                logger.error("NASA API HTTP error %s: %s", status, text)
                raise NasaServiceError(f"NASA API error: {status}")
            except Exception as e:
                logger.exception("Error contacting NASA API: %s", e)
                raise NasaServiceError("Error contacting NASA API")
