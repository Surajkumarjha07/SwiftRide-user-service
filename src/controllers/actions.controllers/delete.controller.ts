import { Request, Response } from "express";
import { userService } from "../../services/actions.services/index.service.js";
import UserPayload from "../../types/userPayload.type.js";

async function handleDeleteUser(req: Request, res: Response) {
    try {
        const { password } = req.body;
        const { userEmail } = req.user as UserPayload;

        if (!password || !userEmail) {
            res.status(400).json({
                message: "Enter all credentials!"
            });
            return;
        }

        const deletedUser = await userService.deleteUser({ userEmail, password });

        res.status(200).json({
            message: "User deleted!",
            deletedUser
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message || "Internal server error!"
            });
            return;
        }
    }
}

export default handleDeleteUser;