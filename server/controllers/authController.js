// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";
import { createOtp, verifyOtp } from "../utils/otpStore.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const buildTokenResponse = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 1. Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = createOtp("register", email, { name, email, password });
    await sendOtpEmail({ email, otp, purpose: "signup" });

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while sending signup OTP" });
  }
};

// @desc    Verify signup OTP and create user
// @route   POST /api/auth/register/verify
export const verifyRegisterOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const verification = verifyOtp("register", email, otp);

    if (!verification.ok) {
      return res.status(400).json({ message: verification.message });
    }

    const { name, password } = verification.payload;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(buildTokenResponse(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup verification" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const otp = createOtp("login", email);
    await sendOtpEmail({ email, otp, purpose: "login" });

    res.json({
      message: "OTP sent to your email. Please verify to complete login.",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while sending login OTP" });
  }
};

// @desc    Verify login OTP and return token
// @route   POST /api/auth/login/verify
export const verifyLoginOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const verification = verifyOtp("login", email, otp);

    if (!verification.ok) {
      return res.status(400).json({ message: verification.message });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(buildTokenResponse(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login verification" });
  }
};
