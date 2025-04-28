import express from "express";
import handleSignUp from "../controllers/users/signUp.js";
import handleLogIn from "../controllers/users/logIn.js";
import handleUpdateUserInfo from "../controllers/users/update.js";
import authenticate from "../middlewares/userAuth.js";
import handleDeleteUser from "../controllers/users/delete.js";

const router = express.Router();

router.post("/sign-up", handleSignUp);
router.post("/log-in", handleLogIn);
router.put("/update-user", authenticate, handleUpdateUserInfo);
router.delete("/delete-user", authenticate, handleDeleteUser);

export default router;