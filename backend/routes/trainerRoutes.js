const express = require("express");
const router = express.Router();

const {
  getDashboard,
  reviewRoadmap,
  getCandidates,
  getCandidateDetails,
  completeTraining
} = require("../controllers/trainerController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/dashboard", getDashboard);
router.post("/roadmap/:id/review", reviewRoadmap);
router.get("/candidates", getCandidates);
router.get("/candidate/:id", getCandidateDetails);
router.post("/candidate/:id/complete", completeTraining);

module.exports = router;