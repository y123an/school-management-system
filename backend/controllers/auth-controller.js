const mongoose = require("mongoose");
const Admin = require("../models/adminSchema");
const Teacher = require("../models/teacherSchema");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, role } = req.body;

  const id = req.params.id;

  try {
    let user;
    if (role === "Admin") {
      user = await Admin.findOne({ _id: id });
    } else if (role === "Teacher") {
      user = await Teacher.findOne({ _id: id });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  changePassword,
};
