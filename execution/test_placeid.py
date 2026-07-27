import urllib.request
import urllib.parse
import re

cids = [
    "ChIJU3rjjNbl5IkRHfeSgBwpmp8",
    "ChIJU3rjjNbl5IkRHfeCgBypmp8",
    "ChBTeuOM1uXkiRIQHfeSgBwpmp8"
]

for pid in cids:
    url = f"https://search.google.com/local/writereview?placeid={pid}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"})
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"PID {pid} -> Status {resp.status}, Final URL: {resp.geturl()}")
    except Exception as e:
        print(f"PID {pid} -> Error: {e}")
