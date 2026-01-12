## MR Orbit Studio — Frontend Portfolio

A clean, single-page portfolio built with React and deployed on Firebase.

### Features
- Sticky header with smooth scrolling
- Dark mode toggle
- Sections: Summary, Experience, Projects, Toolkit, Certifications, Education, Connect
- Content in JSON files
- Responsive design

### Tech Stack
- React 19, React-Bootstrap 2, React Icons 5, React Typed 2
- Bootstrap 5
- Firebase Hosting
- pnpm

### Setup

Install pnpm:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.zshrc
```

Install dependencies:
```bash
pnpm install
```

Start development server:
```bash
pnpm start
```

### Build & Deploy

```bash
pnpm run build
pnpm run deploy
```

### Customize

Edit JSON files in `src/data/`:
- `site.json` - Brand and navigation
- `profile.json` - Profile info
- `resume.json` - Resume/Experience
- `personal.json` - Personal section
- `projects.json` - Projects

### License

Copyright © 2024 MR Orbit Studio. All rights reserved.
