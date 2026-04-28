from datetime import date
import httpx
from app.core import config
import logging

logger = logging.getLogger(__name__)


class NasaAPIError(Exception):
    pass


async def fetch_apod_data(apod_date: date) -> dict:
    api_key = config.NASA_API_KEY
    if not api_key:
        raise NasaAPIError("NASA API key not configured on the server. Set NASA_API_KEY in environment.")

    url = "https://api.nasa.gov/planetary/apod"
    params = {
        "api_key": api_key,
        "date": apod_date.isoformat(),
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if "url" not in data or "title" not in data or "explanation" not in data or "media_type" not in data:
                raise NasaAPIError("Respuesta incompleta de la API de la NASA.")
            return data
        except httpx.HTTPStatusError as e:
            logger.error("NASA APOD HTTP error %s: %s", e.response.status_code, e.response.text)
            raise NasaAPIError(f"Error de la NASA API: {e.response.status_code}")
        except Exception as e:
            logger.exception("Error al conectar con la NASA API: %s", e)
            raise NasaAPIError("Error al conectar con la NASA API")
