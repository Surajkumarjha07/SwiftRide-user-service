import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function handleSignUp(req, res) {
    try {
        const { email, name, password, role } = req.body;
        
        if (!email || !name || !password || !role) {
            res.status(400).json({
                message: "Enter required details!"
            });
            return;
        }

        const existingUser = await prisma.users.findFirst({ where: { email } })

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists!"
            })
        }

        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let userId = '';

        for (let i = 0; i < 15; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            userId = userId + alpha[pos];
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await prisma.users.create({ data: { email, name, password: hashedPassword, role, userId } });

        res.status(200).json({
            message: "User created!",
            user
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleSignUp;