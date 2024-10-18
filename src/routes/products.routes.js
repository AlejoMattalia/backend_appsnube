import { Router } from "express";
import { authAdmin, auth} from "../middleware/auth.js";
import productsController from "../controller/products.controller.js";

const router = Router();

router.post("/create_product", authAdmin, productsController.createProduct);
router.get("/one_product/:id", auth, productsController.oneProduct);
router.get("/get_products/:page?", auth, productsController.getProducts);
router.patch("/update_product/:id", authAdmin, productsController.updateProduct);
router.delete("/delete_product/:id", authAdmin, productsController.deleteProduct)
router.patch("/update_stock/:id", auth, productsController.updateStock)

export default router