# Whisper: Anonymous Messaging Platform

Whisper is a secure and anonymous messaging platform where users can receive and send anonymous messages through unique profile links. It provides privacy controls, email authentication, and AI-powered smart message suggestions.

## 🌐 Live Demo
[Whisper: Live](https://ai-whisper.vercel.app/) 

## 🚀 Tech Stack
- **Frontend & Backend:** Next.js
- **Authentication:** NextAuth (Auth.js), JWT Authentication
- **Database:** MongoDB, Mongoose
- **Email Service:** Resend
- **Validation:** Zod
- **UI Components:** ShadCN
- **AI Integration:** Google Gemini API

## ✨ Features
- 🔗 **Unique Profile Links** – Users receive a unique profile link to share and collect anonymous messages.
- 🔒 **Privacy Controls** – Toggle to accept or decline messages from others.
- 📧 **Secure Authentication** – Email and password authentication with email verification codes.
- 🌙 **Dark Mode** – Enhanced accessibility and UI experience.
- 🤖 **AI-Powered Suggestions** – Smart message suggestions with AI integration.

## 📦 Installation
Clone the repository:
```sh
git clone https://github.com/SumitNub12/whisper.git
cd whisper
```

Install dependencies:
```sh
npm install
```

## 🔑 Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

## 🚀 Running the Project
Start the development server:
```sh
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🛠 Deployment
To deploy on Vercel:
```sh
vercel deploy
```


## 📬 Feedback & Contributions
Feel free to open issues or pull requests for improvements. 🙌
