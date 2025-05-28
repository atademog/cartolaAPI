const express = require('express');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = 'gz65Dx2vxPHyr4CJ50E33CiGVIDA86DpxQhlaHvDhoxqvOj9iJAAuIrVjRLAEBQwudbEqOrybJfJj9Fe6klQvrJr3D7IVe';

app.use(cors());
app.use(express.json());

app.get('/pontuacoes', async (req, res) => {
  try {
    const times = JSON.parse(fs.readFileSync('times.json', 'utf8'));

    const resultados = await Promise.all(times.map(async ({ time1, time2 }) => {
      const [t1, t2] = await Promise.all([
        fetch(`https://api.praxisagencia.com.br/cartolafc/slug/${time1}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        }).then(res => res.json()),
        fetch(`https://api.praxisagencia.com.br/cartolafc/slug/${time2}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        }).then(res => res.json())
      ]);

      return {
        time1: { nome: t1.nome || time1, pontos: t1.pontos || 0 },
        time2: { nome: t2.nome || time2, pontos: t2.pontos || 0 }
      };
    }));

    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar pontuações', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});