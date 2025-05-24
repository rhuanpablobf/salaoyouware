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
            // Em produção, você faria uma requisição real para a API
            // const dashboardData = await fetchAPI('dashboard');
            
            // Dados simulados
            const dashboardData = {
                stats: {
                    agendamentosHoje: 8,
                    clientesTotal: 156,
                    faturamentoMes: 'R$ 5.480,00',
                    servicosRealizados: 42
                },
                charts: {
                    agendamentos: {
                        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                        data: [5, 7, 10, 8, 12, 15, 6]
                    },
                    faturamento: {
                        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                        data: [3200, 4100, 3800, 5100, 4700, 5480]
                    }
                },
                proximosAgendamentos: [
                    {
                        id: 1,
                        cliente: 'Ana Silva',
                        servico: 'Corte de Cabelo',
                        horario: '14:30',
                        data: '2023-10-15',
                        status: 'confirmado'
                    },
                    {
                        id: 2,
                        cliente: 'Carlos Mendes',
                        servico: 'Barba',
                        horario: '15:45',
                        data: '2023-10-15',
                        status: 'pendente'
                    },
                    {
                        id: 3,
                        cliente: 'Mariana Costa',
                        servico: 'Coloração',
                        horario: '10:00',
                        data: '2023-10-16',
                        status: 'confirmado'
                    },
                    {
                        id: 4,
                        cliente: 'João Paulo',
                        servico: 'Barba + Corte',
                        horario: '16:30',
                        data: '2023-10-16',
                        status: 'pendente'
                    }
                ],
                ultimosClientes: [
                    {
                        id: 1,
                        nome: 'Fernanda Oliveira',
                        email: 'fernanda@email.com',
                        telefone: '(11) 98765-4321',
                        dataRegistro: '2023-10-12'
                    },
                    {
                        id: 2,
                        nome: 'Roberto Almeida',
                        email: 'roberto@email.com',
                        telefone: '(11) 99876-5432',
                        dataRegistro: '2023-10-10'
                    },
                    {
                        id: 3,
                        nome: 'Camila Santos',
                        email: 'camila@email.com',
                        telefone: '(11) 91234-5678',
                        dataRegistro: '2023-10-08'
                    }
                ]
            };

            // Atualizar estatísticas
            updateStats(dashboardData.stats);
            
            // Atualizar gráficos
            updateCharts(dashboardData.charts);
            
            // Atualizar listas
            updateLists(dashboardData.proximosAgendamentos, dashboardData.ultimosClientes);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            showMessage('Erro ao carregar dados do dashboard', 'error');
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