// Interactive Client Script for Gibbs Roofing Review Gate Landing Page

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

  // Initialize Google Review URL from CONFIG
  const googleReviewUrl = (typeof CONFIG !== 'undefined' && CONFIG.googleReviewUrl) 
    ? CONFIG.googleReviewUrl 
    : "https://www.google.com/search?q=gibbs+roofing+and+remodeling#lrd=0x89e4e5d68ce37a53:0x9f9a291c8092f71d,3,,,,";

  if (directGoogleLink) directGoogleLink.href = googleReviewUrl;
  if (btnBypassGoogle) btnBypassGoogle.href = googleReviewUrl;

  let currentRating = 0;
  let isProcessingRating = false;

  // Star Rating Hover, Touch & Click Handlers
  starBtns.forEach(btn => {
    // Mouse hover preview
    btn.addEventListener('mouseenter', () => {
      if (isProcessingRating) return;
      const rating = parseInt(btn.dataset.rating, 10);
      highlightStars(rating, 'hover-active');
    });

    btn.addEventListener('mouseleave', () => {
      clearHoverStars();
    });

    // Touch & Click event handling
    const triggerSelect = (e) => {
      e.preventDefault();
      if (isProcessingRating) return;

      const rating = parseInt(btn.dataset.rating, 10);
      currentRating = rating;
      handleRatingSelect(rating);
    };

    btn.addEventListener('click', triggerSelect);
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
  function handleRatingSelect(rating) {
    isProcessingRating = true;
    highlightStars(rating, 'active');

    if (rating === 5) {
      // 5 STARS -> ZERO FRICTION DIRECT TRANSFER TO GOOGLE REVIEWS
      showStep(stepRedirecting);

      // Perform immediate redirect to Google Review link
      setTimeout(() => {
        window.location.href = googleReviewUrl;
      }, 400);

    } else {
      // 1 to 4 STARS -> PRIVATE FEEDBACK FORM
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
      
      // Smooth scroll to card on mobile
      const cardRect = targetStep.getBoundingClientRect();
      const absoluteCardTop = cardRect.top + window.pageYOffset;
      window.scrollTo({ top: absoluteCardTop - 40, behavior: 'smooth' });
    }
  }

  // Form Submission Handling (Email Webhook Dispatch)
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

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
