const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const validateLogin = require('./auth');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/confrontos', validateLogin, (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'times.json'));
  res.json(JSON.parse(data));
});

app.post('/api/confrontos', validateLogin, (req, res) => {
  fs.writeFileSync(
    path.join(__dirname, 'times.json'),
    JSON.stringify(req.body, null, 2)
  );
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});