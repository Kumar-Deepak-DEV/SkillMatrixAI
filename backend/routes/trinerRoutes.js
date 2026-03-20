const express = require("express");
const router = express.Router();

const {
  getDashboard,
  reviewRoadmap,
  getCandidates,
  getCandidateDetails,
  completeTraining
} = require("../controllers/trainerController");

const { protect, isTrainer } = require("../middleware/auth");

router.get("/dashboard", protect, isTrainer, getDashboard);
router.post("/roadmap/:id/review", protect, isTrainer, reviewRoadmap);
router.get("/candidates", protect, isTrainer, getCandidates);
router.get("/candidate/:id", protect, isTrainer, getCandidateDetails);
router.post("/candidate/:id/complete", protect, isTrainer, completeTraining);

module.exports = router;