# ⚒️ ForgeShare | The Artisan Guild Rental Platform

**ForgeShare** is a high-authority, industrial-grade brutalist platform designed for the physical-to-digital handover of artisanal tools. It serves as a premium marketplace for makers, craftsmen, and guilds to share high-end gear with a seamless, professional workflow.

---

## 🏛️ System Architecture
ForgeShare is built as a decoupled Full-Stack application, ensuring high performance, real-time interactivity, and cinematic user experiences.

```text
ForgeShare/
├── frontend/        # React 19 + Vite + Tailwind 4.0 (The Interface)
└── backend/         # Node.js + Express + MongoDB + Socket.io (The Engine)
```

---

## 🎨 Frontend (The Interface)
The interface follows a **Brutalist-Industrial aesthetic**, focusing on raw authority and kinetic motion.

- **Tech Stack:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS 4.0](https://tailwindcss.com/), [GSAP](https://greensock.com/gsap/), [Framer Motion](https://www.framer.com/motion/).
- **Key Features:**
    - **Cinematic Marketplace:** Vertical responsive stack for discovering high-end gear.
    - **Industrial Action Terminal:** Robust booking UI with lifecycle status handshakes.
    - **Editorial Content:** Integrated "Maker Stories" and "The Craft" sections.
    - **Adaptive Onboarding:** Multi-step identity verification and profile building.

---

## ⚙️ Backend (The Engine)
A robust RESTful API with real-time capabilities to power the rental lifecycle.

- **Tech Stack:** Node.js, Express, MongoDB ([Mongoose](https://mongoosejs.com/)), [Socket.io](https://socket.io/), [Cloudinary](https://cloudinary.com/), [Nodemailer](https://nodemailer.com/).
- **Key Features:**
    - **Real-time Lifecycle:** Live status updates for tool handovers (Lent -> Received -> Returned).
    - **Secure Auth:** JWT-based sessions with Bcrypt protection and password recovery.
    - **Media Engine:** Automated industrial image processing via Multer + Cloudinary.
    - **Email Infrastructure:** Automated security alerts and rental notifications.
    - **Admin Suite:** Comprehensive endpoints for user and content moderation.

---

## 🚀 Full-Stack Features
- **Physical-to-Digital Handover:** A secure handshake protocol for physical gear rental tracking.
- **Artisan Ecosystem:** Centralized profile management for lenders and borrowers.
- **Trust & Safety:** Integrated insurance flows, rental agreements, and safety documentation.
- **Industrial Dashboard:** Real-time analytics and management for admins.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- MongoDB Instance (Local or Atlas)
- Cloudinary API Credentials

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd Project_1
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env and configure MONGO_URI, JWT_SECRET, CLOUDINARY_URL, etc.
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Create .env and configure VITE_API_URL
   npm run dev
   ```

---

## 📜 License
© 2026 ForgeShare. All Rights Reserved. Built for the modern artisan.
