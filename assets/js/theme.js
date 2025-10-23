// Theme management for ACUCyS Christmas CTF 2025
// Handles light/dark theme switching and system preference detection

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.init();
  }

  init() {
    this.detectSystemPreference();
    this.loadSavedTheme();
    this.setupThemeToggle();
    this.setupSystemPreferenceListener();
  }

  detectSystemPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPreference = this.detectSystemPreference();
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(systemPreference);
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    
    // Remove existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button if it exists
    this.updateThemeToggleButton();
    
    // Dispatch theme change event
    this.dispatchThemeChangeEvent(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setupThemeToggle() {
    // Create theme toggle button if it doesn't exist
    this.createThemeToggleButton();
  }

  createThemeToggleButton() {
    // Check if toggle already exists
    if (document.getElementById('theme-toggle')) return;
    
    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.innerHTML = this.getThemeIcon();
    
    // Add to header
    const header = document.querySelector('.header-content');
    if (header) {
      header.appendChild(toggle);
    }
    
    // Add event listener
    toggle.addEventListener('click', () => this.toggleTheme());
  }

  getThemeIcon() {
    return this.currentTheme === 'light' ? '🌙' : '☀️';
  }

  updateThemeToggleButton() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = this.getThemeIcon();
      toggle.setAttribute('aria-label', `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`);
    }
  }

  setupSystemPreferenceListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
      }
    });
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    document.dispatchEvent(event);
  }

  // Public methods
  getCurrentTheme() {
    return this.currentTheme;
  }

  isDarkTheme() {
    return this.currentTheme === 'dark';
  }

  isLightTheme() {
    return this.currentTheme === 'light';
  }

  // Reset to system preference
  resetToSystemPreference() {
    localStorage.removeItem('theme');
    const systemPreference = this.detectSystemPreference();
    this.setTheme(systemPreference);
  }
}

// Add CSS for theme toggle button
const themeToggleCSS = `
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  cursor: pointer;
  font-size: 1.25rem;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.theme-toggle:hover {
  background: var(--surface-alt);
  border-color: var(--primary);
}

.theme-toggle:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
`;

// Inject CSS
const themeStyle = document.createElement('style');
themeStyle.textContent = themeToggleCSS;
document.head.appendChild(themeStyle);

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
