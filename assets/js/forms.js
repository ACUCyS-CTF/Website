// Form handling functionality for ACUCyS Christmas CTF 2025
// Handles registration form validation, submission, and calendar integration

class FormHandler {
  constructor() {
    this.form = null;
    this.init();
  }

  init() {
    this.form = document.getElementById('registration-form');
    if (this.form) {
      this.setupFormValidation();
      this.setupFormSubmission();
    }
    
    this.setupCalendarButtons();
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Discord handle validation
    if (field.name === 'discord' && value && !value.startsWith('@')) {
      field.value = '@' + value;
    }

    this.showFieldError(field, isValid ? null : errorMessage);
    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    
    if (message) {
      field.classList.add('error');
      const errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      errorEl.textContent = message;
      field.parentNode.appendChild(errorEl);
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  async handleFormSubmission() {
    // Validate all fields
    const isValid = this.validateAllFields();
    if (!isValid) {
      this.showFormError('Please fix the errors above');
      return;
    }

    // Show loading state
    this.setFormLoading(true);

    try {
      // Get form data
      const formData = this.getFormData();
      
      // Add referral tracking
      const referralCode = localStorage.getItem('ctf_referral');
      if (referralCode) {
        formData.referral = referralCode;
      }

      // Add UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      
      if (utmSource) formData.utm_source = utmSource;
      if (utmMedium) formData.utm_medium = utmMedium;
      if (utmCampaign) formData.utm_campaign = utmCampaign;

      // Submit form (this would be replaced with actual endpoint)
      const response = await this.submitForm(formData);
      
      if (response.success) {
        this.showFormSuccess();
        this.trackRegistration(formData);
      } else {
        this.showFormError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormError('Registration failed. Please try again.');
    } finally {
      this.setFormLoading(false);
    }
  }

  validateAllFields() {
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let allValid = true;

    inputs.forEach(input => {
      const isValid = this.validateField(input);
      if (!isValid) allValid = false;
    });

    return allValid;
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  async submitForm(data) {
    // Formspree integration
    const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORM_ID';
    
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          university: data.university,
          study_level: data['study-level'],
          discord: data.discord,
          team_status: data['team-status'],
          referral: data.referral,
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
          _subject: 'ACUCyS Christmas CTF 2025 Registration'
        })
      });
      
      if (response.ok) {
        return { success: true, message: 'Registration successful!' };
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }

  setFormLoading(loading) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const inputs = this.form.querySelectorAll('input, select');
    
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering...';
      inputs.forEach(input => input.disabled = true);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register free';
      inputs.forEach(input => input.disabled = false);
    }
  }

  showFormSuccess() {
    this.clearFormMessages();
    
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
      <h3>Registration successful!</h3>
      <p>Check your email for confirmation and next steps.</p>
      <div class="success-actions">
        <a href="https://discord.gg/yourinvite" class="btn btn-primary">Join Discord</a>
        <a href="/beginner-guide" class="btn btn-outline">Read beginner guide</a>
      </div>
    `;
    
    this.form.parentNode.insertBefore(successEl, this.form);
    this.form.style.display = 'none';
    
    // Track successful registration
    if (typeof Analytics !== 'undefined') {
      new Analytics().track('registration_success');
    }
  }

  showFormError(message) {
    this.clearFormMessages();
    
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    
    this.form.insertBefore(errorEl, this.form.firstChild);
  }

  clearFormMessages() {
    const existingMessages = this.form.parentNode.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
  }

  trackRegistration(data) {
    // Track registration event for analytics
    if (typeof Analytics !== 'undefined') {
      new Analytics().track('registration_submit', {
        university: data.university,
        study_level: data.study_level,
        team_status: data.team_status,
        referral: data.referral
      });
    }
  }

  setupCalendarButtons() {
    // Google Calendar
    const googleBtn = document.getElementById('google-cal');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.addToGoogleCalendar());
    }

    // Apple Calendar
    const appleBtn = document.getElementById('apple-cal');
    if (appleBtn) {
      appleBtn.addEventListener('click', () => this.addToAppleCalendar());
    }

    // Outlook Calendar
    const outlookBtn = document.getElementById('outlook-cal');
    if (outlookBtn) {
      outlookBtn.addEventListener('click', () => this.addToOutlookCalendar());
    }
  }

  addToGoogleCalendar() {
    const event = this.getEventDetails();
    const googleUrl = this.generateGoogleCalendarUrl(event);
    window.open(googleUrl, '_blank');
  }

  addToAppleCalendar() {
    const event = this.getEventDetails();
    const icsContent = this.generateICSContent(event);
    this.downloadICS(icsContent, 'acucys-ctf-2025.ics');
  }

  addToOutlookCalendar() {
    const event = this.getEventDetails();
    const outlookUrl = this.generateOutlookCalendarUrl(event);
    window.open(outlookUrl, '_blank');
  }

  getEventDetails() {
    // This would come from content.json
    return {
      title: 'ACUCyS Christmas CTF 2025',
      description: 'Free 24 hour student-built cybersecurity competition for Australian uni students. Beginner friendly. Join solo or as a team.',
      start: '2025-12-??T12:00:00+11:00',
      end: '2025-12-??T12:00:00+11:00',
      location: 'Online (Discord)',
      url: 'https://ctf.acucys.org'
    };
  }

  generateGoogleCalendarUrl(event) {
    const startDate = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description,
      location: event.location,
      trp: 'false'
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  generateOutlookCalendarUrl(event) {
    const startDate = new Date(event.start).toISOString();
    const endDate = new Date(event.end).toISOString();
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: startDate,
      enddt: endDate,
      body: event.description,
      location: event.location
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  generateICSContent(event) {
    const startDate = new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(event.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ACUCyS//Christmas CTF 2025//EN
BEGIN:VEVENT
UID:ctf2025@acucys.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
URL:${event.url}
END:VEVENT
END:VCALENDAR`;
  }

  downloadICS(content, filename) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Add CSS for form states
const formCSS = `
.field-error {
  color: var(--accent);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

input.error,
select.error {
  border-color: var(--accent);
}

.form-success {
  background: rgba(0, 184, 148, 0.1);
  border: 1px solid var(--secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  margin-bottom: var(--space-lg);
}

.form-success h3 {
  color: var(--secondary);
  margin-bottom: var(--space-md);
}

.success-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-top: var(--space-lg);
  flex-wrap: wrap;
}

.form-error {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  color: var(--accent);
  margin-bottom: var(--space-lg);
  text-align: center;
}

@media (max-width: 480px) {
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
}
`;

// Inject CSS
const formStyle = document.createElement('style');
formStyle.textContent = formCSS;
document.head.appendChild(formStyle);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}
