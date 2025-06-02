import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import toast from "react-hot-toast";

const Chatur = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.baseURL = backendUrl;
  const scrollEnd = useRef();
  const inputRef = useRef(null);
  const { authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`chatur-history-${authUser?._id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = {
      sender: authUser._id,
      text: input,
      time: new Date().toISOString(), 
    };
    const updatedHistory = [...messages, newUserMessage].slice(-50); // Keep only last 50 messages

    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/ai/ask", {
        userId: authUser._id,
        message: input,
        history: updatedHistory,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.reply,
       time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: " Gemini AI failed to respond." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    if (authUser) {
      localStorage.setItem(
        `chatur-history-${authUser._id}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, authUser]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start px-2 sm:px-4 py-4 sm:py-6 bg-cover bg-center">
      {/* Header */}
      <div className="relative flex items-center md:justify-center max-w-2xl w-full backdrop-blur-md  gap-3 py-3 mx-4 border-b border-white/10 rounded-t-2xl shadow-xl mb-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 text-center">
          🤖 Welcome to Chatur Your AI Agent
        </h1>
        <img
          onClick={() => navigate("/")}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 absolute right-0 "
        />
      </div>

      {/* Chat Container */}
      <div className="w-full max-w-2xl flex flex-col flex-1 backdrop-blur-md bg-white/10 border border-white/20 border-t-2 rounded-b-2xl shadow-xl overflow-hidden">
        {/* Messages (scrollable area) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm sm:text-base ${
                msg.sender === authUser._id ? "text-right" : "text-left"
              }`}
            >
              <div>
                <span
                  className={`inline-block p-2 sm:p-3 rounded-lg max-w-[85%] sm:max-w-[70%] break-words ${
                    msg.sender === authUser._id
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
                {msg.time && (
                  <small className="text-xs text-gray-500 block mt-1">
                    {formatMessageTime(msg.time)}
                  </small>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="italic text-gray-400">Chatur is typing...</div>
          )}
          <div ref={scrollEnd}></div>
        </div>

        {/* Input Field */}
  
<div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 backdrop-blur-sm bg-white/10 border-t border-white/20 px-3 sm:px-4 py-2">
  <input
    ref={inputRef}
    type="text"
    placeholder="Ask me anything..."
    className="flex-1 bg-transparent text-white placeholder-gray-300 text-sm sm:text-base px-2 py-1 outline-none"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    disabled={loading}
    aria-label="Chat input"
  />

  {/* Send Button */}
  <button
    onClick={sendMessage}
    className="px-3 py-2 sm:px-5 cursor-pointer sm:py-2 md:px-8 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm rounded-full shadow-md transition-all duration-300"
    aria-label="Send message"
  >
    Send
  </button>

  {/* Clear Button */}
  <button
    onClick={() => {
      if (confirm("Clear chat history?")) {
        setMessages([]);
        localStorage.removeItem(`chatur-history-${authUser._id}`);
        toast.success("Chat history cleared!");
      }
    }}
    className="px-3 py-2 sm:px-4 cursor-pointer bg-red-500 hover:bg-red-600 text-white text-sm rounded-full shadow-md transition-all duration-300"
    aria-label="Clear chat"
  >
    Clear
  </button>
</div>

      </div>
    </div>
  );
};

export default Chatur;
