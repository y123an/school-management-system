const bcrypt = require("bcrypt");
const SuperAdmin = require("../models/superAdminSchema.js");
const jwt = require("jsonwebtoken");

const superAdminLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      const admin = await SuperAdmin.findOne({ email: req.body.email });
      if (admin) {
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          admin.password
        );
        if (passwordMatch) {
          // Create a payload for the JWT
          const payload = {
            email: admin.email,
            role: "SuperAdmin",
          };

          // Sign the JWT token
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          // Do not send the password back
          admin.password = undefined;

          // Send the token along with the admin details
          res.send({ user: admin, token });
        } else {
          res.status(401).send({ message: "Invalid password" });
        }
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "An error occurred", error: error.message });
    }
  } else {
    res.status(400).send({ message: "Email and password are required" });
  }
};

module.exports = { superAdminLogIn };
