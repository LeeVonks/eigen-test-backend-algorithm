const express = require('express');
const { reverseString } = require('../controllers/reverseController');
const router = express.Router();

router.post('/reverse', reverseString);

module.exports = router;
