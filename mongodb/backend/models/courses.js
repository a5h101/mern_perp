const mongoose = require('mongoose');

// const kalviumSchema = new mongoose.Schema({
//   kalvium: [
//     {
//       course: { type: String, required: true },
//       courseId: { type: Number, required: true },
//       cohort: { type: Number, required: true },
//       college: { type: String, required: true },
//       semester: { type: Number, required: true },
//       averageRating: { type: Number, default: 0 },
//       studentsVoted: { type: Number, default: 0 },
//     },
//   ],
// });

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
