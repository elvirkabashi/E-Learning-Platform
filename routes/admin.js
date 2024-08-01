const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController')
const userController = require('../controllers/userController')



const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');


router.delete('/delCourse/:id',authenticateJWT, authorizeRoles('admin'), courseController.deleteCourse);
router.put('/changeRole/:id/role', authenticateJWT,authorizeRoles('admin'), userController.modifyUserRole);



module.exports = router;