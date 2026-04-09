const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true },
  profile_picture: String,
  gender: String,
  designation: { type: String, required: true },
  salary: { type: Number, required: true, min: 1000 },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

EmployeeSchema.pre("findOneAndUpdate", function () {
  this.set({ updated_at: new Date() });
});

module.exports = mongoose.model("Employee", EmployeeSchema);
