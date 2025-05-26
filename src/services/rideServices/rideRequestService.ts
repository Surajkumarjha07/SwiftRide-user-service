import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import { rideRequestType } from "../../types/rideTypes.js";

async function rideRequest({ userId, locationCoordinates, destinationCoordinates }: rideRequestType) {
    try {
        // kafka message
        await sendProducerMessage("calculate-fare", { userId, locationCoordinates, destinationCoordinates });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in confirm-ride service: ${error.message}`);
        }
    }
}

export default rideRequest;