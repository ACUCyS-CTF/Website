// Teaser challenge functionality for ACUCyS Christmas CTF 2025
// Handles the preview challenge interaction and sharing

class TeaserChallenge {
	constructor() {
		this.challenge = {
			question: "What's the most common password in the world? (Hint: it's not 'password')",
			answer: "123456",
			alternatives: ["password", "admin", "qwerty", "letmein", "welcome"],
		};

		this.isSolved = false;
		this.init();
	}

	init() {
		this.setupTeaserInteraction();
		this.loadPreviousState();
	}

	setupTeaserInteraction() {
		const submitBtn = document.getElementById("teaser-submit");
		const answerInput = document.getElementById("teaser-answer");
		const resultDiv = document.getElementById("teaser-result");

		if (!submitBtn || !answerInput || !resultDiv) return;

		// Handle form submission
		submitBtn.addEventListener("click", () => this.handleSubmission());

		// Handle Enter key
		answerInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				this.handleSubmission();
			}
		});

		// Clear result when user starts typing
		answerInput.addEventListener("input", () => {
			if (resultDiv.style.display !== "none") {
				this.clearResult();
			}
		});
	}

	handleSubmission() {
		const answerInput = document.getElementById("teaser-answer");
		const resultDiv = document.getElementById("teaser-result");

		if (!answerInput || !resultDiv) return;

		const userAnswer = answerInput.value.trim().toLowerCase();
		const isCorrect = this.checkAnswer(userAnswer);

		if (isCorrect) {
			this.showSuccess();
			this.trackSolve();
		} else {
			this.showError();
		}
	}

	checkAnswer(userAnswer) {
		const correctAnswer = this.challenge.answer.toLowerCase();
		const alternatives = this.challenge.alternatives.map((alt) => alt.toLowerCase());

		// Check exact match or alternatives
		return userAnswer === correctAnswer || alternatives.includes(userAnswer);
	}

	showSuccess() {
		const resultDiv = document.getElementById("teaser-result");
		const answerInput = document.getElementById("teaser-answer");
		const submitBtn = document.getElementById("teaser-submit");

		if (!resultDiv) return;

		this.isSolved = true;
		this.saveState();

		resultDiv.className = "teaser-result success";
		resultDiv.innerHTML = `
      <div class="success-content">
        <div class="success-icon">🎉</div>
        <h4>Well done!</h4>
        <p>You've solved the teaser challenge. Ready for the real thing?</p>
        <div class="success-actions">
          <button class="btn btn-primary" id="share-success">Share your success</button>
          <a href="#register" class="btn btn-outline">Register for CTF</a>
        </div>
      </div>
    `;
		resultDiv.style.display = "block";

		// Disable input and button
		if (answerInput) answerInput.disabled = true;
		if (submitBtn) submitBtn.disabled = true;

		// Setup share functionality
		this.setupShareButton();

		// Show toast
		if (typeof showToast === "function") {
			showToast("Challenge solved! Great work!");
		}
	}

	showError() {
		const resultDiv = document.getElementById("teaser-result");

		if (!resultDiv) return;

		resultDiv.className = "teaser-result error";
		resultDiv.innerHTML = `
      <div class="error-content">
        <div class="error-icon">🤔</div>
        <h4>Not quite right</h4>
        <p>Try again! Think about the most commonly used passwords.</p>
      </div>
    `;
		resultDiv.style.display = "block";

		// Auto-hide after 3 seconds
		setTimeout(() => {
			this.clearResult();
		}, 3000);
	}

	clearResult() {
		const resultDiv = document.getElementById("teaser-result");
		if (resultDiv) {
			resultDiv.style.display = "none";
			resultDiv.className = "teaser-result";
			resultDiv.innerHTML = "";
		}
	}

	setupShareButton() {
		const shareBtn = document.getElementById("share-success");
		if (shareBtn) {
			shareBtn.addEventListener("click", () => this.shareSuccess());
		}
	}

	shareSuccess() {
		const shareUrl = this.generateShareUrl();
		const shareText = `I just solved the ACUCyS Christmas CTF teaser challenge! 🎉 Join me for the full competition: ${shareUrl}`;

		// Try to use Web Share API if available
		if (navigator.share) {
			navigator
				.share({
					title: "ACUCyS Christmas CTF 2025",
					text: shareText,
					url: shareUrl,
				})
				.then(() => {
					this.trackShare();
				})
				.catch(() => {
					this.fallbackShare(shareText, shareUrl);
				});
		} else {
			this.fallbackShare(shareText, shareUrl);
		}
	}

	fallbackShare(text, url) {
		// Copy to clipboard
		if (typeof copyToClipboard === "function") {
			copyToClipboard(text);
		} else {
			// Fallback to prompt
			prompt("Copy this message to share:", text);
		}

		this.trackShare();
	}

	generateShareUrl() {
		const baseUrl = window.location.origin;
		const referralCode = localStorage.getItem("ctf_referral");

		let shareUrl = baseUrl;
		if (referralCode) {
			shareUrl += `?ref=${referralCode}`;
		}

		return shareUrl;
	}

	trackSolve() {
		// Track teaser solve event
		if (typeof Analytics !== "undefined") {
			new Analytics().track("teaser_solve");
		}
	}

	trackShare() {
		// Track share event
		if (typeof Analytics !== "undefined") {
			new Analytics().track("teaser_share");
		}
	}

	saveState() {
		localStorage.setItem("ctf_teaser_solved", "true");
		localStorage.setItem("ctf_teaser_solve_time", new Date().toISOString());
	}

	loadPreviousState() {
		const isSolved = localStorage.getItem("ctf_teaser_solved") === "true";

		if (isSolved) {
			this.isSolved = true;
			this.showPreviousSuccess();
		}
	}

	showPreviousSuccess() {
		const resultDiv = document.getElementById("teaser-result");
		const answerInput = document.getElementById("teaser-answer");
		const submitBtn = document.getElementById("teaser-submit");

		if (!resultDiv) return;

		resultDiv.className = "teaser-result success";
		resultDiv.innerHTML = `
      <div class="success-content">
        <div class="success-icon">✅</div>
        <h4>Already solved!</h4>
        <p>You've already completed this challenge. Ready for the real CTF?</p>
        <div class="success-actions">
          <button class="btn btn-primary" id="share-success">Share your success</button>
          <a href="#register" class="btn btn-outline">Register for CTF</a>
        </div>
      </div>
    `;
		resultDiv.style.display = "block";

		// Disable input and button
		if (answerInput) answerInput.disabled = true;
		if (submitBtn) submitBtn.disabled = true;

		// Setup share functionality
		this.setupShareButton();
	}

	// Public method to reset challenge (for testing)
	resetChallenge() {
		this.isSolved = false;
		localStorage.removeItem("ctf_teaser_solved");
		localStorage.removeItem("ctf_teaser_solve_time");

		const resultDiv = document.getElementById("teaser-result");
		const answerInput = document.getElementById("teaser-answer");
		const submitBtn = document.getElementById("teaser-submit");

		if (resultDiv) {
			resultDiv.style.display = "none";
			resultDiv.className = "teaser-result";
			resultDiv.innerHTML = "";
		}

		if (answerInput) {
			answerInput.disabled = false;
			answerInput.value = "";
		}

		if (submitBtn) {
			submitBtn.disabled = false;
		}
	}
}

// Add CSS for teaser challenge
const teaserCSS = `
.success-content,
.error-content {
  text-align: center;
}

.success-icon,
.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.success-content h4,
.error-content h4 {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
}

.success-content p,
.error-content p {
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

.success-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
}
`;

// Inject CSS
const teaserStyle = document.createElement("style");
teaserStyle.textContent = teaserCSS;
document.head.appendChild(teaserStyle);

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
	module.exports = TeaserChallenge;
}
