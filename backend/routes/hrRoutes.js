const express = require('express');
const router = express.Router();
const { getHRDashboard, uploadResume } = require('../controllers/hrController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/dashboard')
  .get(protect, authorize('HR'), getHRDashboard);

router.route('/upload')
  .post(protect, authorize('HR'), upload.single('resume'), uploadResume);

module.exports = router;
