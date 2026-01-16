## MR Orbit Studio

A modern, single-page portfolio website built with React and Firebase. Features dark mode, smooth scrolling, and fully customizable content through JSON files.

**🌐 Live Site:** [View Live](https://mr-orbit-studio.web.app/)

### Tech Stack

- React 19
- React Bootstrap
- Firebase (Hosting & Analytics)
- Bootstrap 5

### Setup

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm start
```

The app will open at `http://localhost:3000`

### Available Scripts

- `pnpm start` - Start development server
- `pnpm run build` - Build for production
- `pnpm run deploy` - Build and deploy to Firebase
- `pnpm run format` - Format code with Prettier

### Customize Content

Edit the JSON files in `src/data/` to update your portfolio:

- `site.json` - Site branding and navigation
- `profile.json` - Profile information
- `resume.json` - Work experience and resume
- `personal.json` - Personal details
- `projects.json` - Portfolio projects

### Deploy

Build and deploy to Firebase Hosting:

```bash
pnpm run deploy
```

Make sure Firebase is configured and you're logged in with `firebase login`.
