const Roadmap = require("../models/Roadmap");
const Candidate = require("../models/Candidate");
const Comment = require("../models/Comment");


// ===============================
// 📊 DASHBOARD (stats + pending)
// ===============================
const getDashboard = async (req, res) => {
  try {
    const [pending, approved, rejected, completed] = await Promise.all([
      Roadmap.countDocuments({ status: "PENDING" }),
      Roadmap.countDocuments({ status: "APPROVED" }),
      Roadmap.countDocuments({ status: "REJECTED" }),
      Candidate.countDocuments({ status: "COMPLETED" })
    ]);

    const recentRoadmaps = await Roadmap.find({})
      .populate("candidateId", "name email roleApplied matchScore")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      stats: { pending, approved, rejected, completed },
      roadmaps: recentRoadmaps
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===============================
// ✅ REVIEW ROADMAP
// ===============================
const reviewRoadmap = async (req, res) => {
  try {
    const { action, feedback } = req.body;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    roadmap.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    roadmap.feedback = feedback || "";
    roadmap.approvedBy = req.user.id;

    await roadmap.save();

    await Candidate.findByIdAndUpdate(roadmap.candidateId, {
      status: roadmap.status
    });

    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===============================
// 👥 GET ALL CANDIDATES (pagination)
// ===============================
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate("roadmapId")
      .sort({ createdAt: -1 });

    res.json({
      data: candidates,
      currentPage: 1,
      totalPages: 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===============================
// 🔍 CANDIDATE DETAILS
// ===============================
const getCandidateDetails = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate("roadmapId");

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const comments = await Comment.find({
      candidateId: candidate._id
    }).sort({ createdAt: -1 });

    res.json({ candidate, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ===============================
// 🎯 COMPLETE TRAINING
// ===============================
const completeTraining = async (req, res) => {
  try {
    const { comment } = req.body;

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.status = "COMPLETED";
    await candidate.save();

    if (comment) {
      await Comment.create({
        candidateId: candidate._id,
        trainerId: req.user.id,
        comment
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getDashboard,
  reviewRoadmap,
  getCandidates,
  getCandidateDetails,
  completeTraining
};