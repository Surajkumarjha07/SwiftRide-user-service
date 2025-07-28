import deleteUser from "./deleteUser.service.js";
import logInUser from "./logInUser.service.js";
import signUpUser from "./signUpUser.service.js";
import updateUser from "./updateUser.service.js";

export const userService = { signUpUser, logInUser, updateUser, deleteUser };