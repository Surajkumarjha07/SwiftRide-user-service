import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function handleUpdateUserInfo(req, res) {
    try {
        const { newEmail, newName, newPassword, newRole, oldPassword } = req.body;
        const { email } = req.user;

        const user = await prisma.users.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(oldPassword, user.password);
        }

        if (!passwordMatched || !user) {
            return res.status(400).json({
                message: "Incorrect Email or Password!"
            })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await prisma.users.update({
            where: { email },
            data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
        })

        res.status(200).json({
            message: "User updated!",
            updatedUser
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleUpdateUserInfo;