// Main JavaScript functionality for ACUCyS Christmas CTF 2025
// Handles content loading, theme management, and core interactions

class CTFApp {
	constructor() {
		this.content = null;
		this.referralCode = null;
		this.init();
	}

	async init() {
		// Load content configuration
		await this.loadContent();

		// Make content available globally
		window.ctfApp = this;

		// Initialize components
		this.initTheme();
		this.initHeader();
		this.initReferralTracking();
		this.populateContent();
		this.initSmoothScrolling();
		this.initFAQ();

		// Initialize other modules
		if (typeof CountdownTimer !== "undefined") {
			this.countdownTimer = new CountdownTimer();
			// Reinitialize countdown with correct dates after content is loaded
			if (this.countdownTimer && this.content) {
				this.countdownTimer.loadEventTimes();
				this.countdownTimer.updateCountdown();
			}
		}

		// Form handling is now managed by Tally.so
		// if (typeof FormHandler !== 'undefined') {
		//   this.formHandler = new FormHandler();
		// }

		if (typeof TeaserChallenge !== "undefined") {
			this.teaserChallenge = new TeaserChallenge();
		}

		if (typeof Analytics !== "undefined") {
			this.analytics = new Analytics();
		}

		// Setup Tally form analytics
		this.setupTallyFormAnalytics();
	}

	async loadContent() {
		try {
			const response = await fetch("/assets/content.json");
			this.content = await response.json();
		} catch (error) {
			console.warn("Could not load content.json, using defaults");
			this.content = this.getDefaultContent();
		}
	}

	getDefaultContent() {
		return {
			eventName: "ACUCyS Christmas CTF 2025",
			tagline: "Student-built. Free to join. Beginner friendly.",
			start: "2025-12-20T09:00:00+11:00",
			end: "2025-12-21T21:00:00+11:00",
			timezone: "Australia/Melbourne",
			registerUrl: "https://example.com/register",
			discordUrl: "https://discord.gg/yourinvite",
			beginnerGuideUrl: "/beginner-guide",
			whatIsCtfUrl: "/what-is-a-ctf",
			clubs: [
				{
					name: "DUCA",
					campus: "Deakin University",
					url: "https://duca.au",
					logo: "assets/clubs/duca.png",
				},
				{
					name: "DSEC",
					campus: "Deakin University",
					url: "https://linktr.ee/DeakinSEC",
					logo: "assets/clubs/dsec.png",
				},
				{
					name: "AdelaideB9",
					campus: "University of Adelaide",
					url: "https://adelaideb9.com/",
					logo: "assets/clubs/b9.png",
				},
				{
					name: "Computing & Security Student Association",
					campus: "Edith Cowan University",
					url: "https://cassa.au",
					logo: "assets/clubs/ecu.png",
				},
				{
					name: "LTUCS",
					campus: "La Trobe University",
					url: "https://www.linkedin.com/company/la-trobe-university-cybersecurity-club-csc",
					logo: "assets/clubs/ltu.jpg",
				},
				{
					name: "MQCyberSec Club",
					campus: "Macquarie University",
					url: "https://mqcybersec.org",
					logo: "assets/clubs/mq.webp",
				},
				{
					name: "MonSec",
					campus: "Monash University",
					url: "https://monsec.io",
					logo: "assets/clubs/monsec.png",
				},
				{
					name: "MISC",
					campus: "University of Melbourne",
					url: "https://www.umisc.club",
					logo: "assets/clubs/misc.png",
				},
				{
					name: "RISC",
					campus: "RMIT",
					url: "https://www.linkedin.com/company/rmit-information-security-collective",
					logo: "assets/clubs/risc.png",
				},
				{
					name: "SCSC",
					campus: "Swinburne University",
					url: "https://www.linkedin.com/company/swinburnecyber",
					logo: "assets/clubs/scsc.png",
				},
				{
					name: "UNSW Security Society",
					campus: "University of New South Wales",
					url: "https://unswsecurity.com",
					logo: "assets/clubs/unsw.png",
				},
				{
					name: "UQ Cyber",
					campus: "University of Queensland",
					url: "https://uqcyber.org",
					logo: "assets/clubs/uqcloud.png",
				},
				{
					name: "USyd CyberSoc",
					campus: "University of Sydney",
					url: "https://usydcyber.com",
					logo: "assets/clubs/usyd.png",
				},
				{
					name: "UTS Cyber Security Society",
					campus: "University of Technology Sydney",
					url: "https://utscyber.org",
					logo: "assets/clubs/uts.png",
				},
				{
					name: "UNE Cybersecurity",
					campus: "University of New England",
					url: "https://une.edu.au",
					logo: "assets/clubs/une.webp",
				},
			],
			sponsors: [
				{
					name: "Legion Offensive Security",
					url: "https://legionoffensivesecurity.com/",
					logo: "/assets/sponsors/LEGION.png",
				},
			],
			faqs: [
				{
					q: "Who can join?",
					a: "Australian uni and TAFE students, recent grads, and early-career participants.",
				},
				{ q: "Do I need experience?", a: "No. There is a beginner route and mentors on call." },
				{ q: "How do teams work?", a: "Up to 4 players. You can join solo and find a team later." },
				{ q: "What do I need?", a: "A laptop, internet, and a modern browser." },
				{ q: "Is it free?", a: "Yes." },
				{ q: "How do I prepare?", a: "Read the beginner guide and try the teaser challenge." },
				{ q: "Will there be prizes?", a: "Yes. Details announced closer to the date." },
			],
		};
	}

	initTheme() {
		// Check for saved theme preference or default to system preference
		const savedTheme = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (savedTheme) {
			document.documentElement.classList.add(savedTheme);
		} else if (prefersDark) {
			document.documentElement.classList.add("dark-theme");
		} else {
			document.documentElement.classList.add("light-theme");
		}

		// Listen for system theme changes
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
			if (!localStorage.getItem("theme")) {
				if (e.matches) {
					document.documentElement.classList.remove("light-theme");
					document.documentElement.classList.add("dark-theme");
				} else {
					document.documentElement.classList.remove("dark-theme");
					document.documentElement.classList.add("light-theme");
				}
			}
		});
	}

	initHeader() {
		const header = document.getElementById("header");
		let lastScrollY = window.scrollY;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > 100) {
				header.classList.add("scrolled");
			} else {
				header.classList.remove("scrolled");
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
	}

	initReferralTracking() {
		// Get referral code from URL parameter
		const urlParams = new URLSearchParams(window.location.search);
		const ref = urlParams.get("ref");

		if (ref) {
			this.referralCode = ref;
			localStorage.setItem("ctf_referral", ref);
		} else {
			// Check for stored referral code
			this.referralCode = localStorage.getItem("ctf_referral");
		}
	}

	populateContent() {
		if (!this.content) return;

		// Update event times
		this.updateEventTimes();

		// Populate clubs
		this.populateClubs();

		// Populate sponsors
		this.populateSponsors();

		// Populate FAQ
		this.populateFAQ();

		// Update URLs with referral tracking
		this.updateUrlsWithReferral();
	}

	updateEventTimes() {
		const startEls = [document.getElementById("start-time"), document.getElementById("start-time-flagship")].filter(
			Boolean,
		);
		const endEls = [document.getElementById("end-time"), document.getElementById("end-time-flagship")].filter(
			Boolean,
		);

		if (startEls.length && this.content.start) {
			const startDate = new Date(this.content.start);
			const startStr = startDate.toLocaleDateString("en-AU", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				timeZoneName: "short",
				timeZone: "Australia/Melbourne",
			});
			startEls.forEach((el) => (el.textContent = startStr));
		}

		if (endEls.length && this.content.end) {
			const endDate = new Date(this.content.end);
			const endStr = endDate.toLocaleDateString("en-AU", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				timeZoneName: "short",
				timeZone: "Australia/Melbourne",
			});
			endEls.forEach((el) => (el.textContent = endStr));
		}
	}

	populateClubs() {
		const clubsPreview = document.getElementById("clubs-preview");
		const clubsFull = document.getElementById("clubs-full");

		if (!this.content.clubs) return;

		const createClubElement = (club) => {
			const clubEl = document.createElement("div");
			clubEl.className = "club-item";
			clubEl.innerHTML = `
        <div class="club-logo" style="background: var(--surface-alt);">
          ${club.logo ? `<img src="${club.logo}" alt="${club.name} logo" loading="lazy" />` : ""}
        </div>
        <div class="club-info">
          <h4>${club.name}</h4>
          <p>${club.campus}</p>
        </div>
      `;

			if (club.url) {
				clubEl.addEventListener("click", () => {
					window.open(this.addReferralToUrl(club.url), "_blank");
				});
				clubEl.style.cursor = "pointer";
			}

			return clubEl;
		};

		if (clubsPreview) {
			// Show first 6 clubs in preview
			const previewClubs = this.content.clubs.slice(0, 6);
			previewClubs.forEach((club) => {
				clubsPreview.appendChild(createClubElement(club));
			});
		}

		if (clubsFull) {
			// Show all clubs in full section
			this.content.clubs.forEach((club) => {
				clubsFull.appendChild(createClubElement(club));
			});
		}
	}

	populateSponsors() {
		const sponsorsGrid = document.getElementById("sponsors-grid");

		if (!this.content.sponsors || !sponsorsGrid) return;

		this.content.sponsors.forEach((sponsor) => {
			const sponsorEl = document.createElement("div");
			sponsorEl.className = "sponsor-item";

			if (sponsor.logo) {
				sponsorEl.innerHTML = `
          <img src=".${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo">
        `;
			} else {
				sponsorEl.innerHTML = `<span>${sponsor.name}</span>`;
			}

			if (sponsor.url) {
				sponsorEl.addEventListener("click", () => {
					window.open(this.addReferralToUrl(sponsor.url), "_blank");
				});
				sponsorEl.style.cursor = "pointer";
			}

			sponsorsGrid.appendChild(sponsorEl);
		});
	}

	populateFAQ() {
		const faqList = document.getElementById("faq-list");

		if (!this.content.faqs || !faqList) return;

		this.content.faqs.forEach((faq, index) => {
			const faqEl = document.createElement("div");
			faqEl.className = "faq-item";
			faqEl.innerHTML = `
        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
          <span>${faq.q}</span>
          <span class="faq-icon">▼</span>
        </button>
        <div class="faq-answer" id="faq-answer-${index}">
          ${faq.a}
        </div>
      `;

			const question = faqEl.querySelector(".faq-question");
			const answer = faqEl.querySelector(".faq-answer");

			question.addEventListener("click", () => {
				const isActive = faqEl.classList.contains("active");

				// Close all other FAQ items
				document.querySelectorAll(".faq-item").forEach((item) => {
					item.classList.remove("active");
					item.querySelector(".faq-question").setAttribute("aria-expanded", "false");
				});

				// Toggle current item
				if (!isActive) {
					faqEl.classList.add("active");
					question.setAttribute("aria-expanded", "true");
				}
			});

			faqList.appendChild(faqEl);
		});
	}

	updateUrlsWithReferral() {
		// Update registration and Discord URLs with referral tracking
		const registerBtn = document.getElementById("register-btn");
		const heroRegisterBtn = document.getElementById("hero-register");
		const discordBtn = document.getElementById("discord-btn");

		if (registerBtn && this.content.registerUrl) {
			registerBtn.href = this.addReferralToUrl(this.content.registerUrl);
		}

		if (heroRegisterBtn && this.content.registerUrl) {
			heroRegisterBtn.href = this.addReferralToUrl(this.content.registerUrl);
		}

		if (discordBtn && this.content.discordUrl) {
			discordBtn.href = this.addReferralToUrl(this.content.discordUrl);
		}
	}

	addReferralToUrl(url) {
		if (!this.referralCode) return url;

		const separator = url.includes("?") ? "&" : "?";
		return `${url}${separator}ref=${this.referralCode}`;
	}

	initSmoothScrolling() {
		// Handle smooth scrolling for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", (e) => {
				e.preventDefault();
				const target = document.querySelector(anchor.getAttribute("href"));

				if (target) {
					const headerHeight = document.getElementById("header").offsetHeight;
					const targetPosition = target.offsetTop - headerHeight - 20;

					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});
				}
			});
		});
	}

	initFAQ() {
		// FAQ functionality is handled in populateFAQ
		// This method is here for consistency and future enhancements
	}

	setupTallyFormAnalytics() {
		// Listen for Tally form events
		const tallyIframe = document.querySelector(".tally-form-container iframe");
		if (tallyIframe) {
			// Track when form is viewed
			if (typeof Analytics !== "undefined") {
				new Analytics().track("form_view");
			}

			// Listen for form submission (Tally sends postMessage events)
			window.addEventListener("message", (event) => {
				if (event.origin === "https://tally.so" && event.data.type === "tally.formSubmitted") {
					if (typeof Analytics !== "undefined") {
						new Analytics().track("registration_submit");
					}
				}
			});
		}
	}
}

// Utility functions
function showToast(message, type = "success") {
	const container = document.getElementById("toast-container");
	if (!container) return;

	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.textContent = message;

	container.appendChild(toast);

	// Auto remove after 5 seconds
	setTimeout(() => {
		if (toast.parentNode) {
			toast.parentNode.removeChild(toast);
		}
	}, 5000);
}

function copyToClipboard(text) {
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				showToast("Copied to clipboard!");
			})
			.catch(() => {
				fallbackCopyToClipboard(text);
			});
	} else {
		fallbackCopyToClipboard(text);
	}
}

function fallbackCopyToClipboard(text) {
	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	textArea.style.left = "-999999px";
	textArea.style.top = "-999999px";
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		document.execCommand("copy");
		showToast("Copied to clipboard!");
	} catch (err) {
		showToast("Could not copy to clipboard", "error");
	}

	document.body.removeChild(textArea);
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	new CTFApp();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
	module.exports = { CTFApp, showToast, copyToClipboard };
}
