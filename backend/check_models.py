from google import genai

from app.config import GEMINI_API_KEY


client = genai.Client(
    api_key=GEMINI_API_KEY
)

print("Available Gemini models:")

for model in client.models.list():
    print(model.name)