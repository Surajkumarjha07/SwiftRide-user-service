import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import UserPayload from "../types/userPayloads.js";

dotenv.config();

async function authenticate(req: Request, res: Response, next: NextFunction): Promise<any> {
    let token = req.cookies.authToken || req.headers["authorization"]?.split("Bearer ")[1];

    if (!token) {
        return res.status(404).json({ message: "token not available" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        if (verified) {
            req.user = verified as UserPayload;
            next();
        }
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export default authenticate;