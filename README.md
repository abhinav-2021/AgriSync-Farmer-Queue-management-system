# AgriSync - Smart Agricultural Procurement & Queue Management System

**AgriSync** is a production-grade, real-time web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase Realtime**.

---

## 🏛️ Ecosystem Portals & Public Landing Page

AgriSync features a unified public-facing front-end and a secure routing hub connecting 3 distinct user roles:

```
                                  ┌─────────────────────────────┐
                                  │   AgriSync Public Landing   │
                                  │  (How It Works & Routing)   │
                                  └──────────────┬──────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │                             │                             │
                   ▼                             ▼                             ▼
        ┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
        │    Farmer Portal    │       │     Mandi Desk      │       │ State Admin Master  │
        │ • Slot Booking      │       │ • Call Next Token   │       │ • 142 Mandi Metrics │
        │ • Live QR Gate Pass │       │ • Moisture Lab Test │       │ • 7-Day Bar Chart   │
        │ • Real-time Stepper │       │ • Weighbridge Gross │       │ • Congestion Alerts │
        │ • Direct DBT Status │       │ • DBT Disbursal Log │       │ • Dynamic Quotas    │
        └─────────────────────┘       └─────────────────────┘       └─────────────────────┘
```

---

## 🌟 Public Landing Page Features

1. **Navigation & Hero Section**:
   - Headline: *"End the Wait. Streamline Procurement."*
   - Subheadline: *"India's unified digital queue system for smart Mandis. Connecting farmers, operators, and state admins in real-time."*
   - Interactive Live Mockup & Real-Time Aggregated Statistics: 142 Mandis, 45,210+ Farmers, 1.2M Qtl, ₹2.1B DBT funds.
2. **How It Works (4-Step Seamless Timeline)**:
   - **Step 1: Register** (`Smartphone`) — Book a slot from home.
   - **Step 2: Get Token** (`Ticket`) — Receive a live digital queue number.
   - **Step 3: Arrive** (`Truck`) — Enter the Mandi precisely when called.
   - **Step 4: Get Paid** (`Banknote`) — Transparent weighing and instant DBT.
3. **Portal Access Routing Hub**:
   - 3 distinct, interactive role cards with dedicated authentication forms:
     - **For Farmers**: Mobile phone login with OTP and 1-click demo profiles.
     - **For Mandi Operators**: Mandi ID & password authentication for APMC terminal.
     - **For State Admins**: Government Officer ID & department authentication for State Directorate.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.
