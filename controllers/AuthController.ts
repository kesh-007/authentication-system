import { Request, Response } from 'express';
import { AuthServices } from '../services/AuthServices';

export class AuthController {
    private auth: AuthServices;

    // Constructor to initialize AuthServices
    constructor() {
        this.auth = new AuthServices();
    }

    // Register a new user
    async register(req: Request, res: Response) {
        const { email, password, name, role } = req.body; // Destructure input from request body

        try {
            // Call AuthServices to register the user
            const user = await this.auth.registerUser(email, password, name, role);
            res.status(201).json(user); // Return successful response with user data
        } catch (error) {
            // Handle any errors during registration
            res.status(500).json({ message: "Error registering user" });
        }
    }

    // Login a user and generate a JWT token
    async login(req: Request, res: Response) {
        const { email, password } = req.body; // Destructure input from request body

        try {
            // Call AuthServices to login the user
            const user = await this.auth.loginUser(email, password);

            if (user.message === "success") {
                // If login is successful, return the token and user details
                return res.status(200).json(user);
            } else {
                // If login fails, return an error message
                return res.status(400).json(user);
            }
        } catch (error) {
            // Handle any errors during login
            res.status(500).json({ message: "Error logging in user", error: error });
        }
    }

    // Change the user's password
    async changepassword(req: Request, res: Response) {
        const { email, newpassword, oldpassword } = req.body; // Destructure input from request body

        try {
            // Call AuthServices to change the user's password
            const user = await this.auth.changePassword(email, newpassword, oldpassword);

            if (user.message === "success") {
                // If password change is successful, return success message
                return res.status(200).json(user);
            } else {
                // If password change fails, return error message
                return res.status(400).json(user);
            }
        } catch (error) {
            // Handle any errors during password change
            res.status(500).json({ message: "Error changing password" });
        }
    }
}
