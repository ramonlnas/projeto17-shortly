import connection from "../database.js";
import { nanoid } from "nanoid";

export async function postShorten(req, res) {
  const { url } = res.locals.url;
  const shortUrl = nanoid(8);
  const token  = res.locals.token;
  console.log(token, "tokenCOntroller")
  console.log(url, "urlController")

  try {
    const getUser = await connection.query(
      `SELECT "userId" FROM sessions WHERE token=$1`,
      [token]
    );
    console.log(getUser.rows[0])

    await connection.query(
      `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)`,
      [url, shortUrl, getUser.rows[0].userId]
    );

    res.status(201).send(shortUrl);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getUrlById(req, res) {
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
}

export async function getOpenUrl(req, res) {
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
}

export async function deletUrlById(req, res) {
  const { id } = req.params;
  const { token } = res.locals.token;

  const getLine = await connection.query(`SELECT * FROM urls WHERE id=$1`, [
    id,
  ]);
  const user = await connection.query(`SELECT * FROM sessions WHERE token=$1`, [
    token,
  ]);
  console.log(getLine.rows[0], user.rows[0]);

  // if (user.rows[0].userId !== getLine.rows[0].userId) {
  //   return res.sendStatus(401);
  // }

  if (getLine.rows.length === 0) {
    return res.sendStatus(404);
  }

  await connection.query(`DELETE FROM urls WHERE id=$1`, [id]);
  res.sendStatus(204);
}
