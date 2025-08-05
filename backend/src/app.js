import dotenv from 'dotenv';
import express from "express";
import mongoose from 'mongoose';
import routes from "./routes/index.js"
import cors from "cors";
import Post from "./models/post.js";
const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api-v1", routes);

app.get("/", (req, res) => {
    res.send("Welcome to TaskHub API");
}
);


const connectionDb = await mongoose.connect(process.env.MONGO_URL)
console.log("DB connected ", connectionDb.connection.host);
app.listen(8000, () => {
    console.log("Server is running on port 8000");

})

