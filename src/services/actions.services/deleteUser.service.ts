import prisma from "../../config/database.js";
import bcrypt from "bcrypt";
import { deleteType } from "../../types/actionPayloads.type.js";

async function deleteUser({ userEmail, password }: deleteType) {
    try {
        const user = await prisma.users.findFirst({ where: { email: userEmail } })

        if (!user) {
            throw new Error("User doesn't exist!");
        }

        let passwordMatched;
        if (user) {
            passwordMatched = await bcrypt.compare(password, user.password);
        }

        if (!passwordMatched) {
            throw new Error("Incorrect password!");
        }

        const deletedUser = await prisma.users.delete({ where: { email: userEmail } });
        return deletedUser;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
}

export default deleteUser;