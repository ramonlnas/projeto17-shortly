import dotenv from "dotenv";
import express from "express";
import joi from "joi";
import cors from "cors";
import connection from "./database.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));

