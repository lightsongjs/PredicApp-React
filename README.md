# PredicApp React - Orthodox Sermon Audio Streaming

A lightweight, modern React web application for streaming Orthodox sermon audio content.

## Features

- 🎧 Stream Orthodox sermons with a beautiful, Byzantine-inspired UI
- 🎨 Byzantine Modern design with burgundy and gold color scheme
- 📱 Fully responsive mobile-first design
- 🎵 HTML5 Audio API with playback controls
- ⏩ Skip forward/backward 15 seconds
- 🔊 Volume control
- 📊 Progress tracking
- 🔗 Share sermon links

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **HTML5 Audio API** - Audio playback

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
PredicApp-React/
├── public/
│   └── images/              # Images and icons
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Header, Layout, BottomNav
│   │   ├── sermon/          # Sermon cards and lists
│   │   ├── player/          # Audio player components
│   │   └── common/          # Shared components
│   ├── pages/               # Route pages
│   │   ├── Home.tsx         # Homepage with featured sermon
│   │   ├── Player.tsx       # Full-screen audio player
│   │   ├── Library.tsx      # Sermon library
│   │   └── NotFound.tsx     # 404 page
│   ├── data/                # Data and types
│   │   ├── sermons.ts       # Sermon data
│   │   └── types.ts         # TypeScript interfaces
│   ├── hooks/               # Custom React hooks
│   │   ├── useAudio.ts      # Audio playback hook
│   │   └── useSermon.ts     # Sermon data hook
│   ├── utils/               # Utility functions
│   │   └── formatTime.ts    # Time formatting utilities
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Available Sermons

Currently featuring 4 February 2026 Triodion sermons:

1. **Duminica Vameșului și Fariseului** (Feb 1, 2026)
2. **Duminica Fiului Risipitor** (Feb 8, 2026)
3. **Duminica Înfricoșătoarei Judecăți** (Feb 15, 2026)
4. **Duminica Iertării** (Feb 22, 2026)

All sermons are hosted on Cloudflare R2.

## Design Guidelines

### Color Palette (Byzantine Modern)

- **Primary**: #8B1E3F (Burgundy)
- **Primary Dark**: #6B1730
- **Accent**: #D4AF37 (Gold)
- **Background**: #F0F4F8
- **Text**: #4B3621
- **Card**: #FFFFFF

### Typography

- **Headings**: Georgia serif
- **Body**: System UI sans-serif

### UI Patterns

- 16px border radius on cards
- Subtle shadows (0 2px 8px rgba(0,0,0,0.1))
- Orthodox cross icon on player
- Gold accent highlights
- Touch-friendly 44x44px minimum tap targets

## Development

The application uses Vite for fast development with Hot Module Replacement (HMR).

### Key Components

- **AudioPlayer** - Full-screen modal player with controls
- **HeroSermonCard** - Featured sermon card on homepage
- **SermonCard** - Compact sermon list item
- **ProgressBar** - Draggable audio progress bar
- **PlayerControls** - Play/pause, skip, shuffle, repeat controls

### Custom Hooks

- **useAudio** - Manages HTML5 Audio API, playback state, and controls
- **useSermon** - Retrieves sermon data by ID

## Deployment

Ready for deployment to Cloudflare Pages or any static hosting provider.

### Build

```bash
npm run build
```

The `dist/` folder contains the production-ready static files.

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Deploy

## Future Enhancements

- [ ] Offline support (PWA)
- [ ] Search and filter functionality
- [ ] Playlist/queue management
- [ ] Favorites/bookmarks
- [ ] Playback speed control
- [ ] Download for offline listening
- [ ] Extended sermon library
- [ ] Liturgical calendar integration
- [ ] Android app (React Native or Capacitor)

## License

Copyright © 2026 PredicApp. All rights reserved.

## Contact

For questions or feedback about this application, please contact the development team.
