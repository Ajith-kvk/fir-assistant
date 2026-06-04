const Groq = require("groq-sdk");

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate FIR Draft
exports.generateFIR = async (req, res) => {
  try {
    const {
      complainantName,
      complainantPhone,
      complainantAddress,
      incidentDate,
      incidentTime,
      incidentLocation,
      incidentDescription,
    } = req.body;

    const prompt = `
You are a legal expert in Indian law. Generate a formal FIR (First Information Report) draft based on the following details.

Complainant Name: ${complainantName}
Complainant Phone: ${complainantPhone}
Complainant Address: ${complainantAddress}
Incident Date: ${incidentDate}
Incident Time: ${incidentTime}
Incident Location: ${incidentLocation}
Incident Description: ${incidentDescription}

Please provide the response in the following JSON format only, no extra text, no markdown:
{
  "crimeType": "Type of crime in 2-3 words",
  "ipcSections": ["IPC Section 1", "IPC Section 2"],
  "ipcExplanations": {
    "IPC Section 1": "Simple explanation of this section",
    "IPC Section 2": "Simple explanation of this section"
  },
  "evidenceChecklist": [
    "Evidence item 1",
    "Evidence item 2",
    "Evidence item 3"
  ],
  "firDraft": "Complete formal FIR draft text here with all details properly formatted"
}`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || "";
    const cleaned = response.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);
  } catch (error) {
    console.error("Groq AI error:", error.message);
    res.status(500).json({ message: "AI generation failed: " + error.message });
  }
};

// Detect Crime Type in Real Time
exports.detectCrimeType = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || description.length < 20) {
      return res.json({ crimeType: "" });
    }

    const completion = await getGroq().chat.completions.create({
      messages: [{
        role: "user",
        content: `Based on this incident description, identify the crime type in 2-4 words only. Description: "${description}". Reply with ONLY the crime type, nothing else. Example: "Theft", "Physical Assault", "Online Fraud"`
      }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const crimeType = completion.choices[0]?.message?.content?.trim() || "";
    res.json({ crimeType });
  } catch (error) {
    res.json({ crimeType: "" });
  }
};

// Explain IPC Section
exports.explainIPC = async (req, res) => {
  try {
    const { section } = req.body;

    const completion = await getGroq().chat.completions.create({
      messages: [{
        role: "user",
        content: `Explain ${section} of the Indian Penal Code in simple language for a common citizen. Include: 1. What this section covers 2. Maximum punishment 3. Example of when this section applies. Keep it simple and under 150 words.`
      }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const explanation = completion.choices[0]?.message?.content?.trim() || "";
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: "Failed to explain IPC section" });
  }
};

// Get Know Your Rights
exports.getRights = async (req, res) => {
  try {
    const { topic } = req.body;

    const completion = await getGroq().chat.completions.create({
      messages: [{
        role: "user",
        content: `You are a legal expert in Indian law. Explain the following legal rights topic for a common Indian citizen in simple language: "${topic}".

Please provide the response in the following JSON format only, no extra text, no markdown:
{
  "title": "Topic title",
  "summary": "2-3 line summary",
  "rights": [
    {
      "title": "Right title",
      "description": "Simple explanation in 2-3 sentences",
      "important": true or false
    }
  ],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"]
}`
      }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || "";
    const cleaned = response.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rights: " + error.message });
  }
};