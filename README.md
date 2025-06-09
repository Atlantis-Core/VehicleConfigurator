# 🚗 Vehicle Configurator

A full-stack vehicle configurator built with **React**, **Node.js**, and **PostgreSQL**, following **Clean Architecture** principles. This project is part of the 6th semester coursework for _Software Quality_ and _React – Web Programming_ at Furtwangen University (Allgemeine Informatik - Software Engineering).

---

## 📦 Tech Stack

### Frontend

- ⚛️ React + TypeScript
- ⚡ Vite for build tooling
- 🧪 Vitest for component testing
- 🌐 React Router for routing
- 🔄 Redux Toolkit for state management
- 🎨 CSS Modules for styling
- 🎯 React Three Fiber for 3D vehicle visualization
- 📱 React Icons
- 🍞 React Toastify for notifications
- 📄 jsPDF for PDF generation

### Backend

- 🟩 Node.js + Express
- 🗃️ PostgreSQL with Prisma ORM
- 🚁 Supabase for database hosting
- 📧 Nodemailer for email functionality
- 🔑 UUID for unique identifiers
- 🧪 ESLint for code quality

### DevOps

- 🐳 Docker containerization
- 🚀 Backend deployed on [Fly.io](https://fly.io)
- 🌐 Frontend deployed on [Render](https://render.com)
- 🗄️ Database hosted on [Supabase](https://supabase.com)
- **Live Demo**: [configurator.davidpospisil.de](https://configurator.davidpospisil.de)
- 📁 Monorepo (frontend + backend)

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/PospisilDav/VehicleConfigurator.git
   cd VehicleConfigurator
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Database Setup**

   ```bash
   cd backend

   # Update .env with your PostgreSQL connection details
   # DATABASE_URL="postgresql://username:password@localhost:5432/vehicle_configurator"

   # Run database migrations
   npx prisma migrate dev
   ```

4. **Start the development servers**

   **Backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000`
   - **Live Demo**: [configurator.davidpospisil.de](https://configurator.davidpospisil.de)

### Testing

```bash
# Run frontend tests
cd frontend
npm run test
npm run coverage
```

### Environment Variables

**Backend** - Create a `.env` file in the `backend` directory:

```env
BACKEND_RUNNING_URL="localhost"
BACKEND_URL="0.0.0.0"
PORT="3000"

CLOUDFLARE_R2_BUCKET_URL="cloudflare_bucket_link.com"

DATABASE_URL="postgresql://username:password@localhost:5432/database_url"

STRATO_EMAIL="your-email"
STRATO_EMAIL_ALIAS="your-email-alias"
STRATO_PASSWORD="your-email-password"
```

**Frontend** - Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL = "http://localhost:3000/api"
```

## 📄 License

This project is developed as part of a university course and is licensed under MIT.

## ✍️ Author

👨‍💻 Developed by David Pospisil
📚 HFU Semester 6 – Softwarequalität & React Web-Programming
