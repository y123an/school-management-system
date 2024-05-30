const bcrypt = require("bcrypt");
const SuperAdmin = require("../models/superAdminSchema.js");

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
          admin.password = undefined; // Remove the password field before sending the response
          res.send(admin);
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
