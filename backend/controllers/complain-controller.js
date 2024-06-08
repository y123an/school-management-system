const Complain = require("../models/complainSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Parent = require("../models/parentSchema.js");

const complainCreate = async (req, res) => {
  let { userId, userType, complaint, title, name, role } = req.body;

  // Check if the user exists and is valid
  let user;
  if (userType === "Teacher") {
    user = await Teacher.findById(userId);
    userType = "teacher";
  } else if (userType === "HomeRoomTeacher") {
    user = await Teacher.findById(userId);
    userType = "teacher";
  } else if (userType === "Parent") {
    user = await Parent.findById(userId);
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid user" });
  }

  const newComplaint = new Complain({
    user: userId,
    userType,
    name,
    title,
    role,
    date: new Date(),
    complaint,
    recipient: "admin",
  });

  try {
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the complaint by ID and delete it
    const complaint = await Complain.findByIdAndDelete(id);

    // If no complaint is found, return a 404 error
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Return a success message
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const complainList = async (req, res) => {
  try {
    const complaints = await Complain.find()
      .populate("user", "-password") // Populate user details, excluding password
      .exec();
    if (complaints.length > 0) {
      res.status(200).json(complaints);
    } else {
      res.json({ message: "No complaints found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { complainCreate, complainList, deleteComplaint };
