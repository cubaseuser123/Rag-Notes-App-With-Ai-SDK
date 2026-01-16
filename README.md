# 📘 Personal Notes + AI Chatbot — Next.js · Convex · Vercel AI SDK

A personal notes application built with **Next.js**, **Convex**, **Tailwind CSS**, and the **Vercel AI SDK**.
The app lets you create and manage notes, chat with an integrated AI assistant, and use **RAG (Retrieval-Augmented Generation)** to query your notes intelligently.
This project was created primarily to **learn and explore the Vercel AI SDK and RAG implementations**.

## ✨ Features

### 📝 Notes

* Create, edit, delete, and browse personal notes
* Fully real-time using Convex
* Clean, minimal UI built with Tailwind & Next.js App Router

### 🔐 Authentication (Convex)

* Convex handles authentication out-of-the-box
* Secure access control for notes and chat
* No custom backend auth required

### 🧬 Vector Embeddings + Similarity Search (Convex)

* Convex generates and stores vector embeddings for each note
* Implements **similarity search** as the core of the RAG pipeline
* Ensures fast, accurate retrieval of relevant notes for chat queries

### 🤖 AI Chatbot (Vercel AI SDK)

* Integrated chatbot built with the **Vercel AI SDK**
* **Streaming text responses** in real-time
* **Tool-calling ready** (planned / work-in-progress)
* RAG-enhanced: the AI can “look into” your notes and answer questions based on their content

### 🚀 Deployment

* Fully deployed on **Vercel**
* Zero-config deployments for frontend + static assets

## 📚 How RAG Works in This Project

1. User sends a chat message
2. Convex computes/query embeddings
3. Convex performs **similarity search** over stored embeddings
4. Top-matching notes are attached as context
5. The AI model (via Vercel AI SDK) generates a response using your notes
6. Response streams back to the UI in real-time

This allows:

* Q&A over your notes
* Summaries, insights, relationships
* AI-powered recall of anything you’ve written

## 🛠 Tech Stack

* **Next.js** (App Router)
* **Convex** (auth, database, vector embeddings, similarity search)
* **Tailwind CSS**
* **Vercel AI SDK** (streaming chat + tool calling)
* **TypeScript**
* **Vercel** for deployment

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` and include:

* Convex deployment keys
* AI provider API keys
* Embedding model config (if applicable)

### 3. Run locally

```bash
npm run dev
```

### 4. Deploy to Vercel

Push to GitHub → “Import Project on Vercel” → deploy
Convex deploys backend functions automatically via their dashboard

## 🎯 Purpose of the Project

This project was built with a primary goal:

* **To learn and understand the Vercel AI SDK**
* **To implement and explore RAG using Convex embeddings + similarity search**
* **To practice building a full-stack AI-enabled application**

## 🔮 Future Improvements

* Full tool-calling integration
