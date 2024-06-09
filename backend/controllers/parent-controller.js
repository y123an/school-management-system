const Parent = require("../models/parentSchema"); // adjust the path as necessary
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
// Register a new parent
const registerParent = async (req, res) => {
  try {
    const { name, email, password, phone, gender, children } = req.body;

    // Check if the parent already exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ message: "Parent already exists" });
    }
    console.log(name, email, password, phone, gender, children);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new parent
    const newParent = new Parent({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      children,
    });

    await newParent.save();
    const username = name;
    const secret = hashedPassword;
    const nameParts = name.split(" ");

    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      {
        username,
        secret,
        email,
        first_name,
        last_name,
        custom_json: '{ "role": "parent" }',
      },
      { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
    );

    res.status(201).json(newParent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a parent
const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedParent = await Parent.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res
      .status(200)
      .json({ message: "Parent updated successfully", parent: updatedParent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Parent login
const parentLogIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const parent = await Parent.findOne({ email });
    if (!parent) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, parent.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    parent.password = undefined;
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all parents
const getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate("Children");
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parent by ID
const getParentById = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findById(id).populate("Children");

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a parent
const deleteParent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedParent = await Parent.findByIdAndDelete(id);

    if (!deletedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json({ message: "Parent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerParent,
  parentLogIn,
  updateParent,
  getAllParents,
  getParentById,
  deleteParent,
};
