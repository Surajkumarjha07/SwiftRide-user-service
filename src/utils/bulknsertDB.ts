import prisma from "../config/database.js";

async function bulkInsertDB(chunks: Array<any>): Promise<any> {

    for (const chunk of chunks) {

        const ids = chunk.map(([userId, coordinates]: any) => (
            `'${userId}'`
        )).join(", ");

        const latitudeCases = chunk.map(([userId, coordinates]: any) => (
            `WHEN '${userId}' THEN ${coordinates.latitude}`
        )).join(" ")

        const longitudeCases = chunk.map(([userId, coordinates]: any) => (
            `WHEN '${userId}' THEN ${coordinates.longitude}`
        )).join(" ")

        const query = `
            UPDATE users 
            SET
            latitude = CASE userId ${latitudeCases} END,
            longitude = CASE userId ${longitudeCases} END
            WHERE userId IN (${ids});
        `;

        await prisma.$executeRawUnsafe(query);

    }

}

export default bulkInsertDB;