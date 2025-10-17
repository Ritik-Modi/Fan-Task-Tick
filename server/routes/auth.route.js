import { Router } from "express";
import { sendOtp, signUp, login, logOut } from "../controllers/Auth.controller.js";

const router = Router();

router.post("/sendOtp", sendOtp);
router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logout", logOut);


export default router;
