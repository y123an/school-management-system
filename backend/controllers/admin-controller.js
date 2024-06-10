const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Notice = require("../models/noticeSchema.js");
const Complain = require("../models/complainSchema.js");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/nodemailer.js");

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const adminRegister = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({
      ...req.body,
      password: hashedPass,
    });

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });

    if (existingAdminByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await admin.save();
      result.password = undefined;

      const recipient = req.body.email;
      const subject = "Welcome to parent and teacher help desk";
      const text = "Welcome to parent and teacher help desk";
      const html = `<b>Welcome to parent and teacher help desk</b>
      <p>you are assigned as admin on the parent and help teacher desk system your password is ${req.body.password}</p>
      `;
      sendEmail(recipient, subject, text, html);

      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const adminLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      if (req.body.password === admin.password) {
        // Create a payload for the JWT
        const payload = {
          email: admin.email,
          role: "Admin",
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
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } else {
    res.send({ message: "Email and password are required" });
  }
};

const getAdminDetail = async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = undefined;
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const result = await Admin.findByIdAndDelete(req.params.id);

    await Sclass.deleteMany({ school: req.params.id });
    await Student.deleteMany({ school: req.params.id });
    await Teacher.deleteMany({ school: req.params.id });
    await Subject.deleteMany({ school: req.params.id });
    await Notice.deleteMany({ school: req.params.id });
    await Complain.deleteMany({ school: req.params.id });

    res.send(result);
  } catch (error) {
    res.status(500).json(err);
  }
};

const getAdmins = async (req, res) => {
  try {
    let Admins = await Admin.find();
    console.log(Admins);
    if (Admins.length > 0) {
      let modifiedAdmins = Admins.map((admin) => {
        return { ...admin._doc, password: undefined };
      });
      res.send(modifiedAdmins);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateAdmin = async (req, res) => {
  try {
    let result = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    result.password = undefined;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminDetail,
};
