import prisma from "../../prisma/prismaClient.js";
import { updateType } from "../../types/userTypes.js";
import bcrypt from "bcrypt";

async function updateUser({ newEmail, newName, newPassword, newRole, oldPassword, email }: updateType) {
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
        if (error instanceof Error) {   
            console.log("Update service error: ", error.message);
            throw error;
        }
    }
}

export default updateUser;