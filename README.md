# 🗨️ SpeedTalk — Real-time Messaging Platform  
🚀 **Connect and chat instantly with anyone, anytime, anywhere.**

SpeedTalk is a modern, fully responsive real-time messaging web application built for seamless communication. With elegant UI, optimized state management, and blazing-fast real-time updates via WebSockets, SpeedTalk offers a feature-rich chatting experience.

---

## 🌐 Live Demo  
- **Frontend**: [SpeedTalk](https://speedtalk.onrender.com)

---

## ⚙️ Full Functionality

### 💬 Real-time One-on-One Messaging
- Live, bidirectional messaging using **Socket.IO**.
- Messages appear instantly without page reload.
- Includes real-time delivery and reaction handling.

### 🧠 Optimized Global State Management
- UI and chat state managed via **Zustand**, offering predictable and lightweight global state sharing across components.
- Seamless syncing of sidebar, chat view, and user sessions.

### 👤 Secure User Authentication
- **JWT-based authentication** system with secure login and registration flows.
- Auth tokens stored safely and validated for protected routes.

### 📒 Dynamic Chat Management
- View a list of all registered users.
- Initiate or resume private chats with anyone.
- Real-time **online/offline** status indicators.
- Maintains chat history between users across sessions.

### 🧠 Typing Indicators
- Know when the other user is typing in real time via Socket.IO events.
- Smooth UI feedback for better communication awareness.

### ❤️ Emoji Reactions
- React to individual messages with emojis (👍, ❤️, 😂, etc.).
- Live update of reactions across both users' screens.
- Supports multiple reaction types with instant toggle.

### 📲 Mobile-First Sidebar Experience
- Sidebar supports mobile gestures (swipe to open/close).
- Added floating "Tap to Chat" CTA on mobile screens.
- Designed for **optimal usability on mobile, tablet, and desktop**.

### 🖥️ Responsive & Adaptive Layout
- Built with **Tailwind CSS** + **DaisyUI** to ensure sleek visuals and responsiveness.
- Auto-adjusts layout and components based on device size.

### 🧾 Profile & Presence Awareness
- Each user displays profile picture, name, email, and real-time presence.
- Online indicators update instantly as users connect/disconnect.

### 📦 Modular, Scalable Codebase
- Clean folder structure separating concerns (auth, chat, UI state, sockets).
- Built to support future features like group chats, admin roles, and media sharing.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** – Modern component-based UI
- **Tailwind CSS** – Utility-first styling
- **DaisyUI** – Customizable component library
- **Zustand** – Lightweight state management
- **Socket.IO Client** – Real-time communication
- **Axios** – Promise-based HTTP client
- **Lucide Icons** – Clean, sharp icon system

### **Backend**
- **Node.js** – Non-blocking, high-performance runtime
- **Express.js** – Web framework for APIs
- **MongoDB** – NoSQL document-oriented database
- **Socket.IO Server** – WebSocket communication engine
- **JWT** – Secure user authentication
- **CORS & Helmet** – HTTP headers and cross-origin security

---

## 🚀 Getting Started

### 🔹 Prerequisites
- Node.js (v14+)
- npm (v6+)

### 🔹 Installation

1. Clone the repository:

```bash
git clone https://github.com/MirazZim/SpeedTalk.git
cd SpeedTalk
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit:  
[http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

SpeedTalk is live on:

- **Client**: [Firebase Hosting or Vercel]
- **Server**: [Render or Vercel]

To deploy your own version:

```bash
vercel
```

Or deploy backend with services like **Render**, **Railway**, or **Heroku**.

---

## 🤝 Contributing

We welcome all contributions! 🚀

To get started:

1. **Fork** the repository  
2. Create a new branch  
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes  
```bash
git commit -m "feat: added amazing feature"
```
4. Push to your branch  
```bash
git push origin feature/amazing-feature
```
5. Open a **Pull Request** and let’s review!

---

## 📝 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

---

## 📩 Connect with Me

- GitHub: [@MirazZim](https://github.com/MirazZim)
- LinkedIn: [Miraz zim](https://www.linkedin.com/in/mirazur-rahman-zim-62a973272/)

---

> ⚡️ Let’s simplify real-time communication — one SpeedTalk at a time.  
> 💙 If you find this project useful, star it on GitHub and spread the love!

---

```
