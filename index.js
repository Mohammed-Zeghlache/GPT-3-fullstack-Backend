require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");

const authMiddlwares = require('./middlewares/authMiddlwares');

const app = express();
app.use(express.json());
app.use(cors({ origin:[  
  'http://localhost:5173',
  'https://descover-gpt3.netlify.app/'

]
 }));

app.post("/register", async (req, res) => {
  try {
    const { Username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ Username, email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is working. ✅');
});

// 👉 Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email does not exist" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { userName: user.Username, userEmail: user.email },
      process.env.JWT_SECRET, // ✅ Use from .env
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "You have logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.Username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ Database connected successfully');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
  });
})
.catch(err => {
  console.error('❌ Database connection error:', err);
});

