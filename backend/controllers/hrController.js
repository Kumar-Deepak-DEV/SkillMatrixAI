const Candidate = require('../models/Candidate');
const Roadmap = require('../models/Roadmap');
const OpenAI = require("openai");
const { extractText } = require('../services/resumeParser');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateRoadmap = async (resumeText) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
        Analyze resume and return JSON:
        {
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
        `
      },
      { role: "user", content: resumeText }
    ]
  });

  const content = response.choices[0].message.content;
  const cleanContent = content.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleanContent);
};

const getHRDashboard = async (req, res) => {
  try {
    const [total, rejected, approved, inProgress] = await Promise.all([
      Candidate.countDocuments(),
      Candidate.countDocuments({ status: "REJECTED" }),
      Candidate.countDocuments({ status: "APPROVED" }),
      Candidate.countDocuments({ status: "IN_PROGRESS" })
    ]);

    const recent = await Candidate.find()
      .populate("roadmapId")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, total, rejected, approved, inProgress, recent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPLOAD RESUME
const uploadResume = async (req, res) => {
  try {
    const { name, email, assignedTrainer, resumeText } = req.body;

    let textToParse = resumeText;

    if (req.file) {
      textToParse = await extractText(req.file.path);
    }

    if (!textToParse) {
      return res.status(400).json({ success: false, message: "Please provide resume text or upload a file." });
    }

    // Generate Roadmap using AI
    const aiResponse = await generateRoadmap(textToParse);
    const roadmapData = aiResponse.roadmap || [];

    const candidate = await Candidate.create({
      name,
      email,
      assignedTrainer,
      aiInsight: JSON.stringify({
        skills: aiResponse.skills || [],
        experience: aiResponse.experience || "",
        projects: aiResponse.projects || []
      }),
      statusHistory: [{ status: "PENDING" }]
    });

    const roadmap = await Roadmap.create({
      candidateId: candidate._id,
      content: roadmapData,
      aiConfidence: 85 // Can be made dynamic if AI provides it
    });

    candidate.roadmapId = roadmap._id;
    await candidate.save();

    res.json({ success: true, candidate, roadmap });
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to generate roadmap" });
  }
};

module.exports = {
  getHRDashboard,
  uploadResume,
  generateRoadmap
};
