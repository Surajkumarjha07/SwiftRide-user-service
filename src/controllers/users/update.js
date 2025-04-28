import { userService } from "../../services/userService.js";

async function handleUpdateUserInfo(req, res) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.user;

        const updatedUser = await userService.updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email })

        res.status(200).json({
            message: "User updated!",
            updatedUser
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleUpdateUserInfo;