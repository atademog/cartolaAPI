// Verifica se o usuário está logado
function checkAuth() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Faz login
function login(username, password) {
    if (username === CONFIG.ADMIN_CREDENTIALS.username && 
        password === CONFIG.ADMIN_CREDENTIALS.password) {
        localStorage.setItem('isAuthenticated', 'true');
        return true;
    }
    return false;
}

// Faz logout
function logout() {
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'index.html';
}

// Redireciona para admin.html se estiver autenticado
function redirectIfAuthenticated() {
    if (checkAuth() && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'admin.html';
    }
}

// Event listeners para login/logout
document.addEventListener('DOMContentLoaded', function() {
    // Login modal na página principal
    if (document.getElementById('loginBtn')) {
        const modal = document.getElementById('loginModal');
        const loginBtn = document.getElementById('loginBtn');
        const closeBtn = document.querySelector('.close');
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');

        loginBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (login(username, password)) {
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Usuário ou senha incorretos';
            }
        });
    }

    // Logout na página de admin
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', logout);
    }

    // Redireciona se já estiver logado
    redirectIfAuthenticated();
});