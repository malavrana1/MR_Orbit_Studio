## MR Orbit Studio — Frontend Portfolio

A clean, single-page portfolio built with React and deployed on Firebase.

### Features
- Sticky header with smooth scrolling
- Dark mode toggle
- Sections: Summary, Experience, Projects, Toolkit, Certifications, Education, Connect
- Content in JSON files
- Responsive design
- Analytics tracking with Firebase

### Tech Stack
- React 19, React-Bootstrap 2, React Icons 5, React Typed 2
- Bootstrap 5
- Firebase Hosting, Firebase Analytics, Firestore
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

### Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
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

### CI/CD

GitHub Actions workflow automatically builds and deploys to Firebase Hosting on push to `main` branch. Ensure GitHub Secrets are configured for automated deployment.

### Customize

Edit JSON files in `src/data/`:
- `site.json` - Brand and navigation
- `profile.json` - Profile info
- `resume.json` - Resume/Experience
- `personal.json` - Personal section
- `projects.json` - Projects

### License

Copyright © 2024 MR Orbit Studio. All rights reserved.
