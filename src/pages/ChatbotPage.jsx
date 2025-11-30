// src/pages/ChatbotPage.jsx
import React from "react";
import ChatbotWidget from "../components/ChatbotWidget";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        SD Herbs Chat Assistant 🌿
      </h1>
      <p className="text-gray-700 mb-10 max-w-lg text-center">
        Ask anything about our herbal powders, extracts, or ingredients.
        I’ll help you with details, benefits, and product information.
      </p>
      <div className="w-full max-w-lg">
        <ChatbotWidget />
      </div>
    </div>
  );
}
