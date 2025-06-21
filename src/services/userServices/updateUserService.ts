import prisma from "../../config/database.js";
import { updateType } from "../../types/userTypes.js";
import bcrypt from "bcrypt";

async function updateUser({ newEmail, newName, newPassword, oldPassword, userEmail }: updateType) {
    try {
        const user = await prisma.users.findFirst({
            where: { email: userEmail }
        });

        let passwordMatched;
        if (user && oldPassword) {
            passwordMatched = await bcrypt.compare(oldPassword, user.password);
        }

        if (!passwordMatched || !user) {
            throw new Error("Incorrect Email or Password!");
        }

        let updateData: { email?: string, name?: string, password?: string } = {};

        if (newPassword) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        if (newEmail) {
            updateData.email = newEmail;
        }

        if (newName) {
            updateData.name = newName;
        }

        const updatedUser = await prisma.users.update({
            where: { email: userEmail },
            data: updateData
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