import producer from "../kafka/producer.js"

async function handleRideRequest(req, res) {
    try {
        const { location, destination } = req.body;
        const { id } = req.user;

        if (!id) {
            res.status(404).json({
                message: "user not defined!"
            });
            return;
        }

        if (!location || !destination) {
            res.status(400).json({
                message: "location and destination are required!"
            });
            return;
        }

        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let rideId = '';

        for (let i = 0; i < 30; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            rideId = rideId + alpha[pos];
        }        

        await producer.sendProducerMessage("ride-request", { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
        res.status(200).json({
            message: "ride request sent successfully!"
        })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleRideRequest;