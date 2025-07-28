import { Request, Response } from "express";
import { userService } from "../../services/actions.services/index.service.js";
import UserPayload from "../../types/userPayload.type.js";

async function handleUpdateUserInfo(req: Request, res: Response): Promise<any> {
    try {
        const { newEmail, newName, newPassword, oldPassword } = req.body;
        const { userEmail } = req.user as UserPayload;

        if (!userEmail) {
            return res.status(403).json({
                message: "email not available or token expired!"
            })
        }

        if (!newEmail && !newName && !newPassword) {
            return res.status(400).json({
                message: "atleast one field is required to update account."
            })
        }

        const updatedUser = await userService.updateUser({ newEmail: newEmail.trim(), newName: newName.trim(), newPassword: newPassword.trim(), oldPassword, userEmail });

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