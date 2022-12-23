import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

import authRouters from "./routes/authRouter.js"
import urlsRouters from "./routes/urlsRouters.js"
import usersRouters from "../src/routes/usersRouters.js"

app.use(authRouters)
app.use(urlsRouters)
app.use(usersRouters)

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
