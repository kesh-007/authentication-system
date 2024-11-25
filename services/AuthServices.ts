import { adminModel, User } from "../models/adminModel";
import db from "../drizzle";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "defaultSecret";

export class AuthServices {
    async registerUser(email: string, password: string, role: string, name: string): Promise<User> {
        try {
            const user = new User(email, password);
            await user.hashPassword();
            await db.insert(adminModel).values({
                email: user.email,
                password: user.password,
                role: role,
                name: name,
            });
            return user;
        } catch (error) {
            throw new Error("Error registering user");
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const user = await db.select().from(adminModel).where(eq(adminModel.email, email));
            if (user.length === 0) {
                return { message: "User not found" };
            }
            const userInstance = new User(user[0].email, user[0].password);

            const isPasswordCorrect = await userInstance.comparePassword(password);
            if (!isPasswordCorrect) {
                return { message: "Password incorrect" };
            }

            const token = jwt.sign(
                { email: userInstance.email, role: user[0].role,tokenVersion:user[0].tokenVersion },
                SECRET_KEY,
                { expiresIn: "1h" } 
            );

            return { email: userInstance.email, message: "success", role: user[0].role, token };
        } catch (err) {
            throw new Error("Error logging in user");
        }
    }

    async changePassword(email: string, newpassword: string, oldpassword: string) {
        try {
            const user = await db.select().from(adminModel).where(eq(adminModel.email, email));
            if (user.length === 0) {
                return { message: "User not found" };
            }
            const userInstance = new User(user[0].email, user[0].password);

            const isPasswordCorrect = await userInstance.comparePassword(oldpassword);
            if (!isPasswordCorrect) {
                return { message: "Password incorrect" };
            }

            userInstance.password = newpassword;
            await userInstance.hashPassword();
            await db.update(adminModel).set({ password: userInstance.password,tokenVersion:(user[0].tokenVersion ||0) +1 }).where(eq(adminModel.email, email));
            return { message: "success" };
        } catch (err) {
            throw new Error("Error changing password");
        }
    }
}
