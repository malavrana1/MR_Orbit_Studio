## MR Orbit Studio — Frontend Portfolio

A clean, single-page portfolio built with React and deployed on Firebase.

### Features
- Sticky header with smooth scrolling
- Dark mode toggle with persistent theme preference
- Sections: Summary, Experience, Projects, Toolkit, Certifications, Education, Connect
- Content in JSON (no code needed for copy changes)
- Interactive contact modal with email form
- Responsive design with modern UI

### Tech
- React 16, React-Bootstrap, React Icons, React Typed
- Firebase Hosting

### Run
```bash
pnpm install
pnpm start
```

### Build
```bash
pnpm run build
```

### Deploy
```bash
pnpm run deploy
```
Deploys to Firebase Hosting at https://mrorbit.web.app

### Customize
- Brand and nav: `src/data/site.json`
- Content: `src/data/profile.json`, `src/data/resume.json`, `src/data/personal.json`, `src/data/projects.json`

### Key files
- `src/components/Header.js`
- `src/components/Footer.js`
- `src/components/ContactModal.js`
- `src/components/pages/LandingPage.js`
- `src/css/Header.css`, `src/css/LandingPage.css`, `src/css/LandingPage.dark.css`, `src/css/Footer.css`

### Contact
- Email modal uses FormSubmit (no backend).
- Change recipient in `src/components/Footer.js` → `ContactModal toEmail`.
- First send triggers FormSubmit verification; then emails deliver normally.
