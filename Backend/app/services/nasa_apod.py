import os
from datetime import date
import httpx

class NasaAPIError(Exception):
    pass

async def fetch_apod_data(apod_date: date) -> dict:
    api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
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
            raise NasaAPIError(f"Error de la NASA API: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            raise NasaAPIError(f"Error al conectar con la NASA API: {str(e)}")
