import { Request, Response } from "express";
import { userService } from "../../services/userServices/index.js";
import UserPayload from "../../types/userPayloads.js";

async function handleDeleteUser(req: Request, res: Response) {
    try {
        const { password } = req.body;
        const { userEmail } = req.user as UserPayload;

        const deletedUser = await userService.deleteUser({ userEmail, password });

        res.status(200).json({
            message: "User deleted!",
            deletedUser
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

export default handleDeleteUser;