import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function handleDeleteUser(req, res) {
    try {
        const { password } = req.body;
        const { email } = req.user;

        const user = await prisma.users.findFirst({ where: { email } })

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(password, user.password);
        }

        if (!user || !passwordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password!"
            });
        }

        const deletedUser = await prisma.users.delete({ where: { email } });

        res.status(200).json({
            message: "User deleted!",
            deletedUser
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleDeleteUser;