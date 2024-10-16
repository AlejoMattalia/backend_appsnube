import { Router } from "express";
import { authAdmin, auth} from "../middleware/auth.js";
import brandController from "../controller/brands.controller.js"


const router = Router();

router.post("/create_brand", authAdmin, brandController.createBrand)
router.get("/get_brands", auth, brandController.getBrands)
router.patch("/update_brand/:id", authAdmin, brandController.updateBrand)
router.delete("/delete_brand/:id", authAdmin, brandController.deleteBrand)

export default router