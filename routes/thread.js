const express = require('express');
const router = express.Router();
const {
        createThread,
        getThreadsByCourse,
        updateThread,
        deleteThread,           
        } = require('../controllers/threadController');

const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/createThread/:courseId', authenticateJWT, authorizeRoles('instructor'), createThread);
router.get('/getThread/:courseId', authenticateJWT,authorizeRoles('student'), getThreadsByCourse);
router.put('/updateThread/:id', authenticateJWT,authorizeRoles('instructor'), updateThread);
router.delete('/delThread/:id', authenticateJWT,authorizeRoles('instructor'), deleteThread);

module.exports = router;