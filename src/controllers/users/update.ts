import { Request, Response } from "express";
import { userService } from "../../services/userServices/index.js";
import UserPayload from "../../types/userPayloads.js";

async function handleUpdateUserInfo(req: Request, res: Response) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.user as UserPayload;

        const updatedUser = await userService.updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email })

        res.status(200).json({
            message: "User updated!",
            updatedUser
        })

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message || "Internal server error!"
            });
            return;
        }
    }
}

export default handleUpdateUserInfo;