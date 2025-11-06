## Orbit — Frontend Portfolio

A clean, single‑page portfolio built with React.

### Features
- Sticky header with smooth scrolling
- Sections: Summary, Toolkit, Experience, Education, Featured Project, About, Personal, CTA
- Content in JSON (no code needed for copy changes)

### Tech
- React 16, React‑Bootstrap, React Icons, React Typed

### Run
```bash
pnpm install
pnpm start
```

### Build
```bash
pnpm run build
```

### Customize
- Brand and nav: `src/data/site.json`
- Content: `src/data/profile.json`, `src/data/resume.json`, `src/data/personal.json`, `src/data/site.json`

### Key files
- `src/components/Header.js`
- `src/components/pages/LandingPage.js`
- `src/css/Header.css`, `src/css/LandingPage.css`
