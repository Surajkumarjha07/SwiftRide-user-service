import { ride_completed_consumer } from "../consumerInIt.js";
import rideCompletedHandler from "../handlers/rideCompleted.handler.js";

async function rideCompleted() {
    try {
        await ride_completed_consumer.subscribe({topic: "ride-completed-notify-user", fromBeginning: true});
        await ride_completed_consumer.run({
            eachMessage: rideCompletedHandler
        })
        
    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in getting ride-completed notification: ` + error.message);
        }
    }
}

export default rideCompleted;