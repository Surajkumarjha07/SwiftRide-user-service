import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import UserPayload from "../types/userPayloads.js";

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload
    }
}

dotenv.config();

async function authenticate(req: Request, res: Response, next: NextFunction) {
    let authHeader = req.headers["authorization"];
    
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = req.cookies.authToken || authHeader.split(" ")[1];
    }

    if (!token) {
        res.status(404).json({ message: "token not available" });
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        if (verified) {
            req.user = verified as UserPayload;
            next();
        }
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export default authenticate;