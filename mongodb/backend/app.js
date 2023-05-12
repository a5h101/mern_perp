const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
const Courses = require('./models/courses');

//Get all course
app.get('/courses', async (req, res) => {
  try {
    const kalvium = await Courses.find();
    res.status(200).json({
      courses: kalvium,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

//Get course by name
app.get('/courses/:courseName', async (req, res) => {
  try {
    console.log(req.params.courseName);
    const psup = await Courses.find({ course: req.params.courseName });
    res.status(200).json({
      psup,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

//Get course rating
app.get('/courses/:courseName/rating', async (req, res) => {
  try {
    const averageRating = await Courses.aggregate([
      {
        $match: {
          course: req.params.courseName,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: '$averageRating',
          },
        },
      },
    ]);
    res.status(200).json({
      'averageRating - psup': averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: 'fail',
      message: error,
    });
  }
});

//Poset new Course
app.post('/courses', async (req, res) => {
  try {
    const newCourse = await Courses.create(req.body);
    res.status(200).json({
      course: newCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

//Add more rating
app.post('/courses/:courseName', async (req, res) => {
  console.log(req.query.rating, req.params.courseName);
  try {
    const course = await Courses.findOne({ course: req.params.courseName });
    let newTotal =
      course.averageRating * course.studentsVoted + Number(req.query.rating);
    let newAvg = newTotal / (course.studentsVoted + 1);
    let newStudents = course.studentsVoted + 1;
    await Courses.updateOne(
      { course: req.params.courseName },
      { $set: { averageRating: newAvg, studentsVoted: newStudents } }
    );
    res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

//reaplce old course doc with new
app.put('/courses/:courseName', async (req, res) => {
  try {
    const courseName = req.params.id;
    const updates = { ...req.query };
    const options = { new: true };
    const updatedCourse = await Courses.findOneAndReplace(
      courseName,
      updates,
      options
    );
    if (!updatedCourse) {
      return res.status(404).send({
        message: 'fail',
      });
    }
    res.status(201).send(updatedCourse);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = app;
