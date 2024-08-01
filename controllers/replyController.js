
const Reply = require('../models/reply');
const Enrollment = require('../models/enrollment');
const Thread = require('../models/thread'); 

const createReply = async (req, res) => {
  const { content } = req.body;
  const { threadId } = req.params;
  const userId = req.user.id;

  try {
  
    const thread = await Thread.findByPk(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const enrollment = await Enrollment.findOne({
      where: { userId, courseId: thread.courseId }, 
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'User not enrolled in the course' });
    }

    
    const reply = await Reply.create({ content, threadId, userId });
    res.status(201).json(reply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Error creating reply', error });
  }
};

const getReply = async (req, res) => {
  const { id } = req.params;

  try {
    const reply = await Reply.findByPk(id, {
      include: [{ model: Thread, as: 'thread' }],
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    res.status(200).json(reply);
  } catch (error) {
    console.error('Error fetching reply:', error);
    res.status(500).json({ message: 'Error fetching reply', error });
  }
};

const updateReply = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const reply = await Reply.findByPk(id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    reply.content = content || reply.content;
    await reply.save();

    res.status(200).json(reply);
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ message: 'Error updating reply', error });
  }
};

const deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    const reply = await Reply.findByPk(id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    await reply.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Error deleting reply', error });
  }
};


const deleteStudentReply = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; 

  try {

    const reply = await Reply.findByPk(id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }


    if (reply.userId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own replies' });
    }


    await reply.destroy();

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Error deleting reply', error });
  }
};

module.exports = { createReply, getReply, updateReply, deleteReply,deleteStudentReply };
