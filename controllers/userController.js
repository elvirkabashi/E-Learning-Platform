const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserDetails = require('../models/userDetails');

const register = async (req, res) => {
  const { name, email, password , role} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword , role});
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ message: 'User registration failed', error });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({  id: user.id,name: user.name,email: user.email, role: user.role  }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Error logging in', error });
    }
}

const getUserDetails = async (req, res) => {
  const userId = req.user.id; 

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: UserDetails,
        as: 'details',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      details: user.details,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

const modifyUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error modifying user role:', error);
    res.status(500).json({ message: 'Error modifying user role', error });
  }
};

module.exports = { register, login, getUserDetails,modifyUserRole };