
async function handleRideCancellation(req, res) {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({
                message: "token inavalid!"
            })
        }

    } catch (error) {
        console.log("error in ride cancellation!");        
    }
}

export default handleRideCancellation;