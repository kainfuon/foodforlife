import userModel from "../models/userModel.js"

// add item to cart
const addItemToCart = async (req, res) => {
    try {
        //console.log("Request body:", req.body);
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        // const userID = req.body.userId;
        // const itemID = req.body.itemId;
        // console.log( itemID); 
        // console.log(userData);
        //console.log(cartData);
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({success: true, message: "Item added to cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

//remove item from cart
const removeItemFromCart = async (req, res) => {
    try {
        //console.log("Request body:", req.body);
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        //console.log(cartData);
        //console.log(cartData[req.body.itemId]);
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        //const itemID = req.body.itemId;
        //console.log( itemID);
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Item removed from cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

//fetch cart items
const getCartItems = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success: true, cartData});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Internal server error"});
    }
}

export { addItemToCart, removeItemFromCart, getCartItems };


