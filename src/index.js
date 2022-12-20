import dotenv from "dotenv";
import express from "express";
import joi from "joi";
import cors from "cors";
import connection from "./database.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { nanoid } from "nanoid";


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

const sessionSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().min(1),
});

const urlSchema = joi.object({
  url: joi.string()
  .uri().required()
})

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
    const emailExist = await connection.query(
      `SELECT email FROM users WHERE email=$1`,
      [email]
    );

    if (emailExist.rows.length !== 0) {
      return res.status(409).send({ message: "Esse email já está cadastrado" });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    const confirmHash = bcrypt.hashSync(confirmPassword, 12);

    await connection.query(
      `INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)`,
      [name, email, passwordHash, confirmHash]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const token = uuidV4();
  console.log(token)

  const validateSignin = {
    email,
    password,
  };

  const validation = sessionSchema.validate(validateSignin, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const userExist = await connection.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    console.log(userExist.rows[0], userExist.rows[0].id);

    if (userExist.rows.length === 0) {
      return res.send(401).status({ message: "Esse e-mail não existe!" });
    }

    const passwordOK = bcrypt.compareSync(password, userExist.rows[0].password);

    if (!passwordOK) {
      return res.send(401).status({ message: "E-mail ou senha incorreto" });
    }

    await connection.query(
      `INSERT INTO sessions (token, "userId") VALUES ($1, $2)`,
      [token, userExist.rows[0].id]
    );

    res.status(200).send(token);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/urls/shorten", async (req, res) => {
  const {url} = req.body;
  const shortUrl = nanoid(8);
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  // if (!token) {
  //   return res.sendStatus(401)
  // }

  const validateURL = {
    url
  };

  const validation = urlSchema.validate(validateURL, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  await connection.query(`INSERT INTO urls (url, "shortUrl") VALUES ($1, $2)`, [url, shortUrl])

  res.status(201).send(shortUrl)
  
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
