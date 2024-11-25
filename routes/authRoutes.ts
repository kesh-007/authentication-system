import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);


router.post('/register', asyncHandler((req, res) => authController.register(req, res)));

router.post('/login', asyncHandler((req, res) => authController.login(req, res)));
router.post('/change-password', asyncHandler((req, res) => authController.changepassword(req, res)));

export default router;
