const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateRoadmap = async (resumeText) => {
  const prompt = `
Analyze this resume and return JSON:

{
  "name": "Extract candidate name",
  "email": "Extract candidate email",
  "role": "Extract their main job title or role",
  "skills": [],
  "experience": "",
  "projects": [],
  "roadmap": [
    {
      "title": "",
      "tasks": [{ "title": "" }]
    }
  ]
}

Resume:
${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error (using fallback):", error.message);
    
    // FALLBACK for Demos/Hackathons when API keys fail
    return {
      name: "Simulated Candidate",
      email: "demo.candidate@skillpath.ai",
      role: "Fullstack Engineer",
      skills: ["JavaScript", "React", "Node.js", "System Design"],
      experience: "Simulated 3 years of software engineering experience.",
      projects: ["E-commerce App", "Real-time Chat", "AI Portfolio"],
      roadmap: [
        {
          title: "Phase 1: Advanced Fullstack",
          tasks: [{ title: "Mastering React Hooks" }, { title: "Node.js Security" }]
        },
        {
          title: "Phase 2: Cloud Architect",
          tasks: [{ title: "AWS Deployment" }, { title: "Docker Containerization" }]
        }
      ]
    };
  }
};

module.exports = { generateRoadmap };