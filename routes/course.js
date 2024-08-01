const express = require('express');
const router = express.Router();
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  enrollInCourse
} = require('../controllers/courseController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/createCourse', authenticateJWT, authorizeRoles('instructor'), createCourse);
router.put('/updateCourse/:id', authenticateJWT, authorizeRoles('instructor'), updateCourse);
router.delete('/delCourse/:id', authenticateJWT, authorizeRoles('instructor'), deleteCourse);
router.get('/getCourse', authenticateJWT, getCourses);
router.post('/enroll/:courseId', authenticateJWT, authorizeRoles('student'), enrollInCourse);

module.exports = router;