const Thread = require('../models/thread')
const Reply = require('../models/reply');
const Enrollment = require('../models/enrollment');


const createThread = async (req, res) => {
    const { title, content } = req.body;
    const { courseId } = req.params;
  
    try {
      const thread = await Thread.create({ title, content, courseId: courseId,instructorId: req.user.id });
      res.status(201).json(thread);
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ message: 'Error creating thread', error });
    }
};

const getThreadsByCourse = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id; // Assumes you have user info from the JWT middleware
  
    try {
      // Check if the user is enrolled in the course
      const enrollment = await Enrollment.findOne({
        where: { userId, courseId },
      });
  
      if (!enrollment) {
        return res.status(403).json({ message: 'Access denied: User not enrolled in the course' });
      }
  
      // Fetch the threads for the course
      const threads = await Thread.findAll({
        where: { courseId },
        include: [{ model: Reply, as: 'replies' }],
      });
  
      res.status(200).json(threads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      res.status(500).json({ message: 'Error fetching threads', error });
    }
};
  
  
  const updateThread = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    try {
      const thread = await Thread.findByPk(id);
  
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
  
      thread.title = title || thread.title;
      thread.content = content || thread.content;
      await thread.save();
  
      res.status(200).json(thread);
    } catch (error) {
      console.error('Error updating thread:', error);
      res.status(500).json({ message: 'Error updating thread', error });
    }
  };
  
  const deleteThread = async (req, res) => {
    const { id } = req.params;
  
    try {
      const thread = await Thread.findByPk(id);
  
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
  
      await thread.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting thread:', error);
      res.status(500).json({ message: 'Error deleting thread', error });
    }
  };
  
module.exports = { createThread, getThreadsByCourse, updateThread, deleteThread };