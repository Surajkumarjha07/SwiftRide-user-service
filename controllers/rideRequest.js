import producer from "../kafka/producer.js"

async function handleRideRequest(req, res) {
    try {
        const { location, destination } = req.body;
        const { name } = req.user;

        if (!name) {
            res.status(404).json({
                message: "user not defined!"
            })
        }

        if (!location || !destination) {
            res.status(400).json({
                message: "location and destination are required!"
            })
        }

        await producer.sendProducerMessage("ride-request", { name, location, destination });
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