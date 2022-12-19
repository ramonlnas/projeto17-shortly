import dotenv from "dotenv";
import express from "express";
import joi from "joi";
import cors from "cors";
import connection from "./database.js";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const userSchema = joi.object({
  name: joi.string().required().min(1).max(100),
  email: joi.string().email().required(),
  password: joi.string().required().min(1),
  confirmPassword: joi.ref("password"),
});

app.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const validateUser = {
    name,
    email,
    password,
    confirmPassword,
  };

  const validation = userSchema.validate(validateUser, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const emailExist = await connection.query(`SELECT email FROM users WHERE email=$1`, [email])

    if(emailExist.rows.length !== 0) {
        return res.status(409).send({ message: "Esse email já está cadastrado"})
    }

    const passwordHash = bcrypt.hashSync(password, 12)
    const confirmHash = bcrypt.hashSync(confirmPassword, 12)

    await connection.query(`INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)`, [name, email, passwordHash, confirmHash])
    res.sendStatus(201)

  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
