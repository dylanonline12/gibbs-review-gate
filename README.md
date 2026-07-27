# Gibbs Roofing & Remodeling - Review Gate Landing Page

A high-converting, mobile-responsive review request landing page for **Gibbs Roofing & Remodeling**. Built with 5-star Google review auto-transfers and private internal feedback routing for 1–4 star ratings.

---

## 🌟 Key Features

1. **Clean & Simplistic Rating Opening**:
   - Initial prompt: *"How would you rate your experience?"*
   - Interactive star rating widget with hover and touch states.
   
2. **Instant 5-Star Google Transfer (Zero Friction)**:
   - Selecting 5 stars immediately redirects the customer to the [Gibbs Roofing Google Business Review Page](https://www.google.com/search?q=gibbs+roofing+and+remarketing#lrd=0x89e4e5d68ce37a53:0x9f9a291c8092f71d,3,,,,) without extra clicks or friction.

3. **Gated 1–4 Star Internal Feedback Flow**:
   - Selecting 1–4 stars opens a private management feedback form asking how Gibbs Roofing can improve.
   - **Visual Hierarchy Buttons**:
     - **Primary Emphasized Button**: *"Send Private Feedback to Gibbs Management"* (solid brand blue button with shadow and high visual priority).
     - **Secondary Unemphasized Link**: *"I would still like to leave a public review on Google"* (subtle text link to respect customer freedom without distracting from private resolution).

4. **Automated Email Webhook**:
   - Form submissions dispatch structured HTML notifications directly to `Dylanonline12@yahoo.com`.

---

## 🚀 GitHub & Vercel Deployment Guide

To deploy this landing page with a clean custom URL tied to your company domain (e.g. `reviews.gibbsroofing.com`):

### Step 1: Push to GitHub
Run the following commands in your terminal:
```bash
git init
git add .
git commit -m "Initial commit of Gibbs Roofing Review Gate landing page"
git branch -M main
git remote add origin https://github.com/dylanonline12/gibbs-review-gate.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New Project"** -> **"Import Git Repository"**.
3. Select your `gibbs-review-gate` repository from GitHub.
4. Keep framework preset as **"Other / Static"** and click **Deploy**.

### Step 3: Connect Custom Domain (Clean URL)
1. In your Vercel project dashboard, navigate to **Settings** -> **Domains**.
2. Enter your desired subdomain, e.g. `reviews.gibbsroofing.com` (or `review.gibbsroofing.com`).
3. In your domain provider DNS settings (e.g. GoDaddy, Namecheap, Cloudflare), add a **CNAME Record**:
   - **Type**: `CNAME`
   - **Name / Host**: `reviews`
   - **Value / Target**: `cname.vercel-dns.com`
4. Once DNS propagates, your review gate will be live with a clean, branded URL: `https://reviews.gibbsroofing.com`.

---

## 📩 Activating Email Notifications

The page uses FormSubmit's AJAX endpoint (`https://formsubmit.co/ajax/Dylanonline12@yahoo.com`).

1. Upon the first test submission from the live site, FormSubmit sends a one-time **"Activate Form"** email to `Dylanonline12@yahoo.com`.
2. Click the confirmation link in that email once.
3. All future customer feedback will instantly arrive formatted in `Dylanonline12@yahoo.com`'s inbox!
