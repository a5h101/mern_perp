const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
// app.use(mongoose());
const Courses = require('./models/courses');

app.get('/courses', async (req, res) => {
  // console.log(req.query);
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

app.get('/courses/psup', async (req, res) => {
  try {
    console.log('psup');
    const psup = await Courses.find({ course: 'psup' });
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
app.get('/courses/psup/rating', async (req, res) => {
  // console.log(req.query);
  try {
    console.log('psusp');
    const averageRating = await Courses.aggregate([
      {
        $match: {
          course: 'psup',
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
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
});

app.post('/courses', async (req, res) => {
  console.log(req.body);
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

app.post('/courses/bocs2/ratings', async (req, res) => {
  console.log(req.body.ratings);
  try {
    const bocs2 = await Courses.findOne({ course: 'bocs2' });
    let newTotal =
      bocs2.averageRating * bocs2.studentsVoted + Number(req.body.ratings);
    let newAvg = newTotal / (bocs2.studentsVoted + 1);
    let newStudents = bocs2.studentsVoted + 1;
    await Courses.updateOne(
      { course: 'bocs2' },
      { $set: { averageRating: newAvg, studentsVoted: newStudents } }
    );
    // await bocs2.save();
    res.status(200).json({
      bocs2,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});
app.put('/courses/bocs2', async (req, res) => {
  console.log(req.body);
  try {
    Courses.findByIdAndUpdate(
      { course: 'bocs2' },
      { ...req.body },
      { new: true }
    );
    res.status(200).json({
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
});

module.exports = app;
