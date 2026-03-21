const express = require('express');
const router = express.Router();
const { getHRDashboard, uploadResume, resubmitRoadmap, getCandidateForHR } = require('../controllers/hrController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/dashboard')
  .get(getHRDashboard);

router.route('/upload')
  .post(upload.single('resume'), uploadResume);

router.route('/candidate/:id')
  .get(getCandidateForHR);

router.route('/candidate/:id/resubmit')
  .post(resubmitRoadmap);

module.exports = router;
