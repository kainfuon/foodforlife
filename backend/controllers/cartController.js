import userModel from "../models/userModel.js"

// add item to cart
const addItemToCart = async (req, res) => {
    try {
        let userData = await userModel.findByIdAndUpdate(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.addItemToCart]){
            cartData[req.body.addItemToCart] = 1;
        } else {
            cartData[req.body.addItemToCart] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.status(200).json({success: true, message: "Item added to cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

//remove item from cart
const removeItemFromCart = async (req, res) => {
    try {
        let userData = await userModel.findByIdAndUpdate(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.removeItemFromCart] > 0){
            cartData[req.body.removeItemFromCart] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.status(200).json({success: true, message: "Item removed from cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

//fetch cart items
const getCartItems = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.status(200).json({success: true, cartData});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export { addItemToCart, removeItemFromCart, getCartItems };


