const Chat = require("../models/Chat");
const Groq = require("groq-sdk");

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert AI legal advisor specializing in Indian law. Your name is LexAI.

Your capabilities:
- Deep knowledge of Indian Penal Code (IPC), CrPC, and other Indian laws
- Expertise in FIR filing procedures
- Knowledge of citizen rights in India
- Understanding of bail, arrest, and custody laws
- Familiarity with cyber crime laws, women protection laws, consumer rights

Your behavior:
- Always respond in simple, easy to understand language
- Be empathetic and supportive to victims
- Always mention relevant IPC sections when applicable
- If the situation is serious, recommend filing an FIR immediately
- If someone is in danger, always mention emergency number 100
- Never give advice that could harm someone
- Always clarify you are an AI and recommend consulting a real lawyer for serious matters
- Keep responses concise but complete
- Use bullet points for clarity when listing multiple points

Always end serious legal advice with: "Note: Please consult a qualified lawyer for professional legal advice."`;

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    let chat;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
    } else {
      // Create new chat
      chat = await Chat.create({
        user: req.user._id,
        title: message.substring(0, 50) + "...",
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({ role: "user", content: message });

    // Build messages array for Groq
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Get AI response
    const completion = await getGroq().chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I could not process your request.";

    // Add AI response to chat
    chat.messages.push({ role: "assistant", content: aiResponse });

    // Update title if first message
    if (chat.messages.length === 2) {
      chat.title = message.substring(0, 60) + (message.length > 60 ? "..." : "");
    }

    await chat.save();

    res.json({
      chatId: chat._id,
      message: aiResponse,
      title: chat.title,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: "Failed to get response: " + error.message });
  }
};

// Get all chats for user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single chat with messages
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};