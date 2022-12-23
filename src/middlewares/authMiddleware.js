import { userSchema, sessionSchema } from "../models/authSchema.js";
import connection from "../database.js";
import bcrypt from "bcrypt";


export async function validSignUp(req, res, next) {
  const user = req.body;

  const validation = userSchema.validate(user, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  const emailExist = await connection.query(
    `SELECT email FROM users WHERE email=$1`,
    [user.email]
  );

  if (emailExist.rows.length !== 0) {
    return res.status(409).send({ message: "Esse email já está cadastrado" });
  }

  res.locals.user = user;

  next();
}

export async function validSignIn(req, res, next) {
  const session = req.body;

  const validation = sessionSchema.validate(session, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.locals.session = session

  next();
}
