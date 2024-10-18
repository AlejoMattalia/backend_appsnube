import { Router } from "express";
import { auth, authAdmin } from "../middleware/auth.js";
import ordersController from "../controller/orders.controller.js"
const router = Router();


router.post("/create_order", ordersController.createOrder)
router.get("/list_orders", authAdmin, ordersController.listOrders)



export default router