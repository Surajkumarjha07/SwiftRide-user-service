import { Request, Response } from "express";
import { userService } from "../../services/userServices/index.js";

async function handleSignUp(req: Request, res: Response) {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password || !role) {
        res.status(400).json({
            message: "Enter required details!"
        });
        return;
    }

    try {
        const user = await userService.signUpUser({ email, name, password, role });

        res.status(201).json({
            message: "User created!",
            user
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

export default handleSignUp;