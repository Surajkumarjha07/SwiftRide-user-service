import prisma from "../../config/database.js";
import { logInType } from "../../types/actionPayloads.type.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function logInUser({ email, password }: logInType) {
    try {
        const user = await prisma.users.findFirst({ where: { email } });

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(password, user.password);
        }

        if (!user || !passwordMatched) {
            throw new Error("Incorrect email or password!");
        }

        const token = jwt.sign({
            userId: user.userId,
            userEmail: email,
            userName: user.name,
            role: user.role
        },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return token;

    } catch (error) {
        if (error instanceof Error) {
            console.log("LogIn service error: ", error.message);
            throw error;
        }
    }
}

export default logInUser;