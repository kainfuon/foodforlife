import express from "express"
import { addItemToCart, removeItemFromCart, getCartItems } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addItemToCart)
cartRouter.post("/remove", authMiddleware, removeItemFromCart)
cartRouter.post("/get", authMiddleware, getCartItems)

export default cartRouter;
