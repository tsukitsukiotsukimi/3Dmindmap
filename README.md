# 3D MindMap

A browser-based 3D mind mapping application. Create, organize, and explore mind maps in three-dimensional space.

Built with React, TypeScript, React Three Fiber, and Zustand.

## Features

- 3D visualization of mind map nodes with orbit controls (rotate/zoom/pan)
- Tree-structured nodes with parent-child relationships
- Add, edit, delete nodes
- Collapse/expand subtrees
- Left outline panel for 2D tree navigation
- Right inspector panel for node editing
- Deterministic radial auto-layout
- LocalStorage auto-save
- JSON import/export
- GitHub Pages deployment

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173/3Dmindmap/ in your browser.

### Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on push to `main`.

### Manual Setup

1. Go to your repository **Settings** > **Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` branch — the workflow will build and deploy automatically

The app will be available at `https://<username>.github.io/3Dmindmap/`

## Tech Stack

- **Vite** — Build tool
- **React** — UI framework
- **TypeScript** — Type safety
- **React Three Fiber** — 3D rendering
- **@react-three/drei** — 3D helpers
- **Zustand** — State management
- **Zod** — Data validation

## License

MIT
