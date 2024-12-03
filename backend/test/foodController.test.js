// tests/foodController.test.js

import { addFood, listFood, removeFood } from '../controllers/foodController'; // Adjust the path as necessary
import foodModel from '../models/foodModel.js';
import fs from 'fs';

jest.mock('../models/foodModel.js');
jest.mock('fs');

describe('Food Functions', () => {
    const mockRequest = (file, body) => ({
        file,
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

    it('should add a food item', async () => {
        const req = mockRequest({ filename: 'food-image.jpg' }, {
            name: 'Pizza',
            description: 'Delicious cheese pizza',
            price: 12.99,
            calo: 300,
            category: 'Italian',
        });
        const res = mockResponse();
        
        foodModel.mockImplementationOnce(() => ({
            save: jest.fn().mockResolvedValueOnce({}),
        }));

        await addFood(req, res);

        expect(foodModel).toHaveBeenCalledWith({
            name: 'Pizza',
            description: 'Delicious cheese pizza',
            price: 12.99,
            calo: 300,
            category: 'Italian',
            image: 'food-image.jpg',
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Food Added" });
    });

    it('should handle errors when adding food', async () => {
        const req = mockRequest({ filename: 'food-image.jpg' }, {
            name: 'Pizza',
            description: 'Delicious cheese pizza',
            price: 12.99,
            calo: 300,
            category: 'Italian',
        });
        const res = mockResponse();
        
        foodModel.mockImplementationOnce(() => ({
            save: jest.fn().mockRejectedValueOnce(new Error('Save error')),
        }));

        await addFood(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Add error" });
    });

    it('should list food items', async () => {
        const req = {};
        const res = mockResponse();
        
        const mockFoods = [{ name: 'Pizza' }, { name: 'Burger' }];
        foodModel.find.mockResolvedValueOnce(mockFoods);

        await listFood(req, res);

        expect(foodModel.find).toHaveBeenCalledWith({});
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockFoods });
    });

    it('should handle errors when listing food', async () => {
        const req = {};
        const res = mockResponse();
        
        foodModel.find.mockRejectedValueOnce(new Error('Database error'));

        await listFood(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error list food" });
    });

    it('should remove a food item', async () => {
        const req = mockRequest({}, { id: 'foodId123' });
        const res = mockResponse();
        
        const mockFood = { image: 'food-image.jpg' };
        foodModel.findById.mockResolvedValueOnce(mockFood);
        foodModel.findByIdAndDelete.mockResolvedValueOnce({});

        await removeFood(req, res);

        expect(fs.unlink).toHaveBeenCalledWith('uploads/food-image.jpg', expect.any(Function));
        expect(foodModel.findByIdAndDelete).toHaveBeenCalledWith('foodId123');
        expect(res.json).toHaveBeenCalledWith({ success: true, message: "Food Removed" });
    });

    it('should handle errors when removing food', async () => {
        const req = mockRequest({}, { id: 'foodId123' });
        const res = mockResponse();
        
        foodModel.findById.mockRejectedValueOnce(new Error('Food not found'));

        await removeFood(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error remove food" });
    });
});