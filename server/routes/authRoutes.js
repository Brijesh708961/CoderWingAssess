// server/routes/authRoutes.js
import express from "express";
import {
  loginUser,
  registerUser,
  verifyLoginOtp,
  verifyRegisterOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register/verify", verifyRegisterOtp);
router.post("/login", loginUser);
router.post("/login/verify", verifyLoginOtp);

export default router;
