import UserPayload from "./types/userPayload.type.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload
    }
}