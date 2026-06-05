# ⚖️ FIR Assistant — AI Powered Legal Aid

A full-stack MERN application that helps Indian citizens draft FIRs, understand their legal rights and get AI powered legal advice.

## 🌐 Live Demo
[https://fir-assistant.vercel.app](https://fir-assistant.vercel.app)

## ✨ Features

### 🔐 Authentication
- JWT based register and login
- OTP based forgot password via email
- Secure password reset flow

### 📝 FIR Management
- AI generated FIR drafts from plain language descriptions
- Real time crime type detection while typing
- Automatic IPC section suggestions with explanations
- AI generated evidence checklist
- Edit FIR drafts
- Download FIR as professional PDF
- FIR status tracker with timeline
- FIR history with search and delete

### 🤖 LexAI Legal Advisor
- AI agent specialized in Indian law
- Full conversation history
- Multiple chat sessions
- Suggested questions to get started
- Remembers context throughout conversation

### ⚖️ Know Your Rights
- AI powered legal rights guide
- 8 pre-built topics
- Custom topic search
- Practical tips for each topic

### 🚔 Police Station Finder
- Search by city or area
- Google Maps integration
- All emergency helpline numbers
- Tips for visiting police station

### 🔔 Notifications
- Auto notifications on FIR creation
- Auto notifications on status updates
- Mark as read individually or all at once
- Real time notification count badge

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Groq API (LLaMA 3.3 70B) |
| Auth | JWT, bcryptjs |
| Email | Nodemailer, Gmail |
| PDF | jsPDF |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

## 🏃 Run Locally

### Prerequisites
- Node.js 18+
- MongoDB
- Groq API Key (free at console.groq.com)
- Gmail App Password

### Backend
\`\`\`bash
cd server
npm install
# Create .env file with required variables
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd client
npm install
npm start
\`\`\`

### Environment Variables

**Server `.env`:**
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_gmail
EMAIL_PASSWORD=your_app_password
GROQ_API_KEY=your_groq_key
CLIENT_URL=http://localhost:3000
\`\`\`

**Client `.env`:**
\`\`\`env
REACT_APP_SERVER_URL=http://localhost:5000/api
\`\`\`

## 📁 Project Structure

\`\`\`
fir-assistant/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── firController.js
│   │   ├── aiController.js
│   │   ├── chatController.js
│   │   └── notificationController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FIR.js
│   │   ├── OTP.js
│   │   ├── Chat.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── firRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── chatRoutes.js
│   │   └── notificationRoutes.js
│   └── utils/
│       ├── sendEmail.js
│       └── generateOTP.js
└── client/
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── Sidebar.js
        │   └── NotificationBell.js
        ├── context/AuthContext.js
        ├── pages/
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── ForgotPasswordPage.js
        │   ├── VerifyOTPPage.js
        │   ├── ResetPasswordPage.js
        │   ├── DashboardPage.js
        │   ├── NewFIRPage.js
        │   ├── FIRDetailPage.js
        │   ├── FIRHistoryPage.js
        │   ├── LegalChatPage.js
        │   ├── RightsPage.js
        │   └── PoliceFinderPage.js
        └── utils/api.js
\`\`\`

## 💼 Resume Description

\`\`\`
FIR Assistant — AI Powered Legal Aid App (MERN Stack)
- Built a full-stack legal aid application helping Indian citizens 
  draft FIRs from plain language descriptions using Groq AI
- Integrated LLaMA 3.3 70B model for FIR generation, IPC section 
  suggestions, evidence checklist and legal advice chat agent
- Implemented JWT authentication with OTP based password reset 
  via Nodemailer
- Built LexAI — a conversational legal advisor agent with full 
  conversation history stored in MongoDB
- Features: PDF export, case tracker, notifications, 
  police station finder, know your rights
- Tech: React, Node.js, Express, MongoDB, Groq AI, 
  Tailwind CSS, Nodemailer, jsPDF
- Deployed: Vercel + Render + MongoDB Atlas
\`\`\`

## 🔗 Links
- Live App: [fir-assistant.vercel.app](https://fir-assistant.vercel.app)
- GitHub: [github.com/Ajith-kvk/fir-assistant](https://github.com/Ajith-kvk/fir-assistant)