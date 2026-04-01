# Theme System Guide

## 🎨 100% Theme Coverage Achieved!

This website now has **complete theme centralization** - every color, font, animation, and style element is controlled from a single file: `src/config/theme.js`

**What's Covered:**
- ✅ All component colors (primary, secondary, dark, navy)
- ✅ Typography (fonts, sizes, weights)
- ✅ Button styles (primary, secondary, hover states)
- ✅ Navigation bar styling
- ✅ Card component styling
- ✅ Animations (float, glow keyframes)
- ✅ Mobile bottom bar gradients
- ✅ Shadows, borders, transitions
- ✅ Spacing and layout

**Change your entire website theme by editing ONE line!**

---

## Quick Start: Changing Themes

To change your website's theme, simply edit **ONE file**: `src/config/theme.js`

### Change Line 273:
```javascript
// FROM:
export const theme = themes.current;

// TO (for Neural Network theme):
export const theme = themes.neuralNetwork;

// OR (for Cyberpunk theme):
export const theme = themes.cyberpunk;

// OR (for Deep Space theme):
export const theme = themes.deepSpace;

// OR (for Quantum Computing theme):
export const theme = themes.quantumComputing;
```

That's it! Your entire website will update automatically.

---

## Available Themes

### 1. **Corporate Balanced** (Current/Default)
- **Primary Color:** Cyan (#00D4FF)
- **Secondary Color:** Purple (#7B61FF)
- **Best For:** Professional, enterprise clients
- **Font:** Inter (modern sans-serif)

### 2. **Neural Network**
- **Primary Color:** Purple (#667EEA)
- **Secondary Color:** Violet (#764BA2)
- **Best For:** AI-focused, futuristic branding
- **Font:** Space Grotesk (geometric tech font)

### 3. **Cyberpunk Tech**
- **Primary Color:** Neon Cyan (#00FFFF)
- **Secondary Color:** Hot Pink (#FF006E)
- **Best For:** Bold, cutting-edge positioning
- **Font:** Orbitron (sci-fi style)

### 4. **Deep Space**
- **Primary Color:** Violet (#8B5CF6)
- **Secondary Color:** Indigo (#6366F1)
- **Best For:** Space exploration, cosmic/astronomy branding
- **Font:** Rajdhani (space-age headings) + Inter

### 5. **Quantum Computing**
- **Primary Color:** Quantum Blue (#667EEA)
- **Secondary Color:** Violet (#764BA2)
- **Accent Color:** Silver (#C0C0C0)
- **Best For:** Next-gen, quantum tech, future-focused positioning
- **Font:** Poppins (modern, clean)
- **Special Features:** Particle wave animations, quantum pulse effects, iridescent gradients, wave interference patterns

---

## Creating Custom Themes

### Option 1: Modify Existing Theme
Edit the theme object in `src/config/theme.js`:

```javascript
current: {
  colors: {
    primary: '#YOUR_COLOR',    // Change this
    secondary: '#YOUR_COLOR',  // And this
    // ... other properties
  }
}
```

### Option 2: Add New Theme
1. Copy an existing theme object in `src/config/theme.js`
2. Rename it (e.g., `myCustomTheme`)
3. Modify the colors and settings
4. Activate it: `export const theme = themes.myCustomTheme;`

---

## Theme Properties Reference

### Colors
- `primary` - Main brand color (buttons, links, accents)
- `secondary` - Secondary accent color
- `dark` - Dark background color
- `darkNavy` - Darker navy background
- `success` - Success/positive states
- `warning` - Warning states
- `danger` - Error/danger states
- `info` - Information states

### Typography
- `fontFamily.heading` - For headings (h1, h2, etc.)
- `fontFamily.body` - For body text
- `fontFamily.mono` - For code/technical text
- `fontSize` - All text sizes (xs to 6xl)
- `fontWeight` - Font weights (normal to extrabold)

### Components
- `navbar` - Navbar styling
- `card` - Card component styling
- `button` - Button styling (primary & secondary)
- `mobileBottomBar` - Mobile bottom action bar gradients (call, chat, book buttons)

### Effects
- `borderRadius` - Corner roundness
- `shadow` - Drop shadows and glows
- `blur` - Blur effects
- `transition` - Animation speeds
- `animations` - Keyframe animations (float, glow)

---

## Advanced: Google Fonts

To use custom fonts from new themes:

1. **Add to** `public/index.html`:
```html
<!-- For Neural Network theme -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- For Cyberpunk theme -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Exo+2:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. **Update** `src/config/theme.js` - Already done! Just uncomment the theme.

---

## Deployment After Theme Change

After changing the theme:

```bash
# Build to see changes locally
npm run build

# Or start dev server
npm start

# Deploy to Firebase (if you've pushed to GitHub, it deploys automatically)
git add .
git commit -m "Change theme to Neural Network"
git push origin main
```

Your CI/CD pipeline will automatically rebuild and deploy!

---

## Tips

✅ **Test locally first:** Run `npm start` to preview changes
✅ **One file to rule them all:** Only edit `src/config/theme.js`
✅ **All Tailwind classes update:** Colors like `bg-primary`, `text-secondary` update automatically
✅ **Custom components:** Import theme if needed: `import { theme } from './config/theme';`

---

## Need Help?

- Theme not applying? Try `npm run build` again
- Want a custom color? Just edit the hex code in `theme.js`
- Creating a new theme? Copy-paste an existing one and modify

**Remember:** The entire website theme is controlled from ONE file: `src/config/theme.js`
