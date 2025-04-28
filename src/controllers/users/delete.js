import { userService } from "../../services/userService.js";

async function handleDeleteUser(req, res) {
    try {
        const { password } = req.body;
        const { email } = req.user;

        const deletedUser = await userService.deleteUser({ email, password });

        res.status(200).json({
            message: "User deleted!",
            deletedUser
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleDeleteUser;