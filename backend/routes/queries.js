const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.post('/submit', queryController.submitQuery);
router.get('/student/:studentId', queryController.getStudentQueries);
router.post('/assign', queryController.assignToProfessor);
router.post('/forward', queryController.forwardToDepartment);
router.post('/resolve', queryController.resolveQuery);
router.get('/all', queryController.allQueries);

module.exports = router;
