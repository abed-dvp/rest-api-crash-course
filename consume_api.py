"""Consume the public Stack Exchange API."""

import requests

URL = "https://api.stackexchange.com/2.3/questions"

params = {
    "order": "desc",
    "sort": "activity",
    "site": "stackoverflow",
}

response = requests.get(URL, params=params, timeout=10)
response.raise_for_status()

data = response.json()

for question in data.get("items", [])[:5]:
    print(question["title"])
