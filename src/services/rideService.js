import { producer } from "../kafka/producerInIt.js";

async function rideRequest({ id, location, destination }) {
    try {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let rideId = '';

        for (let i = 0; i < 30; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            rideId = rideId + alpha[pos];
        }

        await producer.sendProducerMessage("ride-request", { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
    } catch (error) {
        console.log("Ride request error: ", error.message);
    }
}

async function rideCancel({ }) {
    try {

    } catch (error) {
        console.log("Ride cancel service error: ", error.message);
    }
}

export const rideService = { rideRequest, rideCancel };