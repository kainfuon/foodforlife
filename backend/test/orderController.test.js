// tests/orderController.test.js

import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from '../controllers/orderController'; // Adjust the path as needed
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

jest.mock('../models/orderModel.js');
jest.mock('../models/userModel.js');
jest.mock('stripe');

const stripe = jest.fn();
Stripe.mockImplementation(() => stripe);

describe('Order Functions', () => {
    const mockRequest = (body) => ({
        body,
    });

    const mockResponse = () => {
        const res = {};
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    it('should place an order and create a Stripe session', async () => {
        const req = mockRequest({
            userId: 'userId123',
            items: [{ name: 'Pizza', price: 10, quantity: 2 }],
            amount: 2000,
            address: '123 Street',
        });
        const res = mockResponse();

        orderModel.mockImplementationOnce(() => ({
            save: jest.fn().mockResolvedValueOnce({ _id: 'orderId123' }),
        }));

        userModel.findByIdAndUpdate.mockResolvedValueOnce({});
        
        stripe.checkout.sessions.create.mockResolvedValueOnce({ url: 'http://stripe.session.url' });

        await placeOrder(req, res);

        expect(orderModel).toHaveBeenCalledWith({
            userId: 'userId123',
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { cartData: {} });
        expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: 'Pizza',
                        },
                        unit_amount: 2000, // 10 * 100 * 2
                    },
                    quantity: 2,
                },
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: 'Deliver Charges',
                        },
                        unit_amount: 200, // 2 * 100
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: expect.any(String), // Check for success URL
            cancel_url: expect.any(String),  // Check for cancel URL
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, session_url: 'http://stripe.session.url' });
    });

    it('should handle errors when placing an order', async () => {
        const req = mockRequest({
            userId: 'userId123',
            items: [{ name: 'Pizza', price: 10, quantity: 2 }],
            amount: 2000,
            address: '123 Street',
        });
        const res = mockResponse();

        orderModel.mockImplementationOnce(() => ({
            save: jest.fn().mockRejectedValueOnce(new Error('Save error')),
        }));

        await placeOrder(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Error" });
    });

    it('should verify an order', async () => {
        const req = mockRequest({ orderId: 'orderId123', success: 'true' });
        const res = mockResponse();

        orderModel.findByIdAndUpdate.mockResolvedValueOnce({});

        await verifyOrder(req, res);

        expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('orderId123', { payment: true });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "paid" });
    });

    it('should handle errors when verifying an order', async () => {
        const req = mockRequest({ orderId: 'orderId123', success: 'false' });
        const res = mockResponse();

        orderModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Update error'));

        await verifyOrder(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Paid failed" });
    });

    it('should get user orders', async () => {
        const req = mockRequest({ userId: 'userId123' });
        const res = mockResponse();

        const mockOrders = [{ id: 'orderId123' }, { id: 'orderId456' }];
        orderModel.find.mockResolvedValueOnce(mockOrders);

        await userOrders(req, res);

        expect(orderModel.find).toHaveBeenCalledWith({ userId: 'userId123' });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockOrders });
    });

    it('should handle errors when getting user orders', async () => {
        const req = mockRequest({ userId: 'userId123' });
        const res = mockResponse();

        orderModel.find.mockRejectedValueOnce(new Error('Find error'));

        await userOrders(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "user order error" });
    });

    it('should list all orders', async () => {
        const req = {};
        const res = mockResponse();

        const mockOrders = [{ id: 'orderId123' }, { id: 'orderId456' }];
        orderModel.find.mockResolvedValueOnce(mockOrders);

        await listOrders(req, res);

        expect(orderModel.find).toHaveBeenCalledWith({});
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockOrders });
    });

    it('should handle errors when listing orders', async () => {
        const req = {};
        const res = mockResponse();

        orderModel.find.mockRejectedValueOnce(new Error('Find error'));

        await listOrders(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "list order fail" });
    });

    it('should update order status', async () => {
        const req = mockRequest({ orderId: 'orderId123', status: 'shipped' });
        const res = mockResponse();

        await updateStatus(req, res);

        expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('orderId123', { status: 'shipped' });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "status updated" });
    });

    it('should handle errors when updating order status', async () => {
        const req = mockRequest({ orderId: 'orderId123', status: 'shipped' });
        const res = mockResponse();

        orderModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Update error'));

        await updateStatus(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "update status fail" });
    });
});