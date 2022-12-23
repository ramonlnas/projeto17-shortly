export async function hasToken(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  console.log(token, "TOKEN")

  if (!token) {
    return res.sendStatus(401);
  }

  res.locals.token = token
  console.log(res.locals.token, "alou")

  next();
}
