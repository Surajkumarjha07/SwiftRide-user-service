import { rideService } from "../../services/rideService.js";

async function handleRideCancellation(req, res) {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({
                message: "token inavalid!"
            })
        }

        await rideService.rideCancel({});

        res.status(200).json({
            message: "ride cancellation successfull!"
        })

    } catch (error) {
        console.log("error in ride cancellation!");        
    }
}

export default handleRideCancellation;