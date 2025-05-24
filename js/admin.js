// Script específico para o Admin Master

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação (Token JWT)
    checkAdminAuthentication();
    
    // Inicializar gráficos
    initMRRChart();
    initPlanosChart();
    
    // Event listeners
    setupEventListeners();
    
    // Animações iniciais
    animateElements();
});

// Verificar se o usuário está autenticado como Admin Master
function checkAdminAuthentication() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Redirecionar para a página de login se não houver token
        window.location.href = 'index.html';
        return;
    }
    
    // Decodificar o token JWT (simplificado para demonstração)
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) throw new Error('Token inválido');
        
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Verificar se o usuário tem o papel de admin
        if (payload.role !== 'admin') {
            console.error('Acesso não autorizado: perfil não é admin');
            window.location.href = 'index.html';
            return;
        }
        
        // Atualizar nome do usuário na interface
        document.querySelector('#userDropdown span').textContent = payload.name || 'Administrador';
        
        // TODO: Verificar expiração do token e outros detalhes de segurança
        
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = 'index.html';
    }
}

// Configurar event listeners para a interface
function setupEventListeners() {
    // Logout
    document.querySelectorAll('#logoutBtn, #logoutDropdownBtn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
    
    // Botões de navegação da sidebar
    const sidebarLinks = {
        '#empresasLink': showEmpresasModule,
        '#planosLink': showPlanosModule,
        '#pagamentosLink': showPagamentosModule,
        '#usuariosLink': showUsuariosModule,
        '#configAdminLink': showConfigModule,
        '#verTodasEmpresas': showEmpresasModule
    };
    
    Object.entries(sidebarLinks).forEach(([selector, handler]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                handler();
            });
        }
    });
    
    // Controles dos gráficos
    setupChartControls();
}

// Logout do administrador
function logout() {
    // Limpar dados de autenticação do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    
    // Redirecionar para a página de login
    window.location.href = 'index.html';
}

// Gráfico de evolução do MRR (Monthly Recurring Revenue)
function initMRRChart() {
    const ctx = document.getElementById('mrrChart');
    
    if (!ctx) return;
    
    // Dados simulados para o gráfico de MRR
    const data = {
        labels: ['Agosto', 'Setembro', 'Outubro'],
        datasets: [
            {
                label: 'MRR (R$)',
                backgroundColor: 'rgba(118, 74, 226, 0.2)',
                borderColor: 'rgba(118, 74, 226, 1)',
                borderWidth: 2,
                data: [9250, 10800, 12580],
                tension: 0.3,
                fill: true
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Formatar os valores do eixo Y como moeda
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                        }
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    const mrrChart = new Chart(ctx, config);
}

// Gráfico de distribuição de planos
function initPlanosChart() {
    const ctx = document.getElementById('planosChart');
    
    if (!ctx) return;
    
    // Dados simulados para o gráfico de planos
    const data = {
        labels: ['Gratuito', 'Profissional Mensal', 'Profissional Anual'],
        datasets: [{
            label: 'Empresas',
            data: [23, 14, 5],
            backgroundColor: [
                'rgba(108, 117, 125, 0.8)',
                'rgba(118, 74, 226, 0.8)',
                'rgba(40, 167, 69, 0.8)'
            ],
            borderColor: [
                'rgba(108, 117, 125, 1)',
                'rgba(118, 74, 226, 1)',
                'rgba(40, 167, 69, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.formattedValue + ' empresas';
                            return label;
                        }
                    }
                }
            },
        }
    };
    
    // Criar o gráfico
    const planosChart = new Chart(ctx, config);
}

// Configurar controles dos gráficos (botões de intervalos)
function setupChartControls() {
    const chartControls = document.querySelectorAll('.btn-group .btn-outline-primary');
    
    chartControls.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            chartControls.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Aqui seria implementada a lógica para atualizar dados do gráfico com base no período selecionado
            // Para o propósito da demonstração, não estamos alterando dados reais
            console.log('Atualizando gráfico para o período:', this.textContent.trim());
        });
    });
}

// Módulos da interface administrativa (implementações simplificadas)

// Módulo de gerenciamento de empresas
function showEmpresasModule() {
    console.log('Módulo de Empresas');
    // Esta função seria implementada para mostrar uma interface completa de gerenciamento de empresas
    // No escopo atual, apenas simulamos o comportamento
    alert('Carregando módulo de gerenciamento de empresas...');
}

// Módulo de gestão de planos
function showPlanosModule() {
    console.log('Módulo de Planos');
    alert('Carregando módulo de gestão de planos...');
}

// Módulo de gestão de pagamentos e assinaturas
function showPagamentosModule() {
    console.log('Módulo de Pagamentos');
    alert('Carregando módulo de gestão de pagamentos...');
}

// Módulo de gestão de usuários admin
function showUsuariosModule() {
    console.log('Módulo de Usuários');
    alert('Carregando módulo de gestão de usuários administrativos...');
}

// Módulo de configurações do painel administrativo
function showConfigModule() {
    console.log('Módulo de Configurações');
    alert('Carregando módulo de configurações do painel administrativo...');
}

// Animações dos elementos da interface
function animateElements() {
    // Animações já implementadas via CSS em main.js
}

// Função para carregar dados reais do servidor (simulada)
function loadDashboardData() {
    // Em uma implementação real, esta função faria requisições AJAX para obter dados atualizados
    console.log('Carregando dados do dashboard administrativo...');
    
    // Simulação de dados recebidos
    return {
        mrr: 12580,
        totalEmpresas: 42,
        taxaConversao: 23,
        inadimplencia: 4.8,
        crescimentoMrr: 15
    };
}