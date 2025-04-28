import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

async function signUpUser({ email, name, password, role }) {
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
        console.log("SignUp service error: ", error.message);
        throw error;
    }
}

async function logInUser({ email, password }) {
    try {
        const user = await prisma.users.findFirst({ where: { email } })

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(password, user.password);
        }

        if (!user || !passwordMatched) {
            throw new Error("Incorrect email or password!");
        }

        const token = jwt.sign({ email, name: user.name, id: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return token;
    } catch (error) {
        console.log("LogIn service error: ", error.message);
        throw error;
    }
}

async function updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email }) {
    try {
        const user = await prisma.users.findFirst({
            where: { email }
        });

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(oldPassword, user.password);
        }

        if (!passwordMatched || !user) {
            throw new Error("Incorrect Email or Password!");
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await prisma.users.update({
            where: { email },
            data: { email: newEmail, name: newName, password: hashedPassword, role: newRole }
        })
        return updatedUser;
    } catch (error) {
        console.log("Update service error: ", error.message);
        throw error;
    }
}

async function deleteUser({ email, password }) {
    try {
        const user = await prisma.users.findFirst({ where: { email } })

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(password, user.password);
        }

        if (!user || !passwordMatched) {
            throw new Error("Incorrect email or password!");
        }

        const deletedUser = await prisma.users.delete({ where: { email } });
        return deletedUser;
    } catch (error) {
        console.log("Delete service error: ", error.message);
        throw error;
    }
}

export const userService = { signUpUser, logInUser, updateUser, deleteUser };