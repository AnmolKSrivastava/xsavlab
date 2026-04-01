# Team Profile Images

This folder contains profile images for the About section team members.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 256x256px (square)
- **File Naming**: Use descriptive names (e.g., `john-doe.jpg`, `jane-smith.png`)
- **Max File Size**: Keep under 500KB for optimal loading

## Usage

Add team member profile images here and reference them in `About.jsx`:

```javascript
const team = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: require('../../assets/images/team/john-doe.jpg'),
    // ... other properties
  },
];
```

## Current Team Members

Add your team profile images to this folder:
- `ceo-profile.jpg` (or your CEO's image)
- `cto-profile.jpg` (or your CTO's image)
- `lead-engineer-profile.jpg` (or your Lead Engineer's image)

## Placeholder

If no image is provided, the About component will show a Shield icon placeholder.
