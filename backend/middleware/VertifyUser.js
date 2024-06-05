const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Invalid token format." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token." });
    }

    if (decoded.role !== "SuperAdmin" || decoded.role !== "Admin") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).send({ message: "You are not authorized." });
    }
  });
};

const verifyTeacherOrAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Invalid token format." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token." });
    }

    if (
      decoded.role !== "SuperAdmin" ||
      decoded.role !== "Admin" ||
      decoded.role !== "Teacher"
    ) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).send({ message: "You are not authorized." });
    }
  });
};

const verifySuperAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Invalid token format." });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to authenticate token.", err: err });
    }

    if (decoded.role !== "SuperAdmin") {
      return res.status(403).send({ message: "You are not authorized." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyAdmin,
  verifyTeacherOrAdmin,
  verifySuperAdmin,
};
