// tests/cartController.test.js

import { addItemToCart, removeItemFromCart, getCartItems } from '../controllers/cartController';
import userModel from '../models/userModel.js';

jest.mock('../models/userModel.js');

describe('Cart Functions', () => {
    const mockRequest = (userId, itemId) => ({
        body: { userId, itemId },
    });

    const mockResponse = () => {
        const res = {};
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    it('should add an item to the cart', async () => {
        const req = mockRequest('userId123', 'itemId456');
        const res = mockResponse();
        
        // Mock the user data returned from the database
        userModel.findById.mockResolvedValueOnce({ cartData: {} });
        userModel.findByIdAndUpdate.mockResolvedValueOnce({});

        await addItemToCart(req, res);

        expect(userModel.findById).toHaveBeenCalledWith('userId123');
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { cartData: { 'itemId456': 1 } });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item added to cart' });
    });

    it('should increment the item count if already in the cart', async () => {
        const req = mockRequest('userId123', 'itemId456');
        const res = mockResponse();
        
        // Mock the user data with existing items in the cart
        userModel.findById.mockResolvedValueOnce({ cartData: { 'itemId456': 1 } });
        userModel.findByIdAndUpdate.mockResolvedValueOnce({});

        await addItemToCart(req, res);

        expect(userModel.findById).toHaveBeenCalledWith('userId123');
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { cartData: { 'itemId456': 2 } });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item added to cart' });
    });

    it('should remove an item from the cart', async () => {
        const req = mockRequest('userId123', 'itemId456');
        const res = mockResponse();
        
        // Mock the user data with existing items in the cart
        userModel.findById.mockResolvedValueOnce({ cartData: { 'itemId456': 2 } });
        userModel.findByIdAndUpdate.mockResolvedValueOnce({});

        await removeItemFromCart(req, res);

        expect(userModel.findById).toHaveBeenCalledWith('userId123');
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { cartData: { 'itemId456': 1 } });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item removed from cart' });
    });

    it('should not decrement the item count below zero', async () => {
        const req = mockRequest('userId123', 'itemId456');
        const res = mockResponse();
        
        // Mock the user data with 0 items in the cart
        userModel.findById.mockResolvedValueOnce({ cartData: { 'itemId456': 0 } });
        userModel.findByIdAndUpdate.mockResolvedValueOnce({});

        await removeItemFromCart(req, res);

        expect(userModel.findById).toHaveBeenCalledWith('userId123');
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { cartData: { 'itemId456': 0 } });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Item removed from cart' });
    });

    it('should fetch cart items', async () => {
        const req = mockRequest('userId123', null);
        const res = mockResponse();
        
        // Mock the user data with items in the cart
        userModel.findById.mockResolvedValueOnce({ cartData: { 'itemId456': 2 } });

        await getCartItems(req, res);

        expect(userModel.findById).toHaveBeenCalledWith('userId123');
        expect(res.json).toHaveBeenCalledWith({ success: true, cartData: { 'itemId456': 2 } });
    });

    it('should handle errors gracefully', async () => {
        const req = mockRequest('userId123', 'itemId456');
        const res = mockResponse();
        
        // Simulate a database error
        userModel.findById.mockRejectedValueOnce(new Error('Database error'));

        await addItemToCart(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
    });
});