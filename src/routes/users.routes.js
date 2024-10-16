import { Router } from "express";
import userController from "../controller/users.controller.js"
const router = Router();


router.post("/register", userController.register);
router.post("/login", userController.login);


export default router