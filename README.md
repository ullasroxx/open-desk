# OpenDesk — AI-Powered Academic Intelligence

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</div>

<h3 align="center">
  <a href="https://open-desk-demo.vercel.app/">🔴 View Live Demo Here</a>
</h3>

<br />

<br />

**OpenDesk** is a futuristic, AI-native academic platform designed to replace traditional LMS environments with a behavior-reactive, immersive, and data-driven workflow. By combining a live local code compilation engine with context-aware AI mentorship, OpenDesk transforms practical labs, assignments, and Viva assessments into a seamless and highly engaging learning experience.

> **Note:** The live demo is hosted on Vercel. Due to serverless environment restrictions on Vercel, the local `child_process` compiler is optimized for local clone usage. To experience the blazing-fast local compiler, please run the project locally.

## ✨ Key Features

### For Students (Student Portal)
- 💻 **Immersive Labs Workspace:** Live, local code execution engine supporting **Java, C, C++, and Python**—compiled directly with accurate host feedback.
- 🤖 **Context-Aware AI Mentor:** Integrated Google Gemini (`gemini-2.5-flash`) acts as a real-time tutor, observing your code and behavior to provide localized hints rather than giving away full answers.
- 📚 **Lab Programs Directory:** Pre-loaded with 60 standard VTU syllabus lab programs, complete with verified code blocks and integrated YouTube tutorials.
- 🧠 **Behavioral Tracking & Analytics:** Real-time momentum and focus tracking translated into a dynamic "Learning DNA" Skill Radar map.
- 🎤 **AI Viva Practice:** Simulate rigorous academic vivas with real-time AI questioning and speech recognition workflows.

### For Faculty (Command Center)
- 👁️ **Live Monitoring:** Watch students code in real-time, receiving instant alerts for sustained confusion, tab-switching, or anomalous behavior.
- 📊 **Student Intelligence:** Granular analytics on class performance, completion rates, and individual student focus metrics.
- 🏛️ **Academic Records & Governance:** Track grades, attendance, and compliance via immutable heatmap grids and visual records.

## 🚀 Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion (for micro-animations and transitions)
- **AI Integration:** `@google/genai` (Google Gemini SDK)
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Backend & State:** Next.js Server Actions, Supabase (for persistent DB), local Node `child_process` for secure compilation loops.
- **Visuals:** Recharts for data visualizations.

## 📸 Screenshots

*(Coming Soon - Add your high-res screenshots of the Student Dashboard, AI Mentor, and Faculty Analytics here!)*

## ⚙️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/ullasroxx/open-desk.git
cd open-desk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root of your directory and add your API keys:
```env
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
