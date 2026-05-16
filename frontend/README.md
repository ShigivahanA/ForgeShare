# ⚒️ ForgeShare | The Artisan Guild Rental Platform

**ForgeShare** is a high-authority, industrial-grade brutalist interface designed for the physical-to-digital handover of artisanal tools. It serves as a premium marketplace for makers, craftsmen, and guilds to share high-end gear with a seamless, professional workflow.

---

## 🏗️ Design Philosophy
The frontend is built with a **Brutalist-Industrial aesthetic**, focusing on raw authority, cinematic transitions, and high-impact layouts. It avoids the "generic SaaS" look in favor of a bespoke, artisanal retail experience.

## 🚀 Key Features
- **Cinematic Marketplace:** A vertical responsive stack for discovering high-end artisanal gear.
- **Industrial Action Terminal:** A robust booking system with status handshakes for "returned" and "completed" states.
- **Maker Stories:** A dedicated editorial section highlighting community members and "The Craft".
- **Admin Command Center:** High-level dashboard for managing users, content, and tool listings.
- **Adaptive Onboarding:** Multi-step identity verification and profile professionalization.
- **Wishlist & History:** Personal gear archives and rental lifecycle tracking.

## 🛠️ Tech Stack
- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) (Ultra-modern industrial tokens)
- **Motion:** [GSAP](https://greensock.com/gsap/) & [Framer Motion](https://www.framer.com/motion/) for kinetic transitions.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **API:** Axios with centralized service architecture.

## 📂 Architecture
```text
src/
├── components/      # Atomic UI modules (Navbar, Footer, Modals)
│   ├── auth/        # Authentication-specific components
│   ├── landing/     # Hero and marketing sections
│   └── marketplace/ # Gear cards and search filters
├── pages/           # High-level views (Profile, Marketplace, Admin)
├── services/        # API wrapper and backend integration
├── context/         # Global state (Auth, User Session)
└── assets/          # Brand identity and cinematic media
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if required) and add your backend API URL.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment
The project is configured for seamless deployment on **Vercel** or **Netlify**.
```bash
npm run build
```

---

## 📜 License
© 2026 ForgeShare. All Rights Reserved. Built for the modern artisan.
