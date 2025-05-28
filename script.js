// Armazena os confrontos
let matches = [];

// Carrega os confrontos do localStorage ou usa os padrões
function loadMatches() {
    const savedMatches = localStorage.getItem('cartolaMatches');
    matches = savedMatches ? JSON.parse(savedMatches) : CONFIG.DEFAULT_MATCHES;
    return matches;
}

// Salva os confrontos no localStorage
function saveMatches() {
    localStorage.setItem('cartolaMatches', JSON.stringify(matches));
}

// Busca os dados de um time na API
async function fetchTeamData(slug) {
    try {
        const response = await fetch(`${CONFIG.API_URL}${slug}`, {
            headers: {
                'Authorization': CONFIG.API_TOKEN
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do time');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Exibe os confrontos na página principal
async function displayMatches() {
    const container = document.getElementById('matchesContainer');
    if (!container) return;

    container.innerHTML = '';
    
    const loadedMatches = loadMatches();
    
    // Verifica o status do mercado (usamos o primeiro time como referência)
    let marketStatus = 'Fechado';
    if (loadedMatches.length > 0) {
        const firstTeamData = await fetchTeamData(loadedMatches[0].team1);
        if (firstTeamData) {
            marketStatus = firstTeamData.team.market_closed ? 'Fechado' : 'Aberto';
        }
    }
    document.getElementById('marketStatus').textContent = marketStatus;
    
    // Processa cada confronto
    for (const match of loadedMatches) {
        const team1Data = await fetchTeamData(match.team1);
        const team2Data = await fetchTeamData(match.team2);
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        let team1Score = 'N/A';
        let team2Score = 'N/A';
        let resultText = 'Dados indisponíveis';
        
        if (team1Data && team2Data) {
            team1Score = team1Data.team.total_score.toFixed(2);
            team2Score = team2Data.team.total_score.toFixed(2);
            
            if (team1Data.team.total_score > team2Data.team.total_score) {
                resultText = `${team1Data.team.name} venceu`;
            } else if (team1Data.team.total_score < team2Data.team.total_score) {
                resultText = `${team2Data.team.name} venceu`;
            } else {
                resultText = 'Empate';
            }
        }
        
        matchCard.innerHTML = `
            <div class="team">
                <span class="team-name">${match.team1}</span>
                <span class="team-score ${team1Data && team2Data && team1Data.team.total_score > team2Data.team.total_score ? 'winner' : ''}">
                    ${team1Score}
                </span>
            </div>
            <div class="team">
                <span class="team-name">${match.team2}</span>
                <span class="team-score ${team1Data && team2Data && team1Data.team.total_score < team2Data.team.total_score ? 'winner' : ''}">
                    ${team2Score}
                </span>
            </div>
            <div class="match-result">${resultText}</div>
        `;
        
        container.appendChild(matchCard);
    }
}

// Exibe o formulário de edição na página admin
function displayEditForm() {
    const container = document.getElementById('editMatchesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const loadedMatches = loadMatches();
    
    // Garante que temos pelo menos 10 confrontos
    while (loadedMatches.length < 10) {
        loadedMatches.push({ team1: '', team2: '' });
    }
    
    loadedMatches.forEach((match, index) => {
        const matchEdit = document.createElement('div');
        matchEdit.className = 'match-edit';
        matchEdit.innerHTML = `
            <h3>Confronto ${index + 1}</h3>
            <input type="text" class="team1-input" value="${match.team1}" placeholder="Time 1 (slug)">
            <input type="text" class="team2-input" value="${match.team2}" placeholder="Time 2 (slug)">
        `;
        container.appendChild(matchEdit);
    });
    
    // Adiciona evento ao botão salvar
    document.getElementById('saveMatches').addEventListener('click', () => {
        const matchElements = document.querySelectorAll('.match-edit');
        const updatedMatches = [];
        
        matchElements.forEach(matchEl => {
            const team1 = matchEl.querySelector('.team1-input').value.trim();
            const team2 = matchEl.querySelector('.team2-input').value.trim();
            
            if (team1 && team2) {
                updatedMatches.push({ team1, team2 });
            }
        });
        
        matches = updatedMatches;
        saveMatches();
        alert('Confrontos salvos com sucesso!');
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('matchesContainer')) {
        displayMatches();
    }
    
    if (document.getElementById('editMatchesContainer')) {
        displayEditForm();
    }
});