const { Router } = require("express");

const createUserRules = require("../middlewares/create-user-rules");
const loginUserRules = require("../middlewares/login-user-rules");
const verifyLoginRules = require("../middlewares/verify-login-rules");

const UserModel = require("../models/user-model");
const OTPModel = require("../models/otp-model");

const { matchPassword } = require("../../../shared/password-utils");
const { encodeToken } = require("../../../shared/jwt-utils");
const authorize = require("../../../shared/middlewares/authorize");
const { randomNumberOfDigits } = require("../../../shared/compute-utils");
const { sendEmail } = require("../../../shared/email-utils");

const usersRoute = Router();


usersRoute.post("/register", createUserRules, async (req, res) => {
  try {
    const userData = req.body;
    userData.email = userData.email.toLowerCase();

    const exists = await UserModel.findOne({ email: userData.email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await UserModel.create(userData);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
});


usersRoute.post("/login", loginUserRules, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!matchPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = randomNumberOfDigits(6).toString();

    await OTPModel.findOneAndUpdate(
      { account: user._id },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    await sendEmail(
      email,
      "Cakeopia Login OTP 🍰",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});


usersRoute.post("/verify-login", verifyLoginRules, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    const savedOTP = await OTPModel.findOne({ account: user._id });
    if (!savedOTP || savedOTP.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const token = encodeToken({
      _id: user._id,
      email: user.email,
      roles: user.roles,
      name: user.name,
    });

    await OTPModel.deleteOne({ account: user._id });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser, token });
  } catch {
    res.status(500).json({ message: "Verification failed" });
  }
});

usersRoute.get("/", authorize(["admin"]), async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.json(users);
});

module.exports = usersRoute;
