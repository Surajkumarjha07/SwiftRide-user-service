import UserPayload from "./types/userPayloads.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload
    }
}