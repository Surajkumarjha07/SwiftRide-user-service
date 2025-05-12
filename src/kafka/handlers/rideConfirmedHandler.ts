import { EachMessagePayload } from "kafkajs";
import prisma from "../../prisma/prismaClient.js";
import { isInRide } from "@prisma/client";

async function rideConfirmedHandler({ message }: EachMessagePayload) {
    try {
        const { id, rideData } = JSON.parse(message.value!.toString());

        await prisma.users.update({
            where: { userId: id },
            data: {
                in_ride: isInRide.IN_RIDE
            }
        });

        // later we use some emitter to notify user for mobile interactivity

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in ride-confirm handler ${error.message}`);
        }
    }
}

export default rideConfirmedHandler;