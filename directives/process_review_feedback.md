# Directive: Process Review Feedback Webhook & Routing

## Goal
Process incoming customer review feedback for Gibbs Roofing & Remodeling, routing 5-star ratings to Google Reviews and dispatching structured email notifications for 1–4 star feedback to `Dylanonline12@yahoo.com`.

## Inputs
- **Rating**: Integer (1 to 5)
- **Customer Name**: String (optional or provided)
- **Contact Info**: Phone number or Email address
- **Feedback Message**: Text describing improvement areas (for 1–4 stars)
- **Target Webhook Email**: `Dylanonline12@yahoo.com`

## Tools & Execution Scripts
- `execution/send_feedback_webhook.py`: Python script to format and dispatch review feedback via email webhook.

## Routing Rules
1. **5 Stars**:
   - Immediate friction-free client-side redirect to Google Review link:
     `https://www.google.com/search?q=gibbs+roofing+and+remodeling#lrd=0x89e4e5d68ce37a53:0x9f9a291c8092f71d,3,,,,`
   - No form submission required.

2. **1 to 4 Stars**:
   - Client presents improvement feedback form with high visual hierarchy for private management submission.
   - Low visual hierarchy link allows customer to proceed to public Google Review if explicitly desired.
   - Submitting the form calls `execution/send_feedback_webhook.py` (or client POST to Web3Forms endpoint configured with key) to send formatted notification to `Dylanonline12@yahoo.com`.

## Expected Output
- HTTP 200 JSON confirmation with `success: true`.
- Clean HTML formatted email delivered to `Dylanonline12@yahoo.com` containing customer details, rating, timestamp, and message.
