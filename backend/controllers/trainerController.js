const Roadmap = require("../models/Roadmap");
const Candidate = require("../models/Candidate");
const Comment = require("../models/Comment");


// ===============================
// 📊 DASHBOARD (stats + pending)
// ===============================
const getDashboard = async (req, res) => {
  try {
    // Identify orphaned roadmaps due to manual Candidate deletion
    const allRoadmaps = await Roadmap.find({}).populate("candidateId", "_id");
    const orphans = allRoadmaps.filter(r => !r.candidateId).map(r => r._id);
    
    // Automatically flush them out if they exist so database stays clean
    if (orphans.length > 0) {
      await Roadmap.deleteMany({ _id: { $in: orphans } });
    }

    // Compute strict stats directly mapping exactly the designated DB statuses to stop front-end grouping
    const [total, pending, inTraining, completed] = await Promise.all([
      Candidate.countDocuments({ roadmapId: { $ne: null } }),
      Candidate.countDocuments({ status: "PENDING", roadmapId: { $ne: null } }),
      Candidate.countDocuments({ status: { $in: ["IN TRAINING", "IN_PROGRESS", "IN REVIEW", "APPROVED"] }, roadmapId: { $ne: null } }),
      Candidate.countDocuments({ status: "COMPLETED", roadmapId: { $ne: null } })
    ]);

    const recentRoadmaps = await Roadmap.find({ _id: { $nin: orphans } })
      .populate("candidateId", "name email roleApplied matchScore status")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      stats: { total, pending, inTraining, completed },
      roadmaps: recentRoadmaps.filter(r => r.candidateId != null)
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
    if (req.user) roadmap.approvedBy = req.user.id;

    await roadmap.save();

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    await Candidate.findByIdAndUpdate(roadmap.candidateId, {
      status: newStatus
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


// ===============================
// ☑️ TOGGLE TASK COMPLETION
// ===============================
const toggleTask = async (req, res) => {
  try {
    const { phaseIndex, taskIndex } = req.body;
    const roadmap = await Roadmap.findById(req.params.roadmapId);
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

    const task = roadmap.content?.[phaseIndex]?.tasks?.[taskIndex];
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = !task.completed;
    roadmap.markModified('content');
    await roadmap.save();

    res.json({ success: true, completed: task.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getDashboard,
  reviewRoadmap,
  getCandidates,
  getCandidateDetails,
  completeTraining,
  toggleTask
};