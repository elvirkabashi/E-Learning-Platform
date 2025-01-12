const express = require('express');
const router = express.Router();
const { register, login, getUserDetails,modifyUserRole } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/details', authenticateJWT, getUserDetails);


module.exports = router;