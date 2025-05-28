const API_BASE = 'https://cartolaapi-production.up.railway.app';

const username = 'atademog';
const password = '@cartola2025!';

const headers = {
  'Authorization': 'Basic ' + btoa(username + ':' + password),
  'Content-Type': 'application/json'
};

// Buscar confrontos
async function fetchConfrontos() {
  const res = await fetch(API_BASE + '/api/confrontos', { headers });
  if (!res.ok) {
    alert('Erro ao buscar confrontos');
    return;
  }
  const data = await res.json();
  // Atualizar UI com os dados
  console.log(data);
  // (Aqui vai o código para atualizar o DOM, etc.)
}

// Salvar confrontos
async function salvarConfrontos(confrontos) {
  const res = await fetch(API_BASE + '/api/confrontos', {
    method: 'POST',
    headers,
    body: JSON.stringify(confrontos)
  });
  if (!res.ok) {
    alert('Erro ao salvar confrontos');
  } else {
    alert('Confrontos salvos com sucesso!');
  }
}