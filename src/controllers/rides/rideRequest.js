import { rideService } from "../../services/rideService.js";

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

        await rideService.rideRequest({ id, location, destination });

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