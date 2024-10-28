const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = require("../models/users");

const registerLoginControlTest = async (req, res) => {
  console.log("this is test route");
  res.json({ msg: "test route" });
};

const authLoginControl = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be either email or userId
  console.log("identifier:", identifier, "password:", password);
  try {
    // Find user by either email or userId
    console.log("identifier:", identifier, "password:", password);
    const user = await userSchema.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    console.log("user:", typeof user, user);
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create session for the user
    req.session.user = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };

    console.log("User logged in successfully and session created");
    res.json({ msg: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const authRegisterControl = async (req, res) => {
    console.log("t1");
  const { name, userName, email, mobile, password, gender, dob } = req.body;
  try {
    // Check if the User collection exists
    const collections = await mongoose.connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (collections.length === 0) {
      console.log(
        "Collection 'users' does not exist. Creating a new collection on the first entry."
      );
    }

    // Check if a user with the same email or userId already exists
    const existingUser = await userSchema.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email or userId." });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user instance with the hashed password and save it
    const newUser = new userSchema({
      name,
      userName,
      email,
      mobile,
      password: hashedPassword, // Save hashed password
      gender,
      dob,
    });
    await newUser.save();
    console.log("t1");
    const sucessfullMsg = userName + " registered successfully";
    console.log("New user registered successfully");
    res.status(201).json({ msg: sucessfullMsg });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const authLogoutControl = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res
        .status(500)
        .json({ msg: "Server error, please try again later" });
    }
    res.json({ msg: "Logout successful" });
  });
};

module.exports = {
  registerLoginControlTest,
  authLoginControl,
  authRegisterControl,
  authLogoutControl,
};
