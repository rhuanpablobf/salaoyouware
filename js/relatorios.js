// Script específico para o módulo Relatórios

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação (Token JWT)
    checkAuthentication();
    
    // Inicializar gráficos
    if (isVisible('faturamento')) {
        initFaturamentoCharts();
        initPagamentosChart();
        initDiasSemanaChart();
    }
    
    // Inicializar eventos
    initTabEvents();
    initPeriodButtons();
    
    // Verificar se está no plano gratuito (para mensagem de limitação)
    checkFreePlanLimitations();
    
    // Animações
    animateElements();
});

// Verificar se o usuário está autenticado
function checkAuthentication() {
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
        
        // TODO: Verificar expiração do token e outros detalhes de segurança
        
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = 'index.html';
    }
}

// Verificar se uma tab está visível
function isVisible(tabId) {
    const tabPane = document.getElementById(tabId);
    return tabPane && tabPane.classList.contains('show');
}

// Inicializar eventos das abas
function initTabEvents() {
    // Adicionar evento para inicializar os gráficos correspondentes quando uma nova aba é mostrada
    const tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            const targetId = event.target.getAttribute('data-bs-target').substring(1);
            
            // Inicializar os gráficos correspondentes à aba selecionada
            switch(targetId) {
                case 'faturamento':
                    initFaturamentoCharts();
                    initPagamentosChart();
                    initDiasSemanaChart();
                    break;
                case 'servicos':
                    initServicosCharts();
                    initCategoriasChart();
                    break;
                case 'profissionais':
                    initProfissionaisChart();
                    break;
                case 'clientes':
                    initClientesCharts();
                    initRegiaoChart();
                    break;
                case 'agendamentos':
                    initAgendamentosChart();
                    initStatusChart();
                    break;
            }
        });
    });
}

// Inicializar eventos dos botões de período
function initPeriodButtons() {
    document.querySelectorAll('.btn-group .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe ativa de todos os botões no mesmo grupo
            const btnGroup = this.closest('.btn-group');
            btnGroup.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Atualizar dados dos gráficos com base no período selecionado
            const period = this.textContent.trim();
            updateChartsData(period);
        });
    });
}

// Atualizar dados dos gráficos com base no período selecionado
function updateChartsData(period) {
    console.log(`Atualizando dados para o período: ${period}`);
    // Aqui seria implementada a lógica para buscar dados do servidor com base no período
    
    // Atualização simulada: mostrar mensagem
    // Em uma implementação real, você faria uma requisição AJAX e atualizaria os gráficos
    alert(`Os dados seriam atualizados para o período: ${period}. Esta funcionalidade está disponível apenas no plano Profissional.`);
}

// Inicializar gráficos de Faturamento
function initFaturamentoCharts() {
    const ctx = document.getElementById('faturamentoChart');
    
    if (!ctx || window.faturamentoChart) return; // Evitar reinicialização do mesmo gráfico
    
    // Dados simulados para o gráfico de faturamento
    const data = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'],
        datasets: [
            {
                label: 'Faturamento Mensal (R$)',
                backgroundColor: 'rgba(118, 74, 226, 0.2)',
                borderColor: 'rgba(118, 74, 226, 1)',
                borderWidth: 2,
                data: [18500, 19300, 22150, 20800, 21450, 23750, 25520, 28580],
                tension: 0.3,
                fill: true
            },
            {
                label: 'Meta Mensal (R$)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                data: [20000, 20000, 21000, 21000, 22000, 22000, 24000, 25000],
                tension: 0.3,
                fill: false,
                pointStyle: false
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
    window.faturamentoChart = new Chart(ctx, config);
}

// Gráfico de formas de pagamento
function initPagamentosChart() {
    const ctx = document.getElementById('pagamentosChart');
    
    if (!ctx || window.pagamentosChart) return;
    
    // Dados simulados para o gráfico de formas de pagamento
    const data = {
        labels: ['Cartão de Crédito', 'PIX', 'Cartão de Débito', 'Dinheiro'],
        datasets: [{
            label: 'Pagamentos',
            data: [14450, 8320, 3570, 2240],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(255, 99, 132, 0.8)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
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
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            
                            return `${context.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(value)} (${percentage}%)`;
                        }
                    }
                }
            },
        }
    };
    
    // Criar o gráfico
    window.pagamentosChart = new Chart(ctx, config);
}

// Gráfico de faturamento por dia da semana
function initDiasSemanaChart() {
    const ctx = document.getElementById('diasSemanaChart');
    
    if (!ctx || window.diasSemanaChart) return;
    
    // Dados simulados para o gráfico de dias da semana
    const data = {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Faturamento por Dia',
            data: [3750, 3280, 3950, 4120, 5150, 6850, 1480],
            backgroundColor: 'rgba(118, 74, 226, 0.6)',
            borderColor: 'rgba(118, 74, 226, 1)',
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Faturamento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(value);
                        }
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    window.diasSemanaChart = new Chart(ctx, config);
}

// Inicializar gráficos da aba Serviços
function initServicosCharts() {
    const ctx = document.getElementById('servicosChart');
    
    if (!ctx || window.servicosChart) return;
    
    // Dados simulados para o gráfico de serviços mais vendidos
    const data = {
        labels: ['Corte Feminino', 'Mechas', 'Corte Masculino', 'Escova', 'Manicure', 'Hidratação', 'Coloração', 'Outros'],
        datasets: [{
            label: 'Quantidade',
            data: [58, 35, 40, 32, 24, 18, 28, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)',
                'rgba(83, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    };
    
    // Criar o gráfico
    window.servicosChart = new Chart(ctx, config);
}

// Gráfico de categorias
function initCategoriasChart() {
    const ctx = document.getElementById('categoriasChart');
    
    if (!ctx || window.categoriasChart) return;
    
    // Dados simulados para o gráfico de categorias
    const data = {
        labels: ['Cortes', 'Coloração', 'Manicure', 'Tratamentos', 'Finalização'],
        datasets: [{
            label: 'Distribuição',
            data: [98, 63, 38, 18, 32],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
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
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            
                            return `${context.label}: ${value} serviços (${percentage}%)`;
                        }
                    }
                }
            },
        }
    };
    
    // Criar o gráfico
    window.categoriasChart = new Chart(ctx, config);
}

// Inicializar gráficos da aba Profissionais
function initProfissionaisChart() {
    const ctx = document.getElementById('profissionaisChart');
    
    if (!ctx || window.profissionaisChart) return;
    
    // Dados simulados para o gráfico de profissionais
    const data = {
        labels: [
            'Maria Oliveira', 
            'João Santos', 
            'Lucia Ferreira'
        ],
        datasets: [
            {
                label: 'Atendimentos',
                data: [95, 80, 60],
                backgroundColor: 'rgba(118, 74, 226, 0.6)',
                borderColor: 'rgba(118, 74, 226, 1)',
                borderWidth: 1
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    };
    
    // Criar o gráfico
    window.profissionaisChart = new Chart(ctx, config);
}

// Inicializar gráficos da aba Clientes
function initClientesCharts() {
    const ctx = document.getElementById('clientesChart');
    
    if (!ctx || window.clientesChart) return;
    
    // Dados simulados para o gráfico de evolução de clientes
    const data = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'],
        datasets: [
            {
                label: 'Total de Clientes',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                data: [320, 330, 340, 347, 356, 365, 372, 378],
                tension: 0.3,
                yAxisID: 'y'
            },
            {
                label: 'Novos Clientes',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                data: [0, 10, 10, 7, 9, 9, 7, 6],
                tension: 0.3,
                type: 'bar',
                yAxisID: 'y1'
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
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Total de Clientes'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Novos Clientes'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    window.clientesChart = new Chart(ctx, config);
}

// Gráfico de região dos clientes
function initRegiaoChart() {
    const ctx = document.getElementById('regiaoChart');
    
    if (!ctx || window.regiaoChart) return;
    
    // Dados simulados para o gráfico de região dos clientes
    const data = {
        labels: ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'],
        datasets: [{
            label: 'Clientes',
            data: [105, 85, 75, 60, 53],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'pie',
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
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            
                            return `${context.label}: ${value} clientes (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    window.regiaoChart = new Chart(ctx, config);
}

// Inicializar gráficos da aba Agendamentos
function initAgendamentosChart() {
    const ctx = document.getElementById('agendamentosChart');
    
    if (!ctx || window.agendamentosChart) return;
    
    // Dados simulados para o gráfico de agendamentos
    const data = {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [
            {
                label: 'Agendamentos',
                backgroundColor: 'rgba(118, 74, 226, 0.6)',
                borderColor: 'rgba(118, 74, 226, 1)',
                borderWidth: 1,
                data: [32, 29, 35, 38, 42, 50, 9]
            },
            {
                label: 'Capacidade',
                backgroundColor: 'rgba(220, 220, 220, 0.6)',
                borderColor: 'rgba(220, 220, 220, 1)',
                borderWidth: 1,
                data: [45, 45, 45, 45, 48, 60, 20]
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Agendamentos'
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    window.agendamentosChart = new Chart(ctx, config);
}

// Gráfico de status dos agendamentos
function initStatusChart() {
    const ctx = document.getElementById('statusChart');
    
    if (!ctx || window.statusChart) return;
    
    // Dados simulados para o gráfico de status
    const data = {
        labels: ['Concluído', 'Confirmado', 'Pendente', 'Cancelado', 'Ausente'],
        datasets: [{
            label: 'Status',
            data: [150, 60, 5, 15, 5],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',
                'rgba(0, 123, 255, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(108, 117, 125, 0.8)'
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(0, 123, 255, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 53, 69, 1)',
                'rgba(108, 117, 125, 1)'
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
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            
                            return `${context.label}: ${value} agendamentos (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    // Criar o gráfico
    window.statusChart = new Chart(ctx, config);
}

// Verificar limitações do plano gratuito
function checkFreePlanLimitations() {
    // Simulação: verificar se o usuário está no plano gratuito
    const isFreePlan = true;
    
    if (isFreePlan) {
        // Limitar funcionalidades para o plano gratuito
        document.querySelectorAll('.btn-outline-primary, .btn-primary').forEach(btn => {
            if (!btn.classList.contains('btn-sm') && 
                btn.textContent.trim() !== 'Atualizar Plano' && 
                !btn.closest('.modal-footer')) {
                
                btn.addEventListener('click', function(e) {
                    if (e.currentTarget.textContent.trim() !== 'Atualizar Plano') {
                        e.preventDefault();
                        e.stopPropagation();
                        alert('O módulo de relatórios avançados está disponível apenas no plano profissional. Atualize seu plano para acessar todas as funcionalidades!');
                    }
                });
            }
        });
        
        // Adicionar efeito de desfoque aos gráficos
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.filter = 'blur(5px)';
            canvas.style.pointerEvents = 'none';
            
            // Adicionar overlay com mensagem
            const parent = canvas.parentElement;
            const overlay = document.createElement('div');
            overlay.className = 'position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            overlay.style.zIndex = '10';
            overlay.innerHTML = `<div class="text-center p-3">
                <h5>Relatório Avançado</h5>
                <p>Disponível no plano Profissional</p>
                <a href="planos.html" class="btn btn-primary btn-sm">Atualizar Plano</a>
            </div>`;
            
            // Garantir que o pai tenha position relative para o overlay funcionar
            if (window.getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            
            parent.appendChild(overlay);
        });
    }
}

// Animações dos elementos da interface
function animateElements() {
    // Animações já implementadas via CSS em main.js
}