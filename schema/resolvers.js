const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

module.exports = {
  Query: {
    login: async (_, { username, email, password }) => {
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid password");

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },

    getEmployees: async () => Employee.find(),
    getEmployeeById: async (_, { id }) => Employee.findById(id),

    searchEmployee: async (_, { department, designation }) => {
      return Employee.find({
        $or: [{ department }, { designation }],
      });
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashed });
      await user.save();
      return "User created successfully";
    },

    addEmployee: async (_, args) => {
      const emp = new Employee(args);
      return emp.save();
    },

    updateEmployee: async (_, { id, ...data }) => {
      return Employee.findByIdAndUpdate(id, data, { new: true });
    },

    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted";
    },
  },
};
