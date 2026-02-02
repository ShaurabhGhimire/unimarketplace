# College Student Marketplace 📱🎓

A **college-verified mobile marketplace** where students can safely buy and sell items with other students. Built as a **Software Engineering Capstone Project** with real-world startup potential, focused on trust, locality, and ease of use — especially for graduating and international students.

---

## 🚀 Problem Statement

Students frequently move in and out of apartments and need a safe way to buy and sell second-hand items such as furniture, electronics, books, and household goods.

Existing platforms like Facebook Marketplace and Craigslist:

* Are open to everyone → high scam risk
* Lack college-specific filtering
* Are not designed for student move-out cycles

There is a clear need for a **college-only, trusted resale platform**.

---

## 💡 Solution Overview

This project delivers a **mobile app built with React Native (Expo)** that allows:

* Only **verified college students** to join (via `.edu` email)
* Listings to be organized by **college and proximity**
* Safe in-app messaging
* A dedicated **Move-Out Mode** for graduating students

The platform combines the simplicity of Craigslist with the familiarity of Facebook Marketplace — optimized for campuses.

---

## 🧑‍🤝‍🧑 Team

* **Prashamsa** — Product Manager (PM)
* **Saurav Ghimire** — UI/UX & Frontend (React Native / Expo)
* **Bijay** — Backend Engineer (Node.js + TypeScript)
* **Philemon** — Backend Engineer (Node.js + TypeScript)

---

## 🛠 Tech Stack

### Frontend (Mobile)

* React Native (Expo)
* TypeScript
* React Navigation

### Backend

* Node.js
* TypeScript
* Express.js
* JWT Authentication

### Database

* PostgreSQL or MongoDB (TBD)

### DevOps / Tools

* GitHub
* Jira (Scrum, 1-week sprints)
* Postman (API testing)

---

## ✨ Core Features (MVP)

### 🔐 Authentication & Verification

* Signup/Login with `.edu` email
* JWT-based authentication
* College selection during onboarding

### 🏪 Marketplace Listings

* Create, edit, delete listings
* Upload images
* Categories (furniture, electronics, books, etc.)
* Mark items as sold

### 🔍 Browse & Search

* Browse listings by college
* Filter by category and price
* Search by keyword

### 💬 In-App Messaging

* Secure buyer–seller chat per listing
* Auto-close chat when item is sold

### 🧳 Move-Out Mode (Differentiator)

* Toggle “Moving Out” status
* Bulk listing creation
* Countdown badges on listings
* Automatic listing expiration

### 🛡 Trust & Safety

* Report and block users
* Basic admin moderation tools

---

## 🧱 Project Structure (High-Level)

```
root/
├── mobile-app/        # Expo React Native app
├── backend/           # Node.js + TypeScript API
├── docs/              # Architecture, diagrams, notes
└── README.md
```

---

## 🧪 Development Methodology

* **Agile Scrum**
* **1-week sprints**
* Sprint Planning, Daily Standups, Review, Retrospective
* All tasks tracked in **Jira**

---

## 📦 Getting Started (Local Development)

### Prerequisites

* Node.js (>= 18)
* npm or yarn
* Expo CLI

### Frontend (Expo App)

```bash
cd mobile-app
npm install
npx expo start
```

### Backend (API)

```bash
cd backend
npm install
npm run dev
```

---

## 📈 Future Enhancements

* Mobile payments & escrow
* Advanced scam detection
* AI-based price suggestions
* Delivery & donation integrations
* Public launch across multiple campuses

---

## 🎓 Academic Context

This project is developed as part of a **Software Engineering Undergraduate Capstone**, emphasizing:

* Full-stack system design
* Agile development practices
* Real-world usability and scalability

---

## 📄 License

This project is for academic and prototype purposes. Licensing to be defined if commercialized.

---

> Built by students, for students — with real problems in mind.
