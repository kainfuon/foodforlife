// tests/userController.test.js

import { loginUser, registerUser } from '../controllers/userController'; // Adjust the path as needed
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

jest.mock('../models/userModel.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('validator');

describe('User Functions', () => {
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

    describe('loginUser', () => {
        it('should log in a user successfully', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            const mockUser = { _id: 'userId123', email: 'test@example.com', password: 'hashedPassword' };

            userModel.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.compare.mockResolvedValueOnce(true);
            jwt.sign.mockReturnValueOnce('token123');

            await loginUser(req, res);

            expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId123' }, process.env.JWT_SECRET);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Login successful",
                user: mockUser,
                token: 'token123'
            });
        });

        it('should return an error if user is not found', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();

            userModel.findOne.mockResolvedValueOnce(null);

            await loginUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
        });

        it('should return an error if password is invalid', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'wrongPassword' });
            const res = mockResponse();
            const mockUser = { _id: 'userId123', email: 'test@example.com', password: 'hashedPassword' };

            userModel.findOne.mockResolvedValueOnce(mockUser);
            bcrypt.compare.mockResolvedValueOnce(false);

            await loginUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid password" });
        });

        it('should handle errors', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();

            userModel.findOne.mockRejectedValueOnce(new Error('Database error'));

            await loginUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error" });
        });
    });

    describe('registerUser', () => {
        it('should register a user successfully', async () => {
            const req = mockRequest({ name: 'John Doe', email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedPassword');
            userModel.mockImplementationOnce(() => ({
                save: jest.fn().mockResolvedValueOnce({ _id: 'userId123', email: 'test@example.com' }),
            }));
            jwt.sign.mockReturnValueOnce('token123');

            userModel.findOne.mockResolvedValueOnce(null); // No existing user

            await registerUser(req, res);

            expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "User registered successfully",
                savedUser: { _id: 'userId123', email: 'test@example.com' },
                token: 'token123'
            });
        });

        it('should return an error if email already exists', async () => {
            const req = mockRequest({ name: 'John Doe', email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            userModel.findOne.mockResolvedValueOnce({}); // Simulate existing user

            await registerUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Email already exists" });
        });

        it('should return an error if email is invalid', async () => {
            const req = mockRequest({ name: 'John Doe', email: 'invalidEmail', password: 'password123' });
            const res = mockResponse();
            userModel.findOne.mockResolvedValueOnce(null); // No existing user
            validator.isEmail.mockReturnValueOnce(false); // Invalid email

            await registerUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid email" });
        });

        it('should return an error if password is too short', async () => {
            const req = mockRequest({ name: 'John Doe', email: 'test@example.com', password: 'short' });
            const res = mockResponse();
            userModel.findOne.mockResolvedValueOnce(null); // No existing user

            await registerUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Password must be at least 8 characters long" });
        });

        it('should handle errors during registration', async () => {
            const req = mockRequest({ name: 'John Doe', email: 'test@example.com', password: 'password123' });
            const res = mockResponse();
            userModel.findOne.mockResolvedValueOnce(null); // No existing user
            bcrypt.genSalt.mockRejectedValueOnce(new Error('Salt error'));

            await registerUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error" });
        });
    });
});