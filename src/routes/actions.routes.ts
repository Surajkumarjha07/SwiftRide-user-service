import express from "express";
import handleSignUp from "../controllers/actions.controllers/signUp.controller.js";
import handleLogIn from "../controllers/actions.controllers/logIn.controller.js";
import handleUpdateUserInfo from "../controllers/actions.controllers/update.controller.js";
import authenticate from "../middlewares/userAuth.middleware.js";
import handleDeleteUser from "../controllers/actions.controllers/delete.controller.js";
import handleLogOut from "../controllers/actions.controllers/logout.controller.js";

const router = express.Router();

router.post("/sign-up", handleSignUp);
router.post("/log-in", handleLogIn);
router.put("/update-user", authenticate, handleUpdateUserInfo);
router.delete("/delete-user", authenticate, handleDeleteUser);
router.post("/logout", handleLogOut);

export default router;