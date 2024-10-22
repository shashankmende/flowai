
const UserModel = require("../models/userModel");

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY



exports.register = async(req,res)=>{
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new UserModel({ username, password:hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(400).json({ message: "Error registering user.", error: error.message });
    }
}


exports.login = async(req,res)=>{
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
}