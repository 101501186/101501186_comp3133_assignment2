const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");

const canUploadToCloudinary = () =>
  Boolean(
    process.env.CLOUDINARY_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const formatEmployee = (employee) => {
  if (!employee) {
    return employee;
  }

  return {
    ...employee.toObject(),
    date_of_joining: new Date(employee.date_of_joining).toISOString(),
  };
};

const resolveProfilePicture = async (profilePicture) => {
  if (!profilePicture) {
    return undefined;
  }

  if (!profilePicture.startsWith("data:image")) {
    return profilePicture;
  }

  if (!canUploadToCloudinary()) {
    return profilePicture;
  }

  const uploadResult = await cloudinary.uploader.upload(profilePicture, {
    folder: "comp3133/employees",
  });

  return uploadResult.secure_url;
};

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

    getEmployees: async () => {
      const employees = await Employee.find().sort({ created_at: -1 });
      return employees.map(formatEmployee);
    },
    getEmployeeById: async (_, { id }) => {
      const employee = await Employee.findById(id);
      return formatEmployee(employee);
    },

    searchEmployee: async (_, { department, designation }) => {
      const filters = [];

      if (department) {
        filters.push({ department: new RegExp(department, "i") });
      }

      if (designation) {
        filters.push({ designation: new RegExp(designation, "i") });
      }

      const query = filters.length > 0 ? { $or: filters } : {};
      const employees = await Employee.find(query).sort({ created_at: -1 });
      return employees.map(formatEmployee);
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
      const profile_picture = await resolveProfilePicture(args.profile_picture);
      const emp = new Employee({ ...args, profile_picture });
      const savedEmployee = await emp.save();
      return formatEmployee(savedEmployee);
    },

    updateEmployee: async (_, { id, ...data }) => {
      const updateData = { ...data };

      if (Object.prototype.hasOwnProperty.call(data, "profile_picture")) {
        updateData.profile_picture = await resolveProfilePicture(data.profile_picture);
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      return formatEmployee(updatedEmployee);
    },

    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted";
    },
  },
};
