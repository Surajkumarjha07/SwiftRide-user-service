import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "../../config/database.js";
import { signUpType } from "../../types/actionPayloads.type.js";

dotenv.config();

async function signUpUser({ email, name, password, role }: signUpType) {
    try {
        const existingUser = await prisma.users.findFirst({ where: { email } })

        if (existingUser) {
            throw new Error("Email already exists!");
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
        return user;
    } catch (error) {
        if (error instanceof Error) {
            console.log("SignUp service error: ", error.message);
            throw error;
        }
    }
}

export default signUpUser