# 🌍 Traveloop: Your Ultimate Travel Adventure Ecosystem

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)](https://www.prisma.io/)

**Traveloop** is a comprehensive, multi-platform travel planning and management system designed to streamline every aspect of your journey—from initial inspiration to the final expense report.

---

## 🚀 Architecture Overview

Traveloop is built as a modern full-stack ecosystem consisting of four primary modules:

1.  **[Traveloop Backend (API)](./traveloop-backend)**: A high-performance NestJS API powered by Prisma ORM, providing secure data management and business logic.
2.  **[Traveloop Mobile](./traveloop-mobile)**: A sleek Expo-based mobile application for on-the-go trip management, real-time updates, and native interactions.
3.  **[Traveloop Web Demo](./traveloop-demo)**: A responsive Next.js web application showcasing the platform's features with smooth animations and intuitive UX.
4.  **[UI Generator](./stitch_dynamic_android_ui_generator)**: A dynamic Android UI generation tool used for prototyping and rapid UI development.

---

## ✨ Key Features

### 📅 Trip Planning & Itinerary Building
-   Create detailed multi-day trips with custom banner images.
-   Build complex itineraries with specific stops and timed activities.
-   Organize your journey into sections with distinct budget allocations.

### 💰 Budget & Expense Management
-   Track expenses per activity or trip section.
-   Generate professional expense invoices and billing reports.
-   Real-time budget tracking to keep your travel costs in check.

### 📝 Packing & Documentation
-   Dynamic packing checklists with completion ratios.
-   Categories for Documents, Clothing, Electronics, and more.
-   Secure storage for trip notes and adventure journals.

### 👥 User Ecosystem
-   Secure JWT-based authentication (Login/Registration).
-   User profiles with customizable travel preferences.
-   Admin panel for user management and travel analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | NestJS, TypeScript, Prisma, Passport (JWT), Swagger, PostgreSQL |
| **Mobile** | React Native, Expo, Expo Router, Reanimated, Lucide Icons |
| **Web** | Next.js 16, React 19, Framer Motion, Tailwind CSS 4, Lucide |
| **Database** | Prisma ORM with support for multiple SQL providers |

---

## 📦 Getting Started

### 1. Backend Setup
```bash
cd traveloop-backend
npm install
# Configure your .env file with DATABASE_URL
npx prisma generate
npm run start:dev
```

### 2. Mobile App Setup
```bash
cd traveloop-mobile
npm install
npx expo start
```

### 3. Web Demo Setup
```bash
cd traveloop-demo
npm install
npm run dev
```

---

## 🗺️ Wireframe Map

Detailed screen positioning and UI element mapping can be found in the [Wireframe Map Documentation](./wireframe_map.md).

---

## 📄 License

This project is privately owned and unlicensed. All rights reserved.

---

*Built with ❤️ for adventurers by [akashgaming3331-dotcom](https://github.com/akashgaming3331-dotcom)*