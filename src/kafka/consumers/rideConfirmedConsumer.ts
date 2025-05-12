import { ride_confirmed_consumer } from "../consumerInIt.js";
import rideConfirmedHandler from "../handlers/rideConfirmedHandler.js";

async function rideConfirmed() {
    try {
        await ride_confirmed_consumer.subscribe({topic: "ride-confirmed", fromBeginning: true});
        
        await ride_confirmed_consumer.run({
            eachMessage: rideConfirmedHandler
        });

    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in getting confirmation! ${error.message}`);
        }
    }
}

export default rideConfirmed;