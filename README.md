# ACUCyS Christmas CTF 2025 Landing Page

A fast, responsive, and accessible landing page for the ACUCyS Christmas CTF 2025 event. Built with vanilla HTML, CSS, and JavaScript for optimal performance and accessibility. 90% a rushed AI build.

## Features

- **Fast & Responsive**: Lighthouse 95+ scores on Performance, Accessibility, Best Practices, and SEO
- **Accessible**: WCAG AA compliant with keyboard navigation and screen reader support
- **Theme Support**: Light and dark themes with system preference detection
- **Content Management**: JSON-based content configuration for easy updates
- **Interactive Elements**: Countdown timer, teaser challenge, and form validation

## Project Structure

```
ACUCyS-Website/
├── index.html                 # Main landing page
├── assets/
│   ├── css/
│   │   └── styles.css        # Main stylesheet with theme support
│   ├── js/
│   │   ├── main.js          # Core application logic
│   │   ├── countdown.js     # Countdown timer functionality
│   │   ├── forms.js         # Form handling and validation
│   │   ├── teaser.js        # Teaser challenge interaction
│   │   ├── analytics.js     # Privacy-friendly analytics
│   │   └── theme.js         # Theme management
│   ├── content.json         # Content configuration
│   ├── logo.svg            # ACUCyS logo
│   ├── hero-bg.jpg         # Hero background image
│   ├── og-image.jpg        # Open Graph image
│   └── favicon files       # Various favicon sizes
└── README.md               # This file
```

### Content Updates

Edit `assets/content.json` to update:

- Event dates and times
- Registration and Discord URLs
- Club and sponsor information
- FAQ content
- Meta information

## Configuration

### Content Management

Update `assets/content.json` to modify:

```json
{
  "eventName": "ACUCyS Christmas CTF 2025",
  "start": "2025-12-14T12:00:00+11:00",
  "end": "2025-12-15T12:00:00+11:00",
  "registerUrl": "https://forms.gle/your-form",
  "discordUrl": "https://discord.gg/your-invite",
  "clubs": [...],
  "sponsors": [...],
  "faqs": [...]
}
```

## Performance Optimisation

### JavaScript

- All scripts are deferred for optimal loading
- No external dependencies
- Minimal bundle size (~15KB total)

### CSS

- Single stylesheet with theme support
- CSS custom properties for easy customisation
- Mobile-first responsive design

## Accessibility Features

- **Semantic HTML5** landmarks and structure
- **Keyboard navigation** support throughout
- **Screen reader** compatibility
- **High contrast** mode support
- **Reduced motion** preference respect
- **Focus indicators** for all interactive elements

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## Support

For technical support or questions:

- **Email**: TBD
- **Discord**: [ACUCyS Discord](https://discord.gg/erU7crHszw)

**Built with ❤️ by the ACUCyS team**
