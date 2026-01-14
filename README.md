# Sahana Mathew - AI/ML Engineer Portfolio

A modern, professional, and visually appealing personal portfolio website showcasing AI/ML expertise, projects, and experience.

## Design Specifications

### Color Palette

#### Primary Colors
- **Primary Purple**: `#667eea` - Main brand color
- **Deep Purple**: `#764ba2` - Accent color
- **Light Blue**: `#0ea5e9` - Interactive elements

#### Gradients
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Secondary Gradient**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- **Accent Gradient**: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- **Warm Gradient**: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`

#### Light Theme
- **Background Primary**: `#ffffff`
- **Background Secondary**: `#f8fafc`
- **Background Tertiary**: `#f1f5f9`
- **Text Primary**: `#0f172a`
- **Text Secondary**: `#475569`
- **Text Tertiary**: `#64748b`
- **Border**: `#e2e8f0`

#### Dark Theme
- **Background Primary**: `#0f172a`
- **Background Secondary**: `#1e293b`
- **Background Tertiary**: `#334155`
- **Text Primary**: `#f1f5f9`
- **Text Secondary**: `#cbd5e1`
- **Text Tertiary**: `#94a3b8`
- **Border**: `#334155`

### Typography

#### Font Families
- **Primary Font**: `Inter` - Clean, modern sans-serif for body text
- **Heading Font**: `Space Grotesk` - Bold, distinctive font for headings

#### Font Sizes
- **Hero Title**: `clamp(2.5rem, 5vw, 4rem)` - Responsive large heading
- **Hero Subtitle**: `clamp(1.25rem, 3vw, 1.75rem)` - Secondary hero text
- **Section Title**: `clamp(2rem, 4vw, 3rem)` - Section headings
- **Body Text**: `1rem` (16px) - Standard body text
- **Large Body**: `1.125rem` - Emphasized body text
- **Small Text**: `0.875rem` - Captions and labels

#### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

### Layout & Spacing

#### Container
- **Max Width**: 1200px
- **Padding**: 0 1.5rem (responsive)

#### Spacing Scale
- **XS**: 0.5rem (8px)
- **SM**: 1rem (16px)
- **MD**: 1.5rem (24px)
- **LG**: 2rem (32px)
- **XL**: 3rem (48px)
- **2XL**: 4rem (64px)
- **3XL**: 6rem (96px)

#### Border Radius
- **SM**: 0.375rem
- **MD**: 0.5rem
- **LG**: 0.75rem
- **XL**: 1rem
- **2XL**: 1.5rem
- **Full**: 9999px (circular)

### Shadows

- **Small**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **Medium**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **Large**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **XL**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- **2XL**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`

### Animations & Transitions

#### Timing Functions
- **Fast**: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- **Base**: 250ms cubic-bezier(0.4, 0, 0.2, 1)
- **Slow**: 350ms cubic-bezier(0.4, 0, 0.2, 1)

#### Animations
- **Slide In Up**: Elements fade in while sliding up
- **Slide In Right**: Elements fade in while sliding from right
- **Float**: Gentle floating motion for decorative elements
- **Bounce**: Bouncing animation for scroll indicator
- **Float Card**: Subtle floating for hero cards

### Components

#### Navigation Bar
- Fixed position with backdrop blur
- Smooth scroll with active link highlighting
- Mobile hamburger menu
- Theme toggle (light/dark mode)
- Transparent background with blur effect

#### Buttons
- **Primary**: Gradient background with shadow
- **Secondary**: Light background with border
- **Outline**: Transparent with border
- Hover effects: Slight elevation and transform

#### Cards
- Rounded corners (0.75rem - 1rem)
- Subtle shadow that increases on hover
- Transform on hover (translateY)
- Border on light theme, enhanced shadow on dark theme

#### Project Cards
- Grid layout (auto-fit, minmax 350px)
- Icon badge and category badge
- Tech pill badges with gradient background
- Tilt effect on mouse move (3D perspective)
- Hover lift animation

#### Timeline (Experience)
- Vertical gradient line
- Circular gradient dots
- Content cards with hover slide effect
- Tech tags with hover color change

#### Skills Section
- Categorized skill cards
- Icon-based skill items
- Grid layout with hover effects
- Color change on hover

#### Contact Section
- Two-column layout (info cards + form)
- Icon-based contact cards
- Styled form inputs with focus states
- Form validation and submission handling

### Responsive Breakpoints

```css
/* Desktop First Approach */
@media (max-width: 1024px) { /* Tablets */ }
@media (max-width: 768px)  { /* Mobile landscape */ }
@media (max-width: 480px)  { /* Mobile portrait */ }
```

#### Responsive Behavior
- **1024px**: Switch to single column layouts, adjust navigation
- **768px**: Mobile navigation, stack hero content, single column grids
- **480px**: Reduce font sizes, tighter spacing, hide decorative elements

### Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Focus visible states with outline
- Reduced motion media query support
- Keyboard navigation support
- High contrast text (WCAG AA compliant)
- Screen reader friendly

### Performance Optimizations

- CSS variables for theme switching
- Hardware-accelerated animations (transform, opacity)
- Intersection Observer for scroll animations
- Debounced scroll events
- Lazy loading for images (when added)
- Minimal external dependencies

## Features

### Interactive Elements
1. **Theme Toggle**: Switch between light and dark modes
2. **Smooth Scrolling**: Navigate smoothly between sections
3. **Active Navigation**: Highlights current section in nav
4. **Back to Top**: Quick return to hero section
5. **Typing Effect**: Animated role cycling in hero
6. **Counter Animation**: Animated stats numbers
7. **Form Validation**: Contact form with submit handling
8. **Notification System**: Toast notifications for user feedback
9. **3D Card Tilt**: Project cards with perspective tilt
10. **Parallax Effect**: Mouse-following gradient orbs
11. **Scroll Animations**: Elements fade in on scroll

### Sections

1. **Navigation**
   - Logo
   - Menu links (Home, About, Experience, Projects, Skills, Contact)
   - Theme toggle
   - Mobile responsive menu

2. **Hero Section**
   - Name and title
   - Animated gradient background with orbs
   - Call-to-action buttons
   - Statistics counter
   - Floating skill cards
   - Scroll indicator

3. **About Section**
   - Professional summary
   - Key highlights with checkmarks
   - Education cards
   - Location information

4. **Experience Section**
   - Timeline layout
   - 4 professional roles
   - Responsibilities listed
   - Tech stack tags
   - Company and location info

5. **Projects Section**
   - 5 featured projects
   - Project descriptions
   - Key highlights
   - Tech stack badges
   - Hover effects

6. **Skills Section**
   - 7 categorized skill groups:
     - Languages
     - AI/ML
     - Frameworks
     - Databases
     - Visualization
     - APIs & Tools
     - Libraries
   - Icon-based skill items

7. **Contact Section**
   - Email, phone, LinkedIn, location cards
   - Contact form
   - Form validation
   - Success/error notifications

8. **Footer**
   - Brand information
   - Quick links
   - Social media links
   - Copyright notice

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Installation & Usage

1. **Clone or Download** the repository
2. **Open** `index.html` in a web browser
3. **No build process required** - Pure HTML, CSS, and JavaScript

### File Structure
```
Sahana_Portfolio/
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization Guide

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-500: #YOUR_COLOR;
    --gradient-primary: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

### Adding Projects
Add a new project card in the `.projects-grid` section of `index.html`:
```html
<div class="project-card" data-aos="fade-up">
    <!-- Project content -->
</div>
```

### Updating Experience
Add timeline items in the `.timeline` section of `index.html`

### Adding Skills
Add skill items in the appropriate `.skill-category` section

### Enabling Resume Download
Replace the TODO comment in `script.js`:
```javascript
window.open('path/to/your-resume.pdf', '_blank');
```

## Future Enhancements

- [ ] Add actual resume PDF and enable download
- [ ] Integrate contact form with backend API (EmailJS, Formspree, etc.)
- [ ] Add project demo links and GitHub repositories
- [ ] Add blog section
- [ ] Implement PWA (Progressive Web App) features
- [ ] Add certifications section
- [ ] Add testimonials section
- [ ] Implement analytics tracking
- [ ] Add project screenshots/images
- [ ] SEO optimization
- [ ] Open Graph meta tags for social sharing

## Credits

### Fonts
- [Inter](https://fonts.google.com/specimen/Inter) by Rasmus Andersson
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) by Florian Karsten

### Icons
- [Font Awesome 6.4.0](https://fontawesome.com/) - Icon library

### Design Inspiration
- Modern portfolio best practices
- Glassmorphism design trend
- Gradient-based color schemes
- Framer Motion animation patterns

## License

This portfolio is free to use for personal and commercial purposes. Attribution appreciated but not required.

## Contact

**Sahana Mathew**
- Email: sahanamathew2000@gmail.com
- Phone: +91 8792222517
- LinkedIn: [sahana-mathew](https://linkedin.com/in/sahana-mathew)
- Location: Bengaluru, Karnataka, India

---

**Built with ❤️ by Sahana Mathew** | Last Updated: January 2025
