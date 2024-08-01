const express = require('express');
const router = express.Router();

const {
    createReply,
    getReply,
    updateReply,
    deleteReply,
    deleteStudentReply
  } = require('../controllers/replyController');

const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');


router.post('/createReply/:threadId',authenticateJWT, authorizeRoles('student'),createReply);
router.get('/getReply/:id',authenticateJWT, authorizeRoles('instructor'), getReply);
router.put('/updateReply/:id',authenticateJWT, authorizeRoles('instructor'), updateReply);
router.delete('/delReply/:id', authenticateJWT, authorizeRoles('instructor'),deleteReply);
router.delete('/delStudentReply/:id', authenticateJWT, authorizeRoles('student'),deleteStudentReply);


module.exports = router;