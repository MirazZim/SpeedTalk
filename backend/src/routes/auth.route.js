import express from "express";
const router = express.Router();    

import { signup, login, logout } from "../controllers/auth.controller.js";

router.post("/signup", signup);


router.post("/login", login);


router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

export default router;