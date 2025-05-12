import { Request, Response } from "express";
import { userService } from "../../services/userServices/index.js";

async function handleLogIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const token = await userService.logInUser({ email, password });

        res.cookie("authToken", token!, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: "/"
        })

        res.status(200).json({
            message: "User Logged In!",
            token
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

export default handleLogIn;