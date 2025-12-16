// Countdown timer functionality for ACUCyS Christmas CTF 2025
// Handles real-time countdown updates and event state management

class CountdownTimer {
	constructor() {
		this.startTime = null;
		this.endTime = null;
		this.intervalId = null;
		this.isEventLive = false;
		this.isEventFinished = false;

		this.init();
	}

	init() {
		try {
			// Get event times from content or use defaults
			this.loadEventTimes();

			// Start the countdown
			this.startCountdown();

			// Update immediately
			this.updateCountdown();
		} catch (error) {
			console.error("Error initializing countdown timer:", error);
		}
	}

	loadEventTimes() {
		// Try to get times from content.json or use defaults
		let startTimeStr = "2025-12-14T12:00:00+11:00"; // Default from content.json
		let endTimeStr = "2025-12-15T12:00:00+11:00";

		// Try to get from global content if available
		if (window.ctfApp && window.ctfApp.content) {
			startTimeStr = window.ctfApp.content.start || startTimeStr;
			endTimeStr = window.ctfApp.content.end || endTimeStr;
		}

		try {
			// Ensure consistent interpretation in browsers; content may be UTC or with offset
			this.startTime = new Date(startTimeStr);
			this.endTime = new Date(endTimeStr);
		} catch (error) {
			console.warn("Invalid date format, using demo dates");
			// For demo purposes, set to a future date
			const now = new Date();
			const demoStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
			const demoEnd = new Date(demoStart.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

			this.startTime = demoStart;
			this.endTime = demoEnd;
		}
	}

	startCountdown() {
		// Update every second
		this.intervalId = setInterval(() => {
			this.updateCountdown();
		}, 1000);
	}

	updateCountdown() {
		try {
			const now = new Date();
			const timeUntilStart = this.startTime - now;
			const timeUntilEnd = this.endTime - now;

			// Check if event has started
			if (timeUntilStart <= 0 && !this.isEventLive) {
				this.isEventLive = true;
				this.showEventLive();
				return;
			}

			// Check if event has ended
			if (timeUntilEnd <= 0 && !this.isEventFinished) {
				this.isEventFinished = true;
				this.showEventFinished();
				return;
			}

			// Show countdown to start
			if (timeUntilStart > 0) {
				this.showCountdownToStart(timeUntilStart);
			}
		} catch (error) {
			console.error("Error updating countdown:", error);
		}
	}

	showCountdownToStart(timeUntilStart) {
		const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);

		// Update countdown display
		this.updateCountdownDisplay(days, hours, minutes, seconds);

		// Update countdown label
		const label = document.querySelector(".countdown-label");
		if (label) {
			label.textContent = "Event starts in:";
		}
	}

	showEventLive() {
		const countdownTimer = document.getElementById("countdown-timer");
		const countdownLabel = document.querySelector(".countdown-label");

		if (countdownTimer) {
			countdownTimer.innerHTML = `
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="live-text">LIVE NOW</span>
        </div>
      `;
		}

		if (countdownLabel) {
			countdownLabel.textContent = "Event is live!";
		}

		// Update CTA buttons to show "Join now"
		this.updateCTAButtons("Join now", "Join Discord");

		// Show toast notification
		if (typeof showToast === "function") {
			showToast("The CTF is now live! Join the competition.");
		}
	}

	showEventFinished() {
		const countdownTimer = document.getElementById("countdown-timer");
		const countdownLabel = document.querySelector(".countdown-label");

		if (countdownTimer) {
			countdownTimer.innerHTML = `
        <div class="finished-indicator">
          <span class="finished-text">Event Finished</span>
        </div>
      `;
		}

		if (countdownLabel) {
			countdownLabel.textContent = "Thanks for participating!";
		}

		// Update CTA buttons
		this.updateCTAButtons("View Results", "Join Discord");

		// Clear interval
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	updateCountdownDisplay(days, hours, minutes, seconds) {
		const daysEl = document.getElementById("days");
		const hoursEl = document.getElementById("hours");
		const minutesEl = document.getElementById("minutes");
		const secondsEl = document.getElementById("seconds");

		if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
		if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
		if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
		if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
	}

	updateCTAButtons(primaryText, secondaryText) {
		const primaryBtn = document.getElementById("hero-register");
		const secondaryBtn = document.getElementById("discord-btn");

		if (primaryBtn) {
			primaryBtn.textContent = primaryText;
			if (this.isEventLive) {
				primaryBtn.href = "#register"; // Or link to actual CTF platform
			}
		}

		if (secondaryBtn && secondaryText) {
			secondaryBtn.textContent = secondaryText;
		}
	}

	// Public method to get current event state
	getEventState() {
		return {
			isLive: this.isEventLive,
			isFinished: this.isEventFinished,
			timeUntilStart: this.startTime - new Date(),
			timeUntilEnd: this.endTime - new Date(),
		};
	}

	// Clean up when component is destroyed
	destroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}
}

// Add CSS for live indicator
const liveIndicatorCSS = `
.live-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--secondary);
}

.live-dot {
  width: 12px;
  height: 12px;
  background: var(--secondary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.finished-indicator {
  text-align: center;
  font-weight: 700;
  color: var(--text-muted);
}

.finished-text {
  font-size: 1.5rem;
}
`;

// Inject CSS
const countdownStyle = document.createElement("style");
countdownStyle.textContent = liveIndicatorCSS;
document.head.appendChild(countdownStyle);

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
	module.exports = CountdownTimer;
}
