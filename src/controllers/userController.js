import connection from "../database.js";

export async function usersMe(req, res) {
  const token = res.locals.token;
  try {
    const isUser = await connection.query(
      `SELECT * FROM sessions WHERE token=$1`,
      [token]
    );

    const getUser = await connection.query(
      `SELECT users.id AS "idUser", users.name AS "name", users."visitCount" AS "userVisitCount", urls.id AS "urlId", urls."shortUrl" 
      AS "shortUrl", urls.url AS "url", urls."visitCount" AS "visitCount" FROM users 
        LEFT JOIN urls 
       ON users.id = urls."userId"
       WHERE users.id=$1
      `,
      [isUser.rows[0].userId]
    );

    const sendRightFormat = getUser.rows.map((el) => {
      return {
        id: getUser.idUser,
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
}

export async function usersRanking(req, res) {
  try {
    const getRanking = await connection.query(`
      SELECT users.id, users.name, COUNT(urls."shortUrl") AS "linksCount", SUM(urls."visitCount") AS "visitCount"
  FROM users JOIN urls 
  ON users.id = urls."userId" 
  GROUP BY users.id ORDER BY "visitCount" DESC
  LIMIT 10;
      `);
    res.status(200).send(getRanking.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
