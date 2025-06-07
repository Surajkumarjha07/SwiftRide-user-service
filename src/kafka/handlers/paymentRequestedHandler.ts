import { EachMessagePayload } from "kafkajs";

async function handlePaymentRequested({ message }: EachMessagePayload) {
    try {
        const { rideData, captainId } = JSON.parse(message.value!.toString()); 

        console.log("payment data: " + rideData);
        
        // will emit sockets to user 

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in payment-requested handler: ${error.message}`);
        }
    }
}

export default handlePaymentRequested;