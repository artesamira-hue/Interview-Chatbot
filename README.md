# Interview Chatbot

A Next.js chatbot interface with a simple question-and-answer flow. The project is built with the App Router, React, and TypeScript.

## Features

- Send chatbot questions from a text input.
- View user questions and chatbot answers in a conversation list.
- Show a typing indicator while a query is being entered.
- Display a loading state while a response is requested.
- Preserve chat search and data in browser storage.

## Requirements

- Node.js 20 or newer
- npm

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

The chatbot is available at [http://localhost:3000/chatbot](http://localhost:3000/chatbot).

## Available Scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run ESLint
```

## Chatbot API

The chatbot page sends requests to:

```text
GET /api/chatbot?query=<question>
```

The response should use this JSON shape:

```json
{
  "id": "unique-response-id",
  "answer": "The chatbot response",
  "question": "The submitted question"
}
```

Add an App Router route handler at `app/api/chatbot/route.ts` that accepts the `query` parameter and returns this response before using the chatbot in a fresh environment.

## Project Structure

```text
app/
  page.tsx             # Home page
  layout.tsx           # Root layout
  chatbot/
    page.tsx           # Chatbot interface
```
