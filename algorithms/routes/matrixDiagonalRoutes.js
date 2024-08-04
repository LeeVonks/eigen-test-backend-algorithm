const express = require('express');
const { matrixDiagonalDifference } = require('../controllers/matrixDiagonalController');
const router = express.Router();

router.post('/matrix-diagonal', matrixDiagonalDifference);

module.exports = router;
