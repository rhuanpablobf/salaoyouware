// Script específico para o módulo Financeiro

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação (Token JWT)
    checkAuthentication();
    
    // Inicializar gráficos
    initFinanceChart();
    
    // Inicializar tooltips
    initTooltips();
    
    // Event listeners
    setupEventListeners();
    
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

// Gráfico de Balanço Financeiro
function initFinanceChart() {
    const ctx = document.getElementById('financeChart');
    
    if (!ctx) return;
    
    // Dados simulados para o gráfico
    const data = {
        labels: ['19/08', '20/08', '21/08', '22/08', '23/08', '24/08', '25/08'],
        datasets: [
            {
                label: 'Receitas',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                data: [1850, 1920, 1950, 2120, 2450, 2680, 2850],
                tension: 0.4
            },
            {
                label: 'Despesas',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 2,
                data: [620, 580, 650, 780, 950, 890, 950],
                tension: 0.4
            },
            {
                label: 'Lucro',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                data: [1230, 1340, 1300, 1340, 1500, 1790, 1900],
                tension: 0.4
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
    const financeChart = new Chart(ctx, config);
    
    // Event listener para botões de período
    document.querySelectorAll('.btn-group .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnGroup = this.closest('.btn-group');
            btnGroup.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aqui seria implementada a lógica para atualizar dados do gráfico com base no período
            console.log('Período selecionado:', this.textContent.trim());
            // updateChartData(financeChart, period);
        });
    });
}

// Inicializar tooltips do Bootstrap
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Manipular seleção de profissional para comissão
    const comissaoProfissional = document.getElementById('comissaoProfissional');
    const comissaoValor = document.getElementById('comissaoValor');
    
    if (comissaoProfissional && comissaoValor) {
        comissaoProfissional.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const valor = selectedOption.getAttribute('data-valor');
            if (valor) {
                comissaoValor.value = valor;
            }
        });
    }
    
    // Manipular seleção de período personalizado para comissão
    const comissaoPeriodo = document.getElementById('comissaoPeriodo');
    const periodosPersonalizados = document.getElementById('periodosPersonalizados');
    
    if (comissaoPeriodo && periodosPersonalizados) {
        comissaoPeriodo.addEventListener('change', function() {
            if (this.value === 'personalizado') {
                periodosPersonalizados.classList.remove('d-none');
            } else {
                periodosPersonalizados.classList.add('d-none');
            }
        });
    }
    
    // Confirmar fechamento de caixa
    const fecharCaixaBtn = document.getElementById('fecharCaixaBtn');
    
    if (fecharCaixaBtn) {
        fecharCaixaBtn.addEventListener('click', function() {
            processarFechamentoCaixa();
        });
    }
    
    // Botões de registrar receita e despesa
    setupFinancialForms();
}

// Processar fechamento de caixa
function processarFechamentoCaixa() {
    const valorSistemaDinheiro = parseFloat(document.getElementById('valorSistemaDinheiro').value) || 0;
    const valorRealDinheiro = parseFloat(document.getElementById('valorRealDinheiro').value) || 0;
    const observacoes = document.getElementById('observacoesCaixa').value;
    
    if (!valorRealDinheiro) {
        alert('Por favor, informe o valor real em dinheiro no caixa!');
        return;
    }
    
    const diferenca = valorRealDinheiro - valorSistemaDinheiro;
    let mensagem = 'Caixa fechado com sucesso!';
    
    if (diferenca !== 0) {
        const textoOperacao = diferenca > 0 ? 'sobra' : 'falta';
        mensagem += ` Houve ${textoOperacao} de ${Math.abs(diferenca).toFixed(2)} no caixa.`;
    }
    
    alert(mensagem);
    
    // Aqui seria implementada a lógica para salvar o fechamento em um banco de dados
    console.log('Fechamento de caixa processado', {
        data: new Date().toLocaleDateString(),
        valorSistema: valorSistemaDinheiro,
        valorReal: valorRealDinheiro,
        diferenca: diferenca,
        observacoes: observacoes
    });
    
    // Fechar o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('fechamentoCaixaModal'));
    if (modal) modal.hide();
    
    // Atualizar a lista de fechamentos
    updateFechamentosList();
}

// Atualizar a lista de fechamentos
function updateFechamentosList() {
    // Esta função seria implementada para atualizar a lista de fechamentos após um novo fechamento
    console.log('Atualizando lista de fechamentos de caixa...');
}

// Configurar formulários financeiros
function setupFinancialForms() {
    // Formulário de receita
    const receitaForm = document.getElementById('receitaForm');
    if (receitaForm) {
        receitaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter os valores do formulário
            const descricao = document.getElementById('receitaDescricao').value;
            const valor = document.getElementById('receitaValor').value;
            const data = document.getElementById('receitaData').value;
            const categoria = document.getElementById('receitaCategoria').value;
            const formaPagamento = document.getElementById('receitaFormaPagamento').value;
            
            // Validação básica
            if (!descricao || !valor || !data || !formaPagamento) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            // Processar o formulário
            console.log('Nova receita sendo processada:', {
                descricao,
                valor,
                data,
                categoria,
                formaPagamento
            });
            
            // Aqui seria implementada a lógica para salvar a receita em um banco de dados
            
            alert('Receita registrada com sucesso!');
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('novaReceitaModal'));
            if (modal) modal.hide();
            
            // Limpar o formulário
            receitaForm.reset();
            
            // Atualizar a interface
            updateFinancialData();
        });
    }
    
    // Formulário de despesa
    const despesaForm = document.getElementById('despesaForm');
    if (despesaForm) {
        despesaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter os valores do formulário
            const descricao = document.getElementById('despesaDescricao').value;
            const valor = document.getElementById('despesaValor').value;
            const data = document.getElementById('despesaData').value;
            const categoria = document.getElementById('despesaCategoria').value;
            const formaPagamento = document.getElementById('despesaFormaPagamento').value;
            
            // Validação básica
            if (!descricao || !valor || !data || !formaPagamento) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            // Processar o formulário
            console.log('Nova despesa sendo processada:', {
                descricao,
                valor,
                data,
                categoria,
                formaPagamento
            });
            
            // Aqui seria implementada a lógica para salvar a despesa em um banco de dados
            
            alert('Despesa registrada com sucesso!');
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('novaDespesaModal'));
            if (modal) modal.hide();
            
            // Limpar o formulário
            despesaForm.reset();
            
            // Atualizar a interface
            updateFinancialData();
        });
    }
    
    // Formulário de comissão
    const comissaoForm = document.getElementById('comissaoForm');
    if (comissaoForm) {
        comissaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter os valores do formulário
            const profissional = document.getElementById('comissaoProfissional');
            const valor = document.getElementById('comissaoValor').value;
            const formaPagamento = document.getElementById('comissaoFormaPagamento').value;
            
            // Validação básica
            if (!profissional.value || !valor || !formaPagamento) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            // Obter o nome do profissional
            const profissionalNome = profissional.options[profissional.selectedIndex].text.split(' - ')[0];
            
            // Processar o formulário
            console.log('Pagamento de comissão sendo processado:', {
                profissional: profissionalNome,
                valor,
                formaPagamento
            });
            
            // Aqui seria implementada a lógica para salvar o pagamento em um banco de dados
            
            alert(`Comissão de R$ ${valor} paga com sucesso para ${profissionalNome}!`);
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('pagarComissaoModal'));
            if (modal) modal.hide();
            
            // Limpar o formulário
            comissaoForm.reset();
            
            // Atualizar a interface
            updateFinancialData();
        });
    }

    // Inicializar as datas com a data atual
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });

    // Adicionar tags de moeda (R$) para inputs de valor
    const currencyInputs = document.querySelectorAll('input[type="number"][min="0.01"]');
    currencyInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    this.value = value.toFixed(2);
                }
            }
        });
    });
}

// Atualizar dados financeiros após alterações
function updateFinancialData() {
    // Esta função seria implementada para atualizar a interface após alterações financeiras
    console.log('Atualizando dados financeiros...');
    // Recarregar dados, atualizar gráficos, etc.
}

// Verificar limitações do plano gratuito
function checkFreePlanLimitations() {
    // Simulação: verificar se o usuário está no plano gratuito
    const isFreePlan = true;
    
    if (isFreePlan) {
        // Exibir aviso de limitação do plano gratuito
        document.querySelectorAll('.btn-primary, .btn-success, .btn-danger').forEach(btn => {
            if (!btn.classList.contains('btn-sm')) { // Não desativar botões pequenos (como o de atualizar plano)
                btn.addEventListener('click', function(e) {
                    if (e.currentTarget.id !== 'saveConfigBtn' && 
                        !e.currentTarget.classList.contains('btn-sm') && 
                        !e.currentTarget.closest('.modal-footer')) {
                        e.preventDefault();
                        alert('O módulo financeiro completo está disponível apenas no plano profissional. Atualize seu plano para acessar todas as funcionalidades!');
                    }
                });
            }
        });
    }
}

// Animações dos elementos da interface
function animateElements() {
    // Animações já implementadas via CSS em main.js
}