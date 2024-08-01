const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const User = require('../models/user');

const createCourse = async (req, res) => {
  const { title, description } = req.body;

  try {
    const course = await Course.create({ title, description, instructorId: req.user.id });
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ message: 'Course creation failed', error });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }
    if (course.instructorId !== req.user.id) {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    course.title = title;
    course.description = description;
    await course.save();
    res.send(course);
  } catch (error) {
    res.status(400).send({ message: 'Course update failed', error });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }

    await course.destroy();
    res.send({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Course deletion failed', error });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: User,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });
    res.send(courses);
  } catch (error) {
    res.status(400).send({ message: 'Failed to get courses', error });
  }
};

const enrollInCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }

    await Enrollment.create({ userId: req.user.id, courseId });
    res.send({ message: 'Enrolled in course successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Failed to enroll in course', error });
  }
};

module.exports = { createCourse, updateCourse, deleteCourse, getCourses, enrollInCourse };