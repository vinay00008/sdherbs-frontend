import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaPaperPlane, FaMicrophone, FaVolumeUp } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import pingSound from "../assets/ping.mp3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Voice Mode State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-Speech Function (ElevenLabs)
  const speakResponse = async (text, force = false) => {
    if (isMuted || (!isVoiceMode && !force)) return;

    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    try {
      console.log("🗣️ Generating ElevenLabs Audio...");
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${process.env.REACT_APP_ELEVENLABS_VOICE_ID}`, // Voice ID
        {
          text: text,
          model_id: "eleven_multilingual_v2", // Best for Hindi + English
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            "xi-api-key": process.env.REACT_APP_ELEVENLABS_API_KEY, // API Key
            "Content-Type": "application/json"
          },
          responseType: 'blob'
        }
      );

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.play();

    } catch (error) {
      console.error("❌ ElevenLabs Error:", error);
      // Fallback to Browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSound = () => {
    const audio = new Audio(pingSound);
    audio.volume = 0.5;
    audio.play();
  };

  // Scroll always to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load voices when they change (needed for some browsers)
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        console.log("🔊 Voices Loaded:", v.map(voice => voice.name));
      }
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial load
  }, []);

  // Auto Greeting on First Open
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const greet = {
        sender: "bot",
        text: "Hello 👋, I’m your SD Herbs Assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([greet]);
    }
  }, [isOpen]);

  // Offline smart response function
  const generateOfflineResponse = async (userText) => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const products = res.data || [];

      // Check if query matches any product
      const found = products.find((p) =>
        userText.toLowerCase().includes(p.name.toLowerCase())
      );

      if (found) {
        return `🌿 *${found.name}* — ${found.description}`;
      }

      // If no match found
      return `I'm sorry 🤔, I couldn’t find specific information for "${userText}".
But you can reach out to us directly:
📍 Mandsaur, Madhya Pradesh, India
📞 +91 98931 56792
📧 info@sdherbs.com

Or send your question via our Contact page — we’ll get back to you soon.`;
    } catch (err) {
      return "I'm facing connection issues 😕. Please try again later or reach out via our Contact page.";
    }
  };

  // Send message handler
  const handleSend = async (msgText = null, fromVoice = false) => {
    console.log("handleSend called with:", msgText, "Type:", typeof msgText);
    const textToSend = typeof msgText === "string" ? msgText : input;

    // If sent via typing (Enter key or Send button), disable voice mode
    if (!fromVoice) {
      setIsVoiceMode(false);
    }

    if (!textToSend || !textToSend.trim()) {
      console.log("Empty message, not sending.");
      return;
    }

    const newMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // 0. Check for Special Debug Command "/voices"
    if (textToSend.toLowerCase() === "/voices") {
      const voices = window.speechSynthesis.getVoices();
      const voiceList = voices
        .filter(v => v.lang.includes("IN") || v.lang.includes("hi") || v.name.includes("Female"))
        .map(v => `• ${v.name} (${v.lang})`)
        .join("\n");

      const debugMsg = {
        sender: "bot",
        text: `🎤 **Available Voices on your System:**\n\n${voiceList || "No specific Indian/Female voices found."}\n\n(Tell the developer which one you like!)`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newMessage, debugMsg]);
      setInput("");
      setIsTyping(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        message: textToSend,
      });

      let botReply = response.data.reply || "";

      // 1. Check for Navigation Command [NAVIGATE: /url]
      const navMatch = botReply.match(/\[NAVIGATE: (.*?)\]/);
      if (navMatch) {
        const url = navMatch[1];
        botReply = botReply.replace(navMatch[0], "").trim();
        console.log("🚀 Chatbot Navigating to:", url);
        navigate(url);
      }

      // 2. Check for UI Action Command [ACTION: THEME_...]
      const actionMatch = botReply.match(/\[ACTION: (.*?)\]/);
      if (actionMatch) {
        const action = actionMatch[1];
        botReply = botReply.replace(actionMatch[0], "").trim();
        console.log("🎨 Chatbot UI Action:", action);

        if (action === "THEME_DARK" && theme === "light") {
          toggleTheme();
        } else if (action === "THEME_LIGHT" && theme === "dark") {
          toggleTheme();
        }
      }

      if (!botReply) {
        botReply = await generateOfflineResponse(textToSend);
      }

      const botMessage = {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Removed artificial delay completely for instant response
      playSound();
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Speak if in voice mode
      if (fromVoice || isVoiceMode) {
        // Strip markdown and emojis for cleaner speech
        const cleanText = botReply
          .replace(/[*_#`]/g, "") // Remove markdown
          .replace(/\p{Extended_Pictographic}/gu, ""); // Remove emojis
        speakResponse(cleanText, true); // Force speak
      }

    } catch (error) {
      const offlineReply = await generateOfflineResponse(textToSend);
      const botMessage = {
        sender: "bot",
        text: offlineReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      playSound();
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      if (fromVoice || isVoiceMode) {
        // Strip markdown and emojis for cleaner speech
        const cleanText = offlineReply
          .replace(/[*_#`]/g, "") // Remove markdown
          .replace(/\p{Extended_Pictographic}/gu, ""); // Remove emojis
        speakResponse(cleanText, true); // Force speak
      }
    }
  };

  // Voice Input Handler
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    // Unlock Audio Context immediately (Fix for first-time play issue)
    const audio = new Audio(pingSound);
    audio.volume = 0; // Silent
    audio.play().catch(() => { });

    setIsVoiceMode(true); // Enable voice mode

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice Result:", transcript);
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript, true); // Pass true for fromVoice
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Clear Chat Handler
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setMessages([]);
    setShowClearConfirm(false);

    // Re-trigger greeting
    setTimeout(() => {
      const greet = {
        sender: "bot",
        text: "Chat cleared! 🧹 How can I help you now?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([greet]);
    }, 500);
  };

  return (
    <>
      {/* Floating Icon */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg chat-glow"
        >
          <FaLeaf size={22} />
        </motion.button>
      )}

      {/* Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-green-600 dark:bg-green-700 text-white px-4 py-3">
              <div className="flex items-center gap-2">
                <FaLeaf size={18} className="text-white" />
                <h2 className="font-semibold">SD Herbs Assistant</h2>
              </div>
              <div className="flex items-center gap-3">
                {/* Mute Toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/80 hover:text-white"
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>

                <IoTrashOutline
                  className="cursor-pointer text-lg hover:text-red-300"
                  title="Clear Chat"
                  onClick={handleClearChat}
                />
                <IoClose
                  className="cursor-pointer text-lg hover:text-red-300"
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </div>

            {/* Suggested Questions (Chips) */}
            <div className="px-4 pt-2 pb-1 bg-green-50 dark:bg-gray-900 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { label: "📦 Products", text: "Show me your products" },
                { label: "📞 Contact", text: "How can I contact SD Herbs?" },
                { label: "🌿 About", text: "Tell me about SD Herbs" },
                { label: "💊 Best Sellers", text: "What are your best selling products?" },
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip.text)}
                  className="whitespace-nowrap px-3 py-1 bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700 rounded-full text-xs text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 chat-scroll bg-green-50 dark:bg-gray-900">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${msg.sender === "user"
                      ? "bg-green-600 dark:bg-green-700 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border dark:border-gray-600"
                      }`}
                  >
                    {msg.text}
                    <div className="text-[11px] text-gray-400 dark:text-gray-300 mt-1">
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="text-gray-500 dark:text-gray-400 text-sm italic">Assistant is typing...</div>
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              <input
                type="text"
                className="flex-1 border dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              {/* Mic Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`ml-2 p-2 rounded-full transition-colors ${isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : isSpeaking
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 cursor-not-allowed"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                title={isSpeaking ? "Assistant is speaking..." : "Voice Input"}
              >
                {isListening ? (
                  <div className="w-4 h-4 bg-white rounded-full" />
                ) : isSpeaking ? (
                  <FaVolumeUp size={16} className="animate-pulse" />
                ) : (
                  <FaMicrophone size={16} />
                )}
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
              >
                <FaPaperPlane size={16} />
              </motion.button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs py-1 bg-green-100 dark:bg-gray-800 text-green-700 dark:text-green-400">
              Powered by <b>SD Herbs</b> 🌿
            </div>

            {/* Clear Chat Confirmation Modal Overlay */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 text-center border border-gray-200 dark:border-gray-700 w-full max-w-[280px]"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                      <IoTrashOutline size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Clear History?</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-5">
                      This will remove all messages. This action cannot be undone.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmClear}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors flex-1"
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
