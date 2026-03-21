const express = require('express');
const router = express.Router();
const { getHRDashboard, uploadResume } = require('../controllers/hrController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/dashboard')
  .get(getHRDashboard);

router.route('/upload')
  .post(upload.single('resume'), uploadResume);

module.exports = router;
