import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import { logInType } from "../../types/userTypes.js";

async function deleteUser({ email, password }: logInType) {
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
        if (error instanceof Error) {   
            console.log("Delete service error: ", error.message);
            throw error;
        }
    }
}

export default deleteUser;