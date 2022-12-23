import connection from "../database.js";
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = res.locals.user;

  const passwordHash = bcrypt.hashSync(password, 12);
  const confirmHash = bcrypt.hashSync(confirmPassword, 12);

  try {
    await connection.query(
      `INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4)`,
      [name, email, passwordHash, confirmHash]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = res.locals.session;
  const token = uuidV4();

  try {
    const userExist = await connection.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    // console.log(userExist.rows[0], userExist.rows[0].id);

    const passwordOK = bcrypt.compareSync(password, userExist.rows[0].password);

    if (!passwordOK) {
      return res.send(401).status({ message: "E-mail ou senha incorreto" });
    }

    if (userExist.rows.length === 0) {
      return res.send(401).status({ message: "Esse e-mail não existe!" });
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
}
