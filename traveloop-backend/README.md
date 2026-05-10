# 🚀 Traveloop Backend API

The core engine of the Traveloop ecosystem, built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).

## 🛠️ Features

-   **Authentication**: Secure JWT-based login and registration with Passport.js.
-   **Trip Management**: CRUD operations for trips, including metadata and banners.
-   **Itinerary Engine**: Manage trip stops and specific activities within those stops.
-   **Budgeting**: Track expenses at multiple levels (activity, section, trip).
-   **Resource Management**: Handling for trip notes, packing checklists, and travel documents.
-   **Prisma Integration**: Type-safe database queries and automated migrations.

## 📋 API Modules

| Module | Description |
|---|---|
| `Auth` | User registration, login, and profile management. |
| `Trips` | Core trip creation and listing. |
| `Stops` | Management of individual locations within a trip. |
| `Activities` | Specific tasks or events scheduled at a stop. |
| `Budget` | Expense tracking and budget allocation. |
| `Notes` | Personal trip journals and quick notes. |
| `Packing` | Shared or individual packing checklists. |

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL (or any Prisma-supported database)

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/traveloop"
JWT_SECRET="your_super_secret_key"
```

### Database Setup
```bash
npx prisma generate
npx prisma db push
```

### Running the App
```bash
# development
npm run start:dev

# production
npm run start:prod
```

## 📚 Documentation
Once the server is running, visit `http://localhost:3000/api` (if Swagger is enabled) to view the interactive API documentation.

## 🧪 Testing
```bash
npm run test
```
