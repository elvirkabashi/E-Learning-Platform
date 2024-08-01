const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Access Denied' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, 'hSdhjJNgYF64FVSASDWDFR543W*3AWEQ');
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Token Verification Error:', ex);
    res.status(400).send({ message: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticateJWT, authorizeRoles };