import express from "express";
import cors from "cors";
import { collectionName, connection } from "./dbconfig.js";
import { ObjectId } from "mongodb";
import jwt, { decode } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true
}));
app.use(cookieParser());


//signup
app.post("/signup", async (req, res) => {
  const userData = req.body;

  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection('users');

    // Check if user already exists
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash the password before saving
    const saltRounds = 10; // you can increase for more security
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword, // store hashed password
    };

    const result = await collection.insertOne(newUser);
    if (result) {
      res.send({
        success: true,
        message: "Signup successful",
      });
    } else {
      res.send({
        success: false,
        message: "Signup failed",
      });
    }
  } else {
    res.send({
      success: false,
      message: "Email and password are required",
    });
  }
});



//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const db = await connection();
    const collection = await db.collection('users');

    const user = await collection.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    // Compare password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send({ success: false, message: "Incorrect password" });
    }

    // Password matched → generate token
      jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) return res.send({ success: false, message: "Login failed" });

      res.send({
        success: true,
        message: "Login successful",
        token,
      });
    });
  } else {
    res.send({
      success: false,
      message: "Email and password are required",
    });
  }
});


// Add Task
app.post("/add-task",verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);

    res.send({
      success: true,
      message: "Task added successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
});

// Get Tasks
app.get("/tasks", verifyJWTToken,async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray();

    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
});



// Delete Task
app.delete("/delete-task/:id",verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
});

// Update Task
app.put("/update-task/:id",verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.send({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
});

// Bulk Delete
app.post("/delete-multiple", verifyJWTToken,async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const ids = req.body.ids.map((id) => new ObjectId(id));
    const result = await collection.deleteMany({ _id: { $in: ids } });

    res.send({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
});

//jwtverifytoken
function verifyJWTToken(req, res, next) {
  // token cookie se lo
  const token = req.cookies.token;

  // agar token nahi hai
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Token missing"
    });
  }

  jwt.verify(token,  process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token"
      });
    }
    req.user = decoded; // optional but useful
    next();
  });
}


app.listen(3200, () => {
  console.log("✅ Server running on http://localhost:3200");
});
