const Parent = require("../models/parentSchema"); // adjust the path as necessary
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
const sendEmail = require("../middleware/nodemailer");

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
      phone,
      gender,
      Children: children,
      password: hashedPassword,
    });

    await newParent.save();
    const username = name;
    const secret = password;
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

    const recipient = req.body.email;
    const subject = "Welcome to parent and teacher help desk";
    const text = "Welcome to parent and teacher help desk";
    const html = `<b>Welcome to parent and teacher help desk</b>
      <p>you are assigned as a parent on the parent and help teacher desk system your password is ${req.body.password}</p>
      `;
    sendEmail(recipient, subject, text, html);

    res.status(201).json(newParent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a parent
const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, gender, children, password } = req.body;
    const parentupdate = await Parent.findById(id); // Create the update object

    r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
        "User-Name": parentupdate.name,
        "User-Secret": 12345678,
      },
    });
    const updates = {
      name,
      email,
      phone,
      gender,
      Children: children,
    };
    if (name) {
      parentupdate.name = name;
    }
    if (email) {
      parentupdate.email = email;
    }
    if (phone) {
      parentupdate.phone = phone;
    }
    if (gender) {
      parentupdate.gender = gender;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      parentupdate.password = hashedPassword;
    }

    const updatedParent = await Parent.findByIdAndUpdate(id, parentupdate, {
      new: true,
    }).populate({
      path: "Children.child",
    });

    console.log("hey" + r.data.username);

    let updateChatUser = await axios.patch(
      `https://api.chatengine.io/users/${r.data.id}/`,
      {
        username: updatedParent.name,
      },
      {
        headers: {
          "PRIVATE-KEY": process.env.CHAT_ENGINE_PRIVATE_KEY,
        },
      }
    );
    // Find and update the parent document

    // If no parent was found with the given ID, return a 404 error
    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // If the update was successful, return the updated parent
    res
      .status(200)
      .json({ message: "Parent updated successfully", parent: updatedParent });
  } catch (error) {
    // If an error occurs during the update process, return a 500 error
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
    const parent = await Parent.findOne({ email }).populate({
      path: "Children.child",
    });

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
    const parents = await Parent.find().populate({
      path: "Children.child",
      select: "firstName lastName grandFathersName",
    });
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
    try {
      r = await axios.get("https://api.chatengine.io/users/me/", {
        headers: {
          "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
          "User-Name": deletedParent.name,
          "User-Secret": 12345678,
        },
      });

      console.log("hey" + r.data);
      let deletedchatuser = await axios.delete(
        `https://api.chatengine.io/users/${r.data.id}/`,
        {
          headers: {
            "PRIVATE-KEY": process.env.CHAT_ENGINE_PRIVATE_KEY,
          },
        }
      );
      console.log(deletedchatuser.data);
    } catch (e) {
      console.log(e);
      //  return res.status(e.response.status).json(e.response.data);
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
