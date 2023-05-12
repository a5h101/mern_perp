const mongoose = require('mongoose');

const kalvium = new mongoose.Schema({
  course: { type: String },
  courseId: { type: Number },
  cohort: { type: Number },
  college: { type: String },
  semester: { type: Number },
  averageRating: { type: Number },
  studentsVoted: { type: Number },
});

const Kalvium = mongoose.model('Kalvium', kalvium);

module.exports = Kalvium;
