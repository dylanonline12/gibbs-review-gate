import json
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime

DEFAULT_TARGET_EMAIL = "Dylanonline12@yahoo.com"

def send_feedback_email(rating, name, email_or_phone, message, recipient=DEFAULT_TARGET_EMAIL):
    """
    Formats and dispatches feedback email webhook to recipient via FormSubmit AJAX endpoint.
    """
    timestamp = datetime.now().strftime("%B %d, %Y - %I:%M %p")
    subject = f"Customer Feedback ({rating}/5 Stars) - Gibbs Roofing & Remodeling"
    
    endpoint = f"https://formsubmit.co/ajax/{recipient}"
    
    payload = {
        "_subject": subject,
        "_template": "table",
        "_captcha": "false",
        "Company": "Gibbs Roofing & Remodeling",
        "Rating": f"{rating} out of 5 Stars",
        "Customer Name": name if name else "Not Provided",
        "Contact Information": email_or_phone if email_or_phone else "Not Provided",
        "Feedback Message": message,
        "Submitted At": timestamp
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Referer": "https://reviews.gibbsroofing.com/",
            "Origin": "https://reviews.gibbsroofing.com"
        }
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            print(f"Webhook response status: {response.status}")
            print(f"Result: {res_json}")
            return res_json.get("success") in [True, "true"]
    except Exception as e:
        print(f"Error sending webhook: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    print("Testing feedback webhook execution script...")
    test_rating = 3
    test_name = "Dylan Tester"
    test_contact = "Dylanonline12@yahoo.com"
    test_message = "Test review gate feedback submission. Roofing job looked great, but clean up could be slightly improved."
    
    success = send_feedback_email(test_rating, test_name, test_contact, test_message)
    if success:
        print("[SUCCESS] Webhook test passed! Email dispatch request sent successfully.")
    else:
        print("[FAILED] Webhook test failed.")
