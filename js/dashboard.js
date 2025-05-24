document.addEventListener('DOMContentLoaded', async function() {
    // Elementos do dashboard
    const statElements = {
        agendamentosHoje: document.getElementById('agendamentosHoje'),
        clientesTotal: document.getElementById('clientesTotal'),
        faturamentoMes: document.getElementById('faturamentoMes'),
        servicosRealizados: document.getElementById('servicosRealizados')
    };

    const chartElements = {
        agendamentosChart: document.getElementById('agendamentosChart'),
        faturamentoChart: document.getElementById('faturamentoChart')
    };

    const lists = {
        proximosAgendamentos: document.getElementById('proximosAgendamentos'),
        ultimosClientes: document.getElementById('ultimosClientes')
    };

    // Carregar dados do dashboard
    loadDashboardData();

    // Inicializar gráficos
    initCharts();

    // Função para carregar dados do dashboard
    async function loadDashboardData() {
        try {
            // Limpar dados existentes
            updateStats({
                agendamentosHoje: 0,
                clientesTotal: 0,
                faturamentoMes: 'R$ 0,00',
                servicosRealizados: 0
            });
            
            // Carregar dados reais do servidor
            const userData = JSON.parse(localStorage.getItem('user_data'));
            const userId = userData?._id;
            const empresaId = userData?.empresaId;
            
            if (!userId || !empresaId) {
                throw new Error('Dados do usuário não encontrados');
            }
            
            // Atualizar nome do usuário no dashboard
            const userNameElement = document.getElementById('userName');
            if (userNameElement && userData) {
                userNameElement.textContent = userData.nome || 'Usuário';
            }
            
            // Mostrar carregamento
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'alert alert-info text-center';
            loadingMessage.textContent = 'Carregando dados...';
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.insertBefore(loadingMessage, mainContent.firstChild);
            }
            
            // Buscar dados reais da API
            try {
                // Obter agendamentos
                const agendamentosResponse = await fetchAPI('agenda');
                console.log('Resposta de agendamentos:', agendamentosResponse);
                const agendamentos = agendamentosResponse?.data || [];
                
                // Obter clientes
                const clientesResponse = await fetchAPI('clientes');
                console.log('Resposta de clientes:', clientesResponse);
                const clientes = clientesResponse?.data || [];
                
                // Obter dados financeiros
                const financeiroResponse = await fetchAPI('financeiro/resumo');
                console.log('Resposta de financeiro:', financeiroResponse);
                const financeiro = financeiroResponse?.data || {};
                
                // Obter empresa
                const empresaResponse = await fetchAPI('empresas');
                console.log('Resposta de empresa:', empresaResponse);
                const empresa = empresaResponse?.data || {};
                
                // Montar objeto de dados do dashboard
                const dashboardData = {
                    stats: {
                        agendamentosHoje: agendamentos.filter(a => {
                            const hoje = new Date().toISOString().split('T')[0];
                            return a.data?.split('T')[0] === hoje;
                        }).length || 0,
                        clientesTotal: clientes.length || 0,
                        faturamentoMes: `R$ ${(financeiro.faturamentoMensal || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
                        servicosRealizados: agendamentos.filter(a => a.status === 'concluido').length || 0
                    },
                    charts: {
                        agendamentos: {
                            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                            data: [0, 0, 0, 0, 0, 0, 0] // Estes dados seriam calculados com base nos agendamentos
                        },
                        faturamento: {
                            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                            data: [0, 0, 0, 0, 0, 0] // Estes dados seriam calculados com base nos financeiros
                        }
                    },
                    proximosAgendamentos: agendamentos
                        .filter(a => a.status !== 'cancelado' && a.status !== 'concluido')
                        .slice(0, 5) || [],
                    ultimosClientes: clientes.slice(0, 5) || [],
                    empresa: empresa
                };

            // Atualizar estatísticas
            updateStats(dashboardData.stats);
            
            // Atualizar gráficos
            updateCharts(dashboardData.charts);
            
            // Atualizar listas
            updateLists(dashboardData.proximosAgendamentos, dashboardData.ultimosClientes);
            
            // Atualizar informações da empresa
            if (dashboardData.empresa) {
                // Atualizar o nome da empresa na página
                document.title = `Dashboard - ${dashboardData.empresa.nome || 'BelezaPro'}`;
                
                // Atualizar informações do plano
                if (dashboardData.empresa.plano) {
                    const planoElemento = document.querySelector('.card-title .badge');
                    if (planoElemento) {
                        planoElemento.textContent = dashboardData.empresa.plano.charAt(0).toUpperCase() + dashboardData.empresa.plano.slice(1);
                    }
                    
                    // Atualizar barra de progresso do plano
                    if (dashboardData.empresa.planoDetalhes) {
                        const textoPlano = document.querySelector('.card .small.mb-2');
                        const barraProgresso = document.querySelector('.progress .progress-bar');
                        
                        if (textoPlano && barraProgresso) {
                            const usados = dashboardData.empresa.planoDetalhes.agendamentosUsados || 0;
                            const limite = dashboardData.empresa.planoDetalhes.limiteAgendamentos || 5;
                            const porcentagem = Math.min(Math.round((usados / limite) * 100), 100);
                            
                            textoPlano.textContent = `Você usou ${usados} de ${limite} agendamentos este mês`;
                            barraProgresso.style.width = `${porcentagem}%`;
                            barraProgresso.setAttribute('aria-valuenow', porcentagem);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            showMessage('Erro ao carregar dados do dashboard: ' + error.message, 'error');
            
            // Usar dados vazios em caso de erro
            updateStats({
                agendamentosHoje: 0,
                clientesTotal: 0,
                faturamentoMes: 'R$ 0,00',
                servicosRealizados: 0
            });
            
            updateCharts({
                agendamentos: {
                    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                    data: [0, 0, 0, 0, 0, 0, 0]
                },
                faturamento: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    data: [0, 0, 0, 0, 0, 0]
                }
            });
            
            updateLists([], []);
        }
    }

    // Atualizar estatísticas
    function updateStats(stats) {
        if (statElements.agendamentosHoje) {
            statElements.agendamentosHoje.textContent = stats.agendamentosHoje;
        }
        
        if (statElements.clientesTotal) {
            statElements.clientesTotal.textContent = stats.clientesTotal;
        }
        
        if (statElements.faturamentoMes) {
            statElements.faturamentoMes.textContent = stats.faturamentoMes;
        }
        
        if (statElements.servicosRealizados) {
            statElements.servicosRealizados.textContent = stats.servicosRealizados;
        }
    }

    // Inicializar gráficos
    function initCharts() {
        // Verificar se o Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js não está disponível');
            return;
        }

        // Gráfico de agendamentos
        if (chartElements.agendamentosChart) {
            window.agendamentosChart = new Chart(chartElements.agendamentosChart, {
                type: 'line',
                data: {
                    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                    datasets: [{
                        label: 'Agendamentos',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(138, 43, 226, 0.2)',
                        borderColor: '#8A2BE2',
                        borderWidth: 2,
                        tension: 0.3,
                        pointBackgroundColor: '#8A2BE2'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            });
        }

        // Gráfico de faturamento
        if (chartElements.faturamentoChart) {
            window.faturamentoChart = new Chart(chartElements.faturamentoChart, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Faturamento (R$)',
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(138, 43, 226, 0.7)',
                        borderColor: '#8A2BE2',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Atualizar gráficos com dados
    function updateCharts(chartData) {
        // Atualizar gráfico de agendamentos
        if (window.agendamentosChart && chartData.agendamentos) {
            window.agendamentosChart.data.labels = chartData.agendamentos.labels;
            window.agendamentosChart.data.datasets[0].data = chartData.agendamentos.data;
            window.agendamentosChart.update();
        }
        
        // Atualizar gráfico de faturamento
        if (window.faturamentoChart && chartData.faturamento) {
            window.faturamentoChart.data.labels = chartData.faturamento.labels;
            window.faturamentoChart.data.datasets[0].data = chartData.faturamento.data;
            window.faturamentoChart.update();
        }
    }

    // Atualizar listas
    function updateLists(agendamentos, clientes) {
        // Atualizar lista de próximos agendamentos
        if (lists.proximosAgendamentos) {
            lists.proximosAgendamentos.innerHTML = '';
            
            if (agendamentos.length === 0) {
                lists.proximosAgendamentos.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum agendamento encontrado</td></tr>';
            } else {
                agendamentos.forEach(agendamento => {
                    const statusClass = getStatusClass(agendamento.status);
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar me-2">${getInitials(agendamento.cliente)}</div>
                                <div>${agendamento.cliente}</div>
                            </div>
                        </td>
                        <td>${agendamento.servico}</td>
                        <td>${formatDate(agendamento.data)} ${agendamento.horario}</td>
                        <td>
                            <span class="status-badge ${statusClass}">${capitalizeFirstLetter(agendamento.status)}</span>
                        </td>
                    `;
                    
                    lists.proximosAgendamentos.appendChild(row);
                });
            }
        }
        
        // Atualizar lista de últimos clientes
        if (lists.ultimosClientes) {
            lists.ultimosClientes.innerHTML = '';
            
            if (clientes.length === 0) {
                lists.ultimosClientes.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum cliente encontrado</td></tr>';
            } else {
                clientes.forEach(cliente => {
                    const row = document.createElement('tr');
                    const formattedDate = new Date(cliente.dataRegistro).toLocaleDateString('pt-BR');
                    
                    row.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar me-2">${getInitials(cliente.nome)}</div>
                                <div>
                                    <div class="fw-bold">${cliente.nome}</div>
                                    <div class="small text-muted">${cliente.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>${cliente.telefone}</td>
                        <td>${formattedDate}</td>
                    `;
                    
                    lists.ultimosClientes.appendChild(row);
                });
            }
        }
    }

    // Funções auxiliares
    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'confirmado': return 'status-confirmed';
            case 'pendente': return 'status-pending';
            case 'concluido': return 'status-completed';
            case 'cancelado': return 'status-canceled';
            default: return 'status-pending';
        }
    }
    
    function getInitials(name) {
        return name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase();
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
});