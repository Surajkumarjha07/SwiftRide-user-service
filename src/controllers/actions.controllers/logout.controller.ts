import { Request, Response } from "express";

async function handleLogOut(req: Request, res: Response): Promise<any> {
    try {

        return res.clearCookie("authToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        })
            .status(200)
            .json({
                message: "Logout successful!"
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

export default handleLogOut;