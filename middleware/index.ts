import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../drizzle";
import { adminModel } from "../models/adminModel";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "defaultSecret";

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        const { email, tokenVersion } = decoded as { email: string; tokenVersion: number }; 

        if (!email || tokenVersion === undefined) {
            return res.status(403).json({ message: "Invalid token payload" });
        }

        const user = await db.select().from(adminModel).where(eq(adminModel.email, email));

        if (user.length === 0) {
            return res.status(403).json({ message: "User not found" });
        }

        const currentTokenVersion = user[0].tokenVersion || 0;

        if (currentTokenVersion !== tokenVersion) {
            return res.status(403).json({ message: "Token invalidated due to password change" });
        }

        req.user = { email, roles: user[0].role }; 

        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};



export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as { email: string; roles: string | string[] };

        if (!user || !user.roles) {
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }

        const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

        const hasPermission = userRoles.some(role => allowedRoles.includes(role));

        if (!hasPermission) {
            return res.status(403).json({ message: "Access denied: insufficient permissions" });
        }

        next(); 
    };
};
