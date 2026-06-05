import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const suggestedQuestions = [
  "What should I do if police refuse to file my FIR?",
  "What are my rights during arrest?",
  "How do I file a cyber crime complaint?",
  "What is the punishment for theft in India?",
  "Can I get bail for a bailable offense?",
  "What to do if someone is harassing me online?",
  "How to file a complaint against domestic violence?",
  "What are my rights as a victim?",
];

const LegalChatPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/chat").then((res) => {
      setChats(res.data);
      setLoadingChats(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = async (chatId) => {
    try {
      const { data } = await api.get(`/chat/${chatId}`);
      setSelectedChat(data._id);
      setMessages(data.messages);
    } catch (err) {
      toast.error("Failed to load chat");
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    setInput("");
    setLoading(true);

    // Add user message instantly
    const userMsg = { role: "user", content: message, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const { data } = await api.post("/chat/message", {
        chatId: selectedChat,
        message,
      });

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, createdAt: new Date() },
      ]);

      setSelectedChat(data.chatId);

      // Update chats list
      const chatsRes = await api.get("/chat");
      setChats(chatsRes.data);
    } catch (err) {
      toast.error("Failed to get response");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${chatId}`);
      setChats(chats.filter((c) => c._id !== chatId));
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      toast.success("Chat deleted");
    } catch (err) {
      toast.error("Failed to delete chat");
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />

        {/* Chat Layout */}
        <div className="flex-1 flex" style={{ height: "calc(100vh - 57px)" }}>

          {/* Chat History Sidebar */}
          <div className="w-72 flex flex-col border-r"
            style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>

            <div className="p-4 border-b" style={{ borderColor: "#334155" }}>
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                + New Conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
              {loadingChats ? (
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl pulse"
                      style={{ backgroundColor: "#0f172a" }} />
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <p className="text-slate-500 text-sm text-center mt-8">
                  No conversations yet
                </p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => loadChat(chat._id)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between group ${
                      selectedChat === chat._id
                        ? "bg-blue-600"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        selectedChat === chat._id ? "text-white" : "text-slate-300"
                      }`}>
                        {chat.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition ml-2 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">

            {/* Chat Header */}
            <div className="px-6 py-4 border-b flex items-center gap-3"
              style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">
                ⚖️
              </div>
              <div>
                <p className="text-white font-semibold">LexAI — Legal Advisor</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  Online • Specialized in Indian Law
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚖️</div>
                    <h2 className="text-white text-xl font-bold mb-2">
                      LexAI Legal Advisor
                    </h2>
                    <p className="text-slate-400 text-sm max-w-md">
                      Ask me anything about Indian law, your rights, FIR filing process or any legal situation you are facing.
                    </p>
                  </div>

                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-left p-3 rounded-xl text-sm text-slate-300 hover:text-white transition border border-slate-700 hover:border-blue-500 hover:bg-blue-600 hover:bg-opacity-10"
                        style={{ backgroundColor: "#1e293b" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

                  {msg.role === "assistant" && (
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-lg flex-shrink-0 self-start mt-1">
                      ⚖️
                    </div>
                  )}

                  <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-slate-200 rounded-bl-sm"
                  }`}
                    style={{
                      backgroundColor: msg.role === "user" ? "#2563eb" : "#1e293b",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content)
                    }}
                  />

                  {msg.role === "user" && (
                    <div className="w-9 h-9 bg-slate-600 rounded-xl flex items-center justify-center text-lg flex-shrink-0 self-start mt-1">
                      👤
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    ⚖️
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
                    style={{ backgroundColor: "#1e293b" }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i}
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm">LexAI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ backgroundColor: "#0f172a" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask any legal question..."
                  className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none text-sm"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-xl transition flex items-center justify-center flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-600 text-xs text-center mt-2">
                LexAI provides general legal information. Consult a lawyer for professional advice.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalChatPage;