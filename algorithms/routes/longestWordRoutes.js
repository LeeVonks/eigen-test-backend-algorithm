const express = require('express');
const { longestWord } = require('../controllers/longestWordController');
const router = express.Router();

router.post('/longest-word', longestWord);

module.exports = router;
