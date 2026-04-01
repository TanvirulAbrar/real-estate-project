# 🏡 AzureEstates — Luxury Real Estate Platform

## 📄 Project Description

AzureEstates is a modern full-stack real estate platform built with Next.js, focusing on luxury and premium properties. Users can browse, search, and manage properties, while agents and admins have dedicated dashboards for property management, offers, and analytics. The platform emphasizes a sleek dark luxury aesthetic with glassmorphism effects, secure authentication, and AI-powered features for recommendations and descriptions.

🌍 **Live Project:**  
https://real-estate-cyan-omega.vercel.app/

## ✨ Core Features

- User Authentication (NextAuth with role-based access for Users, Agents, Admins)
- Property Listings & Search (with filters and dynamic routing)
- User Dashboard: Profile, Favorites, Inquiries, Offers, Transactions
- Agent Dashboard: Manage Properties, Add Listings, Handle Inquiries/Offers
- Admin Dashboard: Analytics, User/Property Management, Transactions
- AI Features: Chat, Recommendations, Review Summaries, Description Generation
- Responsive Design with Premium Dark Theme (deep blues, glassmorphism)
- Image Handling and Form Validation (Zod)
- Secure API Routes with MongoDB Integration

## 🛠️ Technologies Used

### Frontend

- Next.js 14.2.15 (App Router)
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- React Icons

### Backend

- Next.js API Routes
- MongoDB with Mongoose
- NextAuth v4
- OpenAI SDK

### Additional

- Zod for Validation
- Bcryptjs for Password Hashing
- Swiper for Carousels

## 📦 Main Dependencies

- next
- react
- react-dom
- @auth/core
- next-auth
- mongoose
- openai
- zod
- bcryptjs
- react-icons
- swiper
- tailwindcss (dev)

## 🚀 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/TanvirulAbrar/real-estate-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root and add:
   - MONGODB_URI=your_mongodb_connection_string
   - NEXTAUTH_URL=http://localhost:3000
   - NEXTAUTH_SECRET=your_secret_key
   - OPENAI_API_KEY=your_openai_key (if using AI features)
   - Supabase keys if applicable

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:

   ```bash
   http://localhost:3000
   ```

## ⚠️ Notes

- Ensure MongoDB is running (local or Atlas).
- Never commit `.env` files to public repositories.
- The project uses Inter font for consistency.
- API routes are integrated within Next.js for full-stack functionality.

## 📸 Screenshots

Not added yet.
