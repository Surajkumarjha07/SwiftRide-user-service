import express from "express";
import handleSignUp from "../controllers/signUp.js";
import handleLogIn from "../controllers/logIn.js";
import handleUpdateUserInfo from "../controllers/update.js";
import authenticate from "../middlewares/userAuth.js";
import handleDeleteUser from "../controllers/delete.js";

const router = express.Router();

router.post("/sign-up", handleSignUp);
router.post("/log-in", handleLogIn);
router.put("/update-user", authenticate, handleUpdateUserInfo);
router.delete("/delete-user", authenticate, handleDeleteUser);

export default router;