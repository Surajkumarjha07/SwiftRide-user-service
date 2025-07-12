import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { isInRide } from "@prisma/client";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideConfirmedHandler({ message }: EachMessagePayload) {
    try {
        const { captainId, rideData } = JSON.parse(message.value!.toString());
        const { userId } = rideData;

        console.log("capId: " + captainId);
        console.log("rd: " + Object.keys(rideData));

        if (userId) {
            await prisma.users.update({
                where: {
                    userId: userId
                },
                data: {
                    in_ride: isInRide.IN_RIDE
                }
            });
        }

        console.log(`ride confirmed by ${captainId} for ${rideData.rideId}`);

        // later we use some emitter to notify user for mobile interactivity

        await sendProducerMessage("ride-confirmed-notify-user", { rideData });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in ride-confirm handler ${error.message}`);
        }
    }
}

export default rideConfirmedHandler;