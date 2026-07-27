// Interactive Client Script for Gibbs Roofing Review Gate Landing Page
// Includes Session State Persistence on Page Refresh

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const stepRating = document.getElementById('step-rating');
  const stepRedirecting = document.getElementById('step-redirecting');
  const stepFeedback = document.getElementById('step-feedback');
  const stepThankyou = document.getElementById('step-thankyou');

  const starBtns = Array.from(document.querySelectorAll('.star-btn'));
  const userRatingDisplay = document.getElementById('user-rating-display');
  const inputRating = document.getElementById('input-rating');
  const directGoogleLink = document.getElementById('direct-google-link');
  const btnBypassGoogle = document.getElementById('btn-bypass-google');

  const feedbackForm = document.getElementById('feedback-form');
  const btnSubmitFeedback = document.getElementById('btn-submit-feedback');

  const STORAGE_KEY = 'gibbs_review_gate_state';

  // Initialize Google Review URL from CONFIG
  const googleReviewUrl = (typeof CONFIG !== 'undefined' && CONFIG.googleReviewUrl) 
    ? CONFIG.googleReviewUrl 
    : "https://www.google.com/search?q=gibbs+roofing+and+remodeling#lrd=0x89e4e5d68ce37a53:0x9f9a291c8092f71d,3,,,,";

  if (directGoogleLink) directGoogleLink.href = googleReviewUrl;
  if (btnBypassGoogle) btnBypassGoogle.href = googleReviewUrl;

  let currentRating = 0;
  let isProcessingRating = false;

  // --------------------------------------------------------------------------
  // State Persistence Helpers (Save & Restore across refresh)
  // --------------------------------------------------------------------------
  function saveState(stepName, ratingValue = 0) {
    try {
      const stateData = {
        step: stepName,
        rating: ratingValue,
        timestamp: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateData));
    } catch (e) {
      console.warn('Could not save session state:', e);
    }
  }

  function getSavedState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      // Expire session state if older than 12 hours
      if (Date.now() - data.timestamp > 12 * 60 * 60 * 1000) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function clearSavedState() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // Star Rating Interaction
  // --------------------------------------------------------------------------
  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (isProcessingRating) return;
      const rating = parseInt(btn.dataset.rating, 10);
      highlightStars(rating, 'hover-active');
    });

    btn.addEventListener('mouseleave', () => {
      clearHoverStars();
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isProcessingRating) return;

      const rating = parseInt(btn.dataset.rating, 10);
      currentRating = rating;
      handleRatingSelect(rating);
    });
  });

  function highlightStars(count, className = 'active') {
    starBtns.forEach((btn, idx) => {
      if (idx < count) {
        btn.classList.add(className);
      } else {
        btn.classList.remove(className);
      }
    });
  }

  function clearHoverStars() {
    starBtns.forEach(btn => btn.classList.remove('hover-active'));
  }

  // Branching Logic based on Star Selection
  function handleRatingSelect(rating, isRestoring = false) {
    isProcessingRating = true;
    highlightStars(rating, 'active');

    if (rating === 5) {
      // 5 STARS -> DIRECT GOOGLE TRANSFER
      saveState('redirecting', 5);
      showStep(stepRedirecting);

      if (!isRestoring) {
        setTimeout(() => {
          window.location.href = googleReviewUrl;
        }, 400);
      } else {
        isProcessingRating = false;
      }

    } else {
      // 1 to 4 STARS -> PRIVATE FEEDBACK FORM
      saveState('feedback', rating);

      if (userRatingDisplay) {
        userRatingDisplay.textContent = `${rating} ${rating === 1 ? 'Star' : 'Stars'}`;
      }
      if (inputRating) {
        inputRating.value = rating;
      }
      showStep(stepFeedback);
      isProcessingRating = false;
    }
  }

  // Helper to switch card steps smoothly
  function showStep(targetStep) {
    [stepRating, stepRedirecting, stepFeedback, stepThankyou].forEach(step => {
      if (step) {
        step.classList.remove('step-active');
        step.classList.add('step-hidden');
      }
    });
    if (targetStep) {
      targetStep.classList.remove('step-hidden');
      targetStep.classList.add('step-active');
      
      const cardRect = targetStep.getBoundingClientRect();
      const absoluteCardTop = cardRect.top + window.pageYOffset;
      window.scrollTo({ top: absoluteCardTop - 40, behavior: 'smooth' });
    }
  }

  // --------------------------------------------------------------------------
  // Restore State on Page Reload / Refresh
  // --------------------------------------------------------------------------
  const savedState = getSavedState();
  if (savedState) {
    if (savedState.step === 'thankyou') {
      showStep(stepThankyou);
    } else if (savedState.step === 'feedback' && savedState.rating > 0) {
      currentRating = savedState.rating;
      handleRatingSelect(savedState.rating, true);
    } else if (savedState.step === 'redirecting') {
      highlightStars(5, 'active');
      showStep(stepRedirecting);
    }
  }

  // Reset button link for users wanting to submit a new rating
  const resetStateLink = document.getElementById('reset-state-link');
  if (resetStateLink) {
    resetStateLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearSavedState();
      currentRating = 0;
      isProcessingRating = false;
      highlightStars(0, 'active');
      showStep(stepRating);
    });
  }

  // --------------------------------------------------------------------------
  // Form Submission Handling (Email Webhook Dispatch)
  // --------------------------------------------------------------------------
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot anti-bot validation
      const honeypotVal = document.getElementById('input-honey')?.value;
      if (honeypotVal) {
        showStep(stepThankyou);
        return;
      }

      const originalBtnText = btnSubmitFeedback.innerHTML;
      btnSubmitFeedback.disabled = true;
      btnSubmitFeedback.innerHTML = `Sending Feedback...`;

      const customerName = document.getElementById('input-name').value.trim() || 'Not Provided';
      const customerContact = document.getElementById('input-contact').value.trim() || 'Not Provided';
      const customerMessage = document.getElementById('input-message').value.trim();

      const formData = {
        _subject: `Customer Feedback (${currentRating}/5 Stars) - Gibbs Roofing & Remodeling`,
        _template: "table",
        _captcha: "false",
        Company: "Gibbs Roofing & Remodeling",
        Rating: `${currentRating} out of 5 Stars`,
        "Customer Name": customerName,
        "Contact Info": customerContact,
        "Feedback Message": customerMessage,
        SubmittedAt: new Date().toLocaleString()
      };

      const webhookUrl = (typeof CONFIG !== 'undefined' && CONFIG.webhookEndpoint) 
        ? CONFIG.webhookEndpoint 
        : "https://formsubmit.co/ajax/Dylanonline12@yahoo.com";

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Webhook submission response:', result);
      } catch (err) {
        console.warn('Network submission completed:', err);
      } finally {
        btnSubmitFeedback.disabled = false;
        btnSubmitFeedback.innerHTML = originalBtnText;
        saveState('thankyou', currentRating);
        showStep(stepThankyou);
      }
    });
  }

  // Footer Year
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
