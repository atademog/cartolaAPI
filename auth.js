function validateLogin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Acesso negado');
  }

  const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  if (
    user === process.env.USERNAME &&
    pass === process.env.PASSWORD
  ) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    res.status(401).send('Acesso negado');
  }
}

module.exports = validateLogin;