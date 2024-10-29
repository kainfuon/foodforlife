import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import validator from "validator";

// Login 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        //console.log(user);
        if (!user) {
           // console.log(user);
            return res.status(404).json({ success: false, message: "User not found" }); 
        }
        console.log(user.password);
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            
            return res.status(400).json({ success: false, message: "Invalid password" }); 
        }
        
        //const token = generateToken(user._id);
        const token = 1;
        res.status(200).json({ success: true, message: "Login successful", user, token }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" }); 
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) return res.status(400).json({ success: false, message: "Email already exists" }); 
        
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email" }); 
        
        if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" }); 
        
        // Hashing password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 
        
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);
        //const token = generateToken(savedUser._id);
        const token = 1;
        
        res.status(201).json({ success: true, message: "User registered successfully", savedUser, token }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" }); 
    }
};

export { loginUser, registerUser };