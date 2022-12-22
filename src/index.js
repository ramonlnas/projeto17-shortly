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
  url: joi.string().uri().required(),
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
  console.log(token);

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
    // console.log(userExist.rows[0], userExist.rows[0].id);

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
  const { url } = req.body;
  const shortUrl = nanoid(8);
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  const validateURL = {
    url,
  };

  const validation = urlSchema.validate(validateURL, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  const getUser = await connection.query(
    `SELECT "userId" FROM sessions WHERE token=$1`,
    [token]
  );

  await connection.query(
    `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)`,
    [url, shortUrl, getUser.rows[0].userId]
  );

  res.status(201).send(shortUrl);
});

app.get("/urls/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const getUrlById = await connection.query(
      `SELECT * FROM urls WHERE id=$1`,
      [id]
    );

    if (getUrlById.rows.length === 0) {
      return res.sendStatus(404);
    }

    const [sendRightFormat] = getUrlById.rows;

    delete sendRightFormat.userId;
    delete sendRightFormat.visitCount;
    delete sendRightFormat.createdAt;

    res.status(200).send(sendRightFormat);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/urls/open/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    if (shortUrl.length === 8) {
      const getShort = await connection.query(
        `SELECT * FROM urls WHERE "shortUrl"=$1`,
        [shortUrl]
      );
      console.log(getShort.rows[0], getShort.rows[0].userId);

      if (getShort.rows.length === 0) {
        return res.sendStatus(404);
      }

      await connection.query(
        `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl"=$1`,
        [shortUrl]
      );
      await connection.query(
        `UPDATE users SET "visitCount" = "visitCount" + 1 WHERE id=$1`,
        [getShort.rows[0].userId]
      );

      res.redirect(getShort.rows.url);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete("/urls/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  const getLine = await connection.query(`SELECT * FROM urls WHERE id=$1`, [
    id,
  ]);
  const user = await connection.query(`SELECT * FROM sessions WHERE token=$1`, [
    token,
  ]);
  console.log(getLine.rows[0], user.rows[0]);

  if (user.rows[0].userId !== getLine.rows[0].userId) {
    return res.sendStatus(401);
  }

  if (getLine.rows.length === 0) {
    return res.sendStatus(404);
  }

  await connection.query(`DELETE FROM urls WHERE id=$1`, [id]);
  res.sendStatus(204);
});

app.get("/users/me", async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const isUser = await connection.query(
      `SELECT * FROM sessions WHERE token=$1`,
      [token]
    );

    const getUser = await connection.query(
      `SELECT users.id AS "idUser", users.name AS "name", users."visitCount" AS "userVisitCount", urls.id AS "urlId", urls."shortUrl" AS "shortUrl", urls.url AS "url", urls."visitCount" AS "visitCount" FROM users 
      LEFT JOIN urls 
     ON users.id = urls."userId"
     WHERE users.id=$1
    `,
      [isUser.rows[0].userId]
    );
    console.log(getUser.rows, isUser.rows[0].userId);

    const sendRightFormat = getUser.rows.map((el) => {
      return {
        id: el.idUser,
        name: el.name,
        visitCount: el.userVisitCount,
        shortenedUrls: [
          {
            id: el.urlId,
            shortUrl: el.shortUrl,
            url: el.url,
            visitCount: el.visitCount,
          },
        ],
      };
    });

    res.status(200).send(sendRightFormat);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const getRanking = await connection.query(`
    SELECT users.id, users.name, COUNT(urls."shortUrl") AS "linksCount", SUM(urls."visitCount") AS "visitCount"
FROM users LEFT JOIN urls 
ON users.id = urls."userId" 
GROUP BY users.id ORDER BY "visitCount" DESC
LIMIT 10;
    `);
    res.status(200).send(getRanking.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
