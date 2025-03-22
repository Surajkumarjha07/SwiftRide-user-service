import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function authenticate(req, res, next) {
    let token = req.cookies.authtoken || req.headers["authorization"]?.split("Bearer ")[1];
    if (!token) {
        return res.status(404).json({ message: "token not available" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified) {
            req.user = verified;
            next();
        }
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export default authenticate;