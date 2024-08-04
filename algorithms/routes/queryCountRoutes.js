const express = require('express');
const { queryCount } = require('../controllers/queryCountController');
const router = express.Router();

router.post('/query-count', queryCount);

module.exports = router;
