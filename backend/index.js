const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser")
const app = express();
const Routes = require("./routes/route.js");
const bcrypt = require("bcrypt");
const superAdminSchema = require("./models/superAdminSchema.js");
const PORT = process.env.PORT || 4000;

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.use("/", Routes);

async function createSuperAdmin() {
  const adminExists = await superAdminSchema.findOne({
    email: "superadmin@example.com",
  });
  if (adminExists) {
    console.log("Super admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("superadminpassword", 10);

  const superAdmin = new superAdminSchema({
    name: "Super Admin",
    email: "superadmin@example.com",
    password: hashedPassword,
  });

  try {
    await superAdmin.save();
    console.log("Super admin created successfully");
  } catch (err) {
    console.error("Error creating super admin", err);
  }
}

createSuperAdmin();

app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
