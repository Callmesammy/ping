# PING — Spontaneous Linkup Engine 🍸🔥

> **Zero Agendas. Pure Vibes. 1-Click Squad Decisions.**  
> Built with **React 19**, **Vite**, **TypeScript**, **GSAP ScrollTrigger**, **Framer Motion**, **Socket.io WebSockets**, **Express**, and **Neon Serverless PostgreSQL**.

---

## 🌟 Overview

**PING** is a high-octane, spontaneous social planning application designed for squads who prefer fast linkups over 500-message group chat debates. Drop one magic link into WhatsApp or iMessage, let your crew vote live on venue spots and time slots, and lock in your night automatically.

---

## ✨ Features

- **⚽ Football Bounce & Zoom Reveal Preloader**: High-impact introductory animation with shockwave ring and camera zoom-in reveal (`Preloader.tsx`).
- **⚔️ Blacksmith Anvil Iron Clash Navigation Menu**: Full-screen dual anvil slamming overlay featuring center lightning cut-out, WhatsApp QR code card, and 1-click smooth section scrolling (`NavigationMenuDrawer.tsx`).
- **🤖 Instant AI Squad Curator (`@PingAI`) & Live Chat**: Real-time group chat & direct DMs powered by Socket.io WebSockets and sub-500ms AI responses (`LiveChatDrawer.tsx`).
- **👤 Tokenless Auth & Handle Switcher**: Fast local profile switcher (`@alex_vibe`, `@sara`, `@marcus`) with custom avatar selection (`AuthModal.tsx`).
- **📊 Real-Time Voting Engine & Map Radar**: Interactive venue voting with live leader badges, time-slot consensus, and interactive venue pins (`VotingRoom.tsx`).
- **🎭 Editorial Sunset & Warm Earth Aesthetics**: Curated design system incorporating Warm Crimson (`#C84B31`), Soft Peach (`#F9F1F0`), Sage Emerald (`#2D5D4B`), Mustard Gold (`#E89A3C`), and Deep Plum (`#4A154B`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Animation & Motion** | GSAP 3 (ScrollTrigger) + Framer Motion 12 + Lenis Smooth Scroll |
| **Styling & System** | TailwindCSS + Custom CSS Design Tokens |
| **Real-Time Layer** | Socket.io WebSockets + Node.js Express API |
| **Database Layer** | Neon Serverless PostgreSQL (`@neondatabase/serverless`) + Drizzle ORM |
| **Icons & Branding** | Lucide React + Custom Vector SVG Logo (`PingLogoSvg.tsx`) |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/Callmesammy/ping.git
cd ping
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory (copied from `.env.example`):

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Express API Port
PORT=3001

# Frontend API Endpoint
VITE_API_URL=http://localhost:3001

# Neon Serverless PostgreSQL Database (Optional for persistent DB storage)
DATABASE_URL=postgresql://username:password@ep-cool-name.us-east-2.aws.neon.tech/pingdb?sslmode=require
```

### 4. Running Locally

Launch both the Vite dev server and the WebSocket Express backend server concurrently:

```bash
npm run dev:all
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API & WebSockets**: `http://localhost:3001`

---

## 🛡️ Security & Environment Isolation

All secret environment variables (`DATABASE_URL`, API keys) are strictly protected in `.env.local` and excluded from version control via `.gitignore`:

```gitignore
# Protected Environment Files
.env*
```

---

## 📐 Project Architecture

```
ping/
├── public/
│   ├── favicon.svg             # Custom Vector SVG Logo Favicon
│   └── pics/                   # High-res unsplash photography assets
├── server/
│   └── index.ts                # Express API + Socket.io + Neon PostgreSQL
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx       # Handle & Session Profile Switcher
│   │   ├── CreatePingModal.tsx # 1-Click Ping Creation Modal
│   │   ├── ExpertisesSection.tsx # Pinned 3D Card Toss Deck (GSAP)
│   │   ├── FaqSection.tsx      # Smooth Animated Accordion
│   │   ├── Footer.tsx          # Tilted Contact Card & Giant Logo
│   │   ├── Hero.tsx            # Pinned Card Transition Hero (GSAP)
│   │   ├── InviteModal.tsx     # 1-Click Link Copy & QR Code Modal
│   │   ├── JourneyScroller.tsx # 6-Card Horizontal Track (GSAP)
│   │   ├── LiveChatDrawer.tsx  # Sub-500ms AI Curator Chat & Direct DMs
│   │   ├── Navbar.tsx          # Fixed Top Navigation Bar
│   │   ├── NavigationMenuDrawer.tsx # Blacksmith Anvil Iron Clash Overlay
│   │   ├── PingLogoSvg.tsx     # Vector SVG Brand Logo Component
│   │   ├── Preloader.tsx       # Football Bounce & Zoom Preloader
│   │   ├── SmoothScrollProvider.tsx # Lenis Smooth Scroll Wrapper
│   │   ├── VotingRoom.tsx      # Real-Time Venue Voting & Live Map
│   │   └── WhyChoosePing.tsx   # Pinned 3D Card Flip Section (GSAP)
│   ├── context/
│   │   └── AuthContext.tsx     # Tokenless Auth State Management
│   ├── lib/
│   │   ├── api.ts              # REST API Client Helpers
│   │   └── socket.ts           # Socket.io Client Connection
│   ├── App.tsx                 # Root Component Assembly
│   └── main.tsx                # Application Entrypoint
├── .env.example                # Environment Variable Template
├── .env.local                  # Local Environment Variables
├── package.json
└── README.md
```

---

## 📜 License

Licensed under the [MIT License](LICENSE). Built for spontaneous squad linkups.
