import deleteUser from "./deleteUserService.js";
import logInUser from "./logInUserService.js";
import signUpUser from "./signUpUserService.js";
import updateUser from "./updateUserService.js";

export const userService = { signUpUser, logInUser, updateUser, deleteUser };