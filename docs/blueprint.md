# **App Name**: Aexy Tutor

## Core Features:

- Dashboard Display: Show daily progress, streak counter, level badge, and available scenarios.
- Conversation Interface: Enable real-time chat interface with AI for English conversation practice, including message display, input methods (text, speech-to-text mocking), and real-time updates via WebSocket.
- Subscription Check: Check conversation eligibility based on user tier (FREE, STANDARD, PREMIUM) and daily usage limits. Track usage and reset at midnight UTC.
- Conversation Start: Start a new conversation with an AI-driven tutor, driven by the Google Gemini API, based on selected scenario, maintaining a live transcript of the conversation for context. This acts as a tool in the AI's reasoning for responses.
- AI Conversation: Generate AI responses based on user input, provide grammar/pronunciation feedback, and conversation summaries using Google Gemini API
- Real-time messaging: Handle client-server communication to allow the FE and the BE to communicate in real-time with each other to power the conversation. The transcript of the conversation gets persisted in the database.

## Style Guidelines:

- Primary color: HSL(45, 90%, 50%) - Golden yellow (#F8EA3F) to reflect intelligence, optimism, and learning.
- Background color: HSL(45, 20%, 95%) - Pale yellow (#FDFDF0), nearly white, creates a soft and unobtrusive backdrop for content.
- Accent color: HSL(15, 70%, 55%) - Coral orange (#E77B5A) for highlights and calls to action, providing a vibrant contrast.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, techy feel. Body font: 'Inter' (sans-serif) for clean, readable text.
- Code Font: 'Source Code Pro' (monospace) is the monospace font for displaying inline code and code blocks, in situations that warrant such.
- Use flat, outlined icons to maintain a clean and modern look.
- Subtle animations and transitions to enhance user experience (e.g., typing indicator, message arrival).