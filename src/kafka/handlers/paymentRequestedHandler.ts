import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";

async function handlePaymentRequested({ message }: EachMessagePayload) {
    try {
        const { rideData, captainId } = JSON.parse(message.value!.toString()); 

        console.log("payment data: " + rideData);
        
        // will emit sockets to user 

        // await sendProducerMessage("payment-requested-notify-user", {rideData, captainId});

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in payment-requested handler: ${error.message}`);
        }
    }
}

export default handlePaymentRequested;