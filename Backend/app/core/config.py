import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

NASA_API_KEY = os.getenv("NASA_API_KEY")

def is_using_demo_key():
    return not NASA_API_KEY or NASA_API_KEY == "DEMO_KEY"
