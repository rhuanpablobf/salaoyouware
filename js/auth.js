document.addEventListener('DOMContentLoaded', function() {
    // API URL base
    // const API_URL = 'http://localhost:5800/api'; // URL local para desenvolvimento
    const API_URL = 'https://belezapro-backend.onrender.com/api'; // URL do backend hospedado no Render

    // Toggle de visibilidade da senha
    const setupPasswordToggles = () => {
        const toggles = document.querySelectorAll('.btn-outline-secondary');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const inputId = this.previousElementSibling.id;
                const passwordInput = document.getElementById(inputId);
                
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Altera o ícone
                const icon = this.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        });
    };

    // Manipula o login
    const handleLogin = () => {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail')?.value || document.getElementById('email')?.value;
                const senha = document.getElementById('loginPassword')?.value || document.getElementById('password')?.value;
                const rememberMe = document.getElementById('rememberMe')?.checked || false;
                
                if (!email || !senha) {
                    showMessage('Preencha todos os campos obrigatórios', 'error');
                    return;
                }
                
                // Adiciona uma animação de carregamento
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Entrando...';
                submitBtn.disabled = true;
                
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, senha })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Erro ao fazer login');
                    }
                    
                    // Login bem-sucedido
                    if (data.success && data.token) {
                        // Salva o token e dados do usuário
                        localStorage.setItem('auth_token', data.token);
                        localStorage.setItem('user_data', JSON.stringify(data.usuario));
                        
                        if (rememberMe) {
                            localStorage.setItem('remember_email', email);
                        } else {
                            localStorage.removeItem('remember_email');
                        }
                        
                        // Redireciona para o dashboard
                        window.location.href = 'dashboard.html';
                    } else {
                        throw new Error('Resposta inválida do servidor');
                    }
                } catch (error) {
                    console.error('Erro de login:', error);
                    showMessage(error.message || 'Erro ao fazer login. Tente novamente.', 'error');
                    
                    // Restaura o botão
                    submitBtn.innerHTML = 'Entrar';
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Preencher email lembrado
        const rememberedEmail = localStorage.getItem('remember_email');
        if (rememberedEmail) {
            const emailInput = document.getElementById('loginEmail') || document.getElementById('email');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) emailInput.value = rememberedEmail;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    };

    // Manipula o registro
    const handleRegistration = () => {
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const nomeEmpresa = formData.get('nomeEmpresa') || formData.get('nome-empresa');
                const tipoNegocio = formData.get('tipoNegocio') || formData.get('tipo-negocio');
                const email = formData.get('email');
                const senha = formData.get('senha');
                const confirmaSenha = formData.get('confirmaSenha') || formData.get('confirma-senha');
                const termos = formData.get('termos') || formData.has('termos');
                
                // Validações básicas
                if (!nomeEmpresa || !email || !senha) {
                    showMessage('Preencha todos os campos obrigatórios', 'error');
                    return;
                }
                
                if (senha !== confirmaSenha) {
                    showMessage('As senhas não coincidem', 'error');
                    return;
                }
                
                if (!termos) {
                    showMessage('Você deve aceitar os termos de serviço', 'error');
                    return;
                }
                
                // Adiciona uma animação de carregamento
                const submitBtn = document.querySelector('.modal-footer button[type="submit"]');
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cadastrando...';
                submitBtn.disabled = true;
                
                try {
                    const response = await fetch(`${API_URL}/auth/registrar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nome: nomeEmpresa.split(' ')[0], // Nome do usuário (primeiro nome da empresa)
                            email,
                            senha,
                            nomeEmpresa,
                            tipoNegocio
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Erro ao realizar cadastro');
                    }
                    
                    // Cadastro bem-sucedido
                    if (data.success && data.token) {
                        // Salva o token e dados do usuário
                        localStorage.setItem('auth_token', data.token);
                        localStorage.setItem('user_data', JSON.stringify(data.usuario));
                        
                        showMessage('Cadastro realizado com sucesso!', 'success');
                        
                        // Fecha o modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                        if (modal) modal.hide();
                        
                        // Redireciona para o dashboard após 1 segundo
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1000);
                    } else {
                        throw new Error('Resposta inválida do servidor');
                    }
                } catch (error) {
                    console.error('Erro de cadastro:', error);
                    showMessage(error.message || 'Erro ao realizar cadastro. Tente novamente.', 'error');
                    
                    // Restaura o botão
                    submitBtn.innerHTML = 'Criar Conta';
                    submitBtn.disabled = false;
                }
            });
        }
    };

    // Manipula recuperação de senha
    const handlePasswordRecovery = () => {
        const recoveryForm = document.querySelector('#recoveryModal .modal-footer .btn-primary');
        
        if (recoveryForm) {
            recoveryForm.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('recoveryEmail').value;
                
                if (!email) {
                    showMessage('Informe seu e-mail para recuperação', 'error');
                    return;
                }
                
                // Adiciona uma animação de carregamento
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...';
                this.disabled = true;
                
                try {
                    const response = await fetch(`${API_URL}/auth/esqueceu-senha`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Erro ao solicitar recuperação de senha');
                    }
                    
                    showMessage('Instruções para recuperação de senha foram enviadas para seu e-mail.', 'success');
                    
                    // Fecha o modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('recoveryModal'));
                    if (modal) modal.hide();
                } catch (error) {
                    console.error('Erro na recuperação de senha:', error);
                    showMessage(error.message || 'Erro ao solicitar recuperação de senha. Tente novamente.', 'error');
                } finally {
                    // Restaura o botão
                    this.innerHTML = 'Enviar';
                    this.disabled = false;
                }
            });
        }
    };

    // Função para mostrar mensagem
    const showMessage = (message, type = 'success') => {
        // Verifica se já existe um toast container
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed p-3 bottom-0 end-0';
            document.body.appendChild(toastContainer);
        }
        
        const toastId = 'toast-' + Date.now();
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
        toastEl.id = toastId;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
        `;
        
        toastContainer.appendChild(toastEl);
        
        const toast = new bootstrap.Toast(toastEl, {
            delay: 5000,
            autohide: true
        });
        
        toast.show();
        
        // Remove o toast do DOM quando ele for escondido
        toastEl.addEventListener('hidden.bs.toast', function () {
            this.remove();
        });
    };

    // Verifica se o usuário está autenticado
    const checkAuth = () => {
        const token = localStorage.getItem('auth_token');
        const currentPage = window.location.pathname.split('/').pop();
        
        // Se não estamos na página inicial ou em uma página de autenticação
        if (!['index.html', 'login.html', 'register.html', 'reset-password.html', ''].includes(currentPage)) {
            if (!token) {
                // Redireciona para a página de login se não estiver autenticado
                window.location.href = 'index.html';
            } else {
                // Verificar validade do token (pode implementar verificação do JWT expiry)
                try {
                    const userData = JSON.parse(localStorage.getItem('user_data'));
                    
                    // Atualiza o nome do usuário na interface, se existir
                    if (userData) {
                        const userNameElement = document.querySelector('.user-profile .username');
                        const avatarElement = document.querySelector('.avatar');
                        
                        if (userNameElement) {
                            userNameElement.textContent = userData.nome;
                        }
                        
                        if (avatarElement) {
                            avatarElement.textContent = userData.nome.charAt(0);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao processar dados do usuário:', error);
                    // Em caso de erro, fazer logout
                    logout();
                }
            }
        } else if (token && ['index.html', 'login.html', '', '/'].includes(currentPage)) {
            // Se já estiver autenticado e estiver tentando acessar a página de login
            // Redireciona para o dashboard
            window.location.href = 'dashboard.html';
        }
    };

    // Função de logout
    window.logout = function() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        // Mantém apenas o remember_email se estiver configurado
        window.location.href = 'index.html';
    };

    // Inicializa todas as funcionalidades de autenticação
    const initAuth = () => {
        setupPasswordToggles();
        handleLogin();
        handleRegistration();
        handlePasswordRecovery();
        
        // Configura botões de logout
        const logoutBtn = document.getElementById('logoutBtn');
        const logoutDropdownBtn = document.getElementById('logoutDropdownBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        if (logoutDropdownBtn) {
            logoutDropdownBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // Verifica autenticação em cada página
        checkAuth();
    };

    // Inicializa tudo
    initAuth();
});