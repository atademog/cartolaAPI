require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: ['https://pegavisao.com', 'http://localhost:5500'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rota do proxy
app.get('/api/team/:slug', async (req, res) => {
  try {
    const apiUrl = `https://api.praxisagencia.com.br/cartolafc/team/${req.params.slug}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `${process.env.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Servir arquivos estáticos
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});          
          
);
