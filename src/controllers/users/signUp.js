import { userService } from "../../services/userService.js";

async function handleSignUp(req, res) {
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
        return res.status(400).json({
            message: error.message || "Internal server error!"
        })
    }
}

export default handleSignUp;