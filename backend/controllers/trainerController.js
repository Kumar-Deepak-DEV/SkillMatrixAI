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

    const pendingRoadmaps = await Roadmap.find({ status: "PENDING" })
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: { pending, approved, rejected, completed },
      pendingRoadmaps
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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const candidates = await Candidate.find()
      .populate("roadmapId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Candidate.countDocuments();

    res.json({
      data: candidates,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
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