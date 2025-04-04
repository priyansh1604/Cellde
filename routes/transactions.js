const express = require('express');
const multer = require('multer');
const transactionController = require('../controllers/transactionController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze-transactions', upload.single('file'), transactionController.analyzeTransactions);

module.exports = router;
