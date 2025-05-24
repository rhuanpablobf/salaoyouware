// Verificação do token de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Se não estiver logado, redireciona para o login
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializar a data atual no filtro
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = today;
    });
    
    // Configuração dos eventos de logout
    setupLogout();
    
    // Configuração do modal de novo cliente quando selecionado do dropdown
    setupClienteDropdown();
    
    // Configuração dos eventos de clique na agenda
    setupAgendaClicks();
    
    // Configuração dos formulários de agendamento e cliente
    setupForms();
});

// Configura eventos de logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Limpa o localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            
            // Redireciona para a página de login
            window.location.href = 'index.html';
        });
    }
}

// Configura o dropdown de clientes para abrir o modal quando "Novo Cliente" é selecionado
function setupClienteDropdown() {
    const clienteSelect = document.querySelector('#agendamentoForm select:first-of-type');
    
    if (clienteSelect) {
        clienteSelect.addEventListener('change', function() {
            if (this.value === 'novo_cliente') {
                // Resetar o select para o valor anterior
                this.selectedIndex = 0;
                
                // Abrir modal de novo cliente
                new bootstrap.Modal(document.getElementById('novoClienteModal')).show();
            }
        });
    }
}

// Configura eventos de clique nos horários da agenda
function setupAgendaClicks() {
    const scheduleHours = document.querySelectorAll('.schedule-hour');
    
    scheduleHours.forEach(hour => {
        hour.addEventListener('click', function() {
            // Não abrir modal se for horário de almoço/pausa
            if (this.classList.contains('break')) {
                return;
            }
            
            // Se já ocupado, poderia mostrar detalhes ou opções
            if (this.classList.contains('occupied')) {
                // Aqui poderia abrir um modal com detalhes ou opções para o agendamento existente
                console.log('Horário ocupado:', this.querySelector('.fw-bold').textContent, this.querySelector('.small:not(.text-muted)').textContent);
            } else {
                // Abrir modal de novo agendamento com o horário selecionado
                const horarioSelect = document.querySelector('#agendamentoForm select[required]:nth-of-type(3)');
                const horario = this.querySelector('.fw-bold').textContent;
                
                // Encontrar o profissional
                const profissionalName = this.closest('.p-3').querySelector('h6').textContent;
                const profissionalSelect = document.querySelector('#agendamentoForm select[required]:nth-of-type(2)');
                
                // Mostrar o modal
                const modal = new bootstrap.Modal(document.getElementById('novoAgendamentoModal'));
                
                // Selecionar o horário e profissional corretos após o modal ser mostrado
                modal._element.addEventListener('shown.bs.modal', function() {
                    // Selecionar o horário
                    for (let i = 0; i < horarioSelect.options.length; i++) {
                        if (horarioSelect.options[i].text === horario) {
                            horarioSelect.selectedIndex = i;
                            break;
                        }
                    }
                    
                    // Selecionar o profissional
                    for (let i = 0; i < profissionalSelect.options.length; i++) {
                        if (profissionalSelect.options[i].text === profissionalName) {
                            profissionalSelect.selectedIndex = i;
                            break;
                        }
                    }
                }, {once: true});
                
                modal.show();
            }
        });
    });
}

// Configuração dos formulários
function setupForms() {
    const agendamentoForm = document.getElementById('agendamentoForm');
    const clienteForm = document.getElementById('clienteForm');
    
    // Formulário de agendamento
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar se o usuário atingiu o limite do plano gratuito
            const planoInfo = document.querySelector('.progress-bar');
            if (planoInfo && planoInfo.style.width === '100%') {
                alert('Você atingiu o limite de agendamentos do plano gratuito. Atualize seu plano para continuar usando o sistema.');
                return;
            }
            
            // Simulação de agendamento
            alert('Agendamento realizado com sucesso!');
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoAgendamentoModal'));
            if (modal) modal.hide();
            
            // Em um cenário real, recarregaríamos os dados da agenda
            // Por enquanto, apenas atualizamos a barra de progresso
            if (planoInfo) {
                const currentWidth = parseInt(planoInfo.style.width);
                if (currentWidth < 100) {
                    planoInfo.style.width = (currentWidth + 20) + '%';
                    
                    // Atualiza o texto
                    const usedText = document.querySelector('.progress').previousElementSibling;
                    const [used] = usedText.textContent.match(/\d+/g) || [3];
                    usedText.textContent = `Você usou ${parseInt(used) + 1} de 5 agendamentos este mês`;
                }
            }
        });
    }
    
    // Formulário de cliente
    if (clienteForm) {
        clienteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de cadastro
            alert('Cliente cadastrado com sucesso!');
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoClienteModal'));
            if (modal) modal.hide();
            
            // Em um cenário real, atualizaríamos o dropdown de clientes no modal de agendamento
        });
    }
}

// Função para filtrar a agenda (para ser implementada quando houver backend real)
function filtrarAgenda() {
    // Obter valores dos filtros
    const data = document.querySelector('input[type="date"]').value;
    const profissional = document.querySelector('select:nth-of-type(1)').value;
    const servico = document.querySelector('select:nth-of-type(2)').value;
    const status = document.querySelector('select:nth-of-type(3)').value;
    
    console.log('Filtrar por:', { data, profissional, servico, status });
    
    // Em um cenário real, faríamos uma requisição para o backend
    // e atualizaríamos a agenda com os resultados
}