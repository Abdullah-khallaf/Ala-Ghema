# على غيمة ☁️ — Interactive Q&A Board Game

A fun, cloud-themed question-and-answer board game for two players on a single device. Built with React + JSX (no TypeScript, no external UI libraries).

## 🎮 Features

- **Local Two-Player Gameplay**: Both players on one device with handoff screen between turns
- **Interactive Board**: 4×5 grid (20 squares) with snake/ladder jump mechanics
- **Question System**: Admin adds 5-20 questions with "important" flag markers
- **Turn Management**: Strict alternating turns with question answering, skipping, or turn passing
- **localStorage Persistence**: Game state saved locally
- **Arabic-First**: Full RTL support, all UI in Arabic
- **Dreamy Design**: Soft sky blues, gentle animations, cloud theme

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### Installation

```bash
cd ala-ghema
npm install
```

### Run Development Server

```bash
npm start
```

The app opens at `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
```

Creates an optimized build in the `build/` folder.

## 📋 Game Flow

1. **Setup Phase**: Admin sets PIN, adds 5-20 questions, marks up to 5 as important
2. **Playing Phase**: Players take turns rolling dice, landing on squares, and answering questions
3. **Question Modal**: When landing on a question square:
   - Click **تم الإجابة ✓** to mark answered
   - Click **تخطى** to skip (question remains for other players)
4. **Handoff Screen**: Between turns, full-screen overlay prevents board viewing
5. **Win Condition**: First player to reach square 20 wins

## 📁 Project Structure

```
ala-ghema/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx              # Main game orchestrator
│   ├── index.jsx            # React root entry
│   ├── App.css              # App layout styles
│   ├── constants/
│   │   └── board.js         # Board layout, jumps, helpers
│   ├── context/
│   │   └── GameContext.jsx  # Global state + reducer
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useDice.js
│   ├── components/
│   │   ├── Board/           # Board grid + squares
│   │   ├── Players/         # Player tokens
│   │   ├── Dice/            # Dice rolling UI
│   │   ├── QuestionPanel/   # Question modal + handoff
│   │   ├── QuestionLog/     # Answered questions panels
│   │   ├── AdminPanel/      # Setup UI
│   │   └── UI/              # Reusable components (TODO)
│   ├── utils/
│   │   ├── shuffle.js       # Fisher-Yates algorithm
│   │   └── boardHelpers.js  # Question assignment, getters
│   └── styles/
│       ├── globals.css      # Global typography, colors
│       └── variables.css    # CSS custom properties
└── package.json
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#6b8dff` — Player 1, accents
- **Pink**: `#ff85a1` — Player 2
- **Yellow**: `#ffe566` — Jump squares
- **Background**: Gradient `#f0f6ff` → `#ffffff`

### Typography
- **Title Font**: Pacifico (cursive, dreamy)
- **Body Font**: Cairo (Arabic-optimized sans-serif)

### Components
All styled with CSS files (no Tailwind, no styled-components).

## 🎯 Game Rules

- **Board**: 4×5 zigzag grid (1-20 squares)
- **Snakes & Ladders**: 6 jump pairs (yellow squares), auto-trigger on landing
- **Questions**: Randomly distributed across non-jump squares
- **Answering**: Click "تم الإجابة" or "تخطى" on modal
- **Skipping**: Does NOT mark question as answered (stays available)
- **Turn Pass**: Automatic after answering, skipping, or landing on empty square
- **Win**: First to reach square 20

## 🔐 Admin Panel

- **PIN Setup**: 4-digit PIN (shown as "تعيين PIN")
- **Question Input**: Text + "مهم" (important) checkbox
- **Max Questions**: 20 total, 5 important max
- **Game Start**: "ابدأ اللعبة" button assigns questions to random squares

## 💾 localStorage Schema

```js
// "ala_ghema_questions"
[ { id, text, isImportant, squareIndex, answeredBy }, ... ]

// "ala_ghema_gameState"
{ currentTurn, positions, diceValue, phase, winner }

// "ala_ghema_adminPin"
"1234"
```

## 🎬 Animations

- **Token Move**: CSS transition 0.5s ease
- **Dice Roll**: Spin animation 0.5s
- **Square Pulse**: Glow animation on unanswered questions
- **Modal Slide**: Slide-up from bottom
- **Handoff Bounce**: Emoji bounce animation

## 🔮 Future Enhancements

- [ ] Two-device sync via WebSocket
- [ ] Real-time game state API
- [ ] Admin authentication (JWT)
- [ ] Customizable jump pairs (admin UI)
- [ ] Sound effects (Web Audio API)
- [ ] Player names/avatars
- [ ] Game statistics & replays
- [ ] Difficulty levels

## 📝 Implementation Notes

### No External UI Libraries
All components built from scratch using semantic HTML and CSS Grid/Flexbox.

### React Context + useReducer
Single global state machine for game logic, no prop drilling.

### localStorage Only
No backend or API calls in v1.0. All state persists locally.

### Scalable Architecture
Comments throughout indicate future WebSocket/API integration points.

### Arabic-First
All UI text in Arabic. Development comments in English for team clarity.

## 🤝 Development

### Code Style
- Functional components + hooks only
- Pure functions where possible
- Descriptive variable names (English for logic, Arabic for UI)

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 📄 License

MIT

---

**Version**: 1.0 — Single Device, localStorage, Two Players  
**Next**: Two-device sync, real-time backend, accounts
