// Verificação do token de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Se não estiver logado, redireciona para o login
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializa os eventos
    initEventListeners();
    
    // Ativar tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
});

function initEventListeners() {
    // Upload de logo da empresa
    const logoInput = document.getElementById('logoInput');
    const previewLogo = document.getElementById('previewLogo');
    
    if (logoInput && previewLogo) {
        logoInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewLogo.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Copiar Link de Agendamento
    const copyLinkBtn = document.querySelector('.copy-link');
    
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const linkAgendamento = document.getElementById('linkAgendamento').value;
            const fullLink = `https://agenda.belezapro.com/${linkAgendamento}`;
            
            navigator.clipboard.writeText(fullLink)
                .then(() => {
                    // Altera texto do botão temporariamente
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="bi bi-check-lg me-2"></i> Copiado!';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar: ', err);
                });
        });
    }
    
    // Salvar alterações das configurações
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', function() {
            // Verifica qual aba está ativa
            const activeTab = document.querySelector('.tab-pane.active');
            let formId;
            
            if (activeTab.id === 'empresa') {
                formId = 'empresaForm';
            } else if (activeTab.id === 'conta') {
                formId = 'contaForm';
            } else if (activeTab.id === 'agendamento') {
                formId = 'agendamentoForm';
            } else if (activeTab.id === 'notificacoes') {
                formId = 'notificacoesForm';
            }
            
            if (formId) {
                const form = document.getElementById(formId);
                if (form && form.checkValidity()) {
                    // Mostrar indicador de carregamento
                    const originalText = saveConfigBtn.innerHTML;
                    saveConfigBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
                    saveConfigBtn.disabled = true;
                    
                    // Simulação de salvamento
                    setTimeout(() => {
                        // Mensagem de sucesso temporária
                        const alert = document.createElement('div');
                        alert.className = 'alert alert-success alert-dismissible fade show';
                        alert.role = 'alert';
                        alert.innerHTML = `
                            <i class="bi bi-check-circle me-2"></i>
                            Configurações salvas com sucesso!
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        `;
                        
                        // Inserir alerta antes do formulário
                        form.parentNode.insertBefore(alert, form);
                        
                        // Restaurar o botão
                        saveConfigBtn.innerHTML = originalText;
                        saveConfigBtn.disabled = false;
                        
                        // Remover alerta após 4 segundos
                        setTimeout(() => {
                            alert.remove();
                        }, 4000);
                    }, 1500);
                } else {
                    // Mostrar validação se o formulário for inválido
                    form.reportValidity();
                }
            }
        });
    }
    
    // Domingo - ativar/desativar inputs
    const domingoCB = document.getElementById('domingo');
    
    if (domingoCB) {
        const domingoInputs = domingoCB.closest('.row').querySelectorAll('input[type="time"]');
        
        domingoCB.addEventListener('change', function() {
            domingoInputs.forEach(input => {
                input.disabled = !this.checked;
            });
        });
    }
    
    // Botões específicos por seção
    const salvarContaBtn = document.getElementById('salvarContaBtn');
    const salvarAgendamentoBtn = document.getElementById('salvarAgendamentoBtn');
    
    if (salvarContaBtn) {
        salvarContaBtn.addEventListener('click', function() {
            const form = document.getElementById('contaForm');
            if (form && form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
                this.disabled = true;
                
                // Simulação de salvamento
                setTimeout(() => {
                    alert('Informações da conta salvas com sucesso!');
                    this.innerHTML = '<i class="bi bi-save me-2"></i>Salvar Alterações';
                    this.disabled = false;
                }, 1500);
            } else {
                form.reportValidity();
            }
        });
    }
    
    if (salvarAgendamentoBtn) {
        salvarAgendamentoBtn.addEventListener('click', function() {
            const form = document.getElementById('agendamentoForm');
            if (form && form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
                this.disabled = true;
                
                // Simulação de salvamento
                setTimeout(() => {
                    alert('Configurações de agendamento salvas com sucesso!');
                    this.innerHTML = '<i class="bi bi-save me-2"></i>Salvar Alterações';
                    this.disabled = false;
                }, 1500);
            } else {
                form.reportValidity();
            }
        });
    }
    
    // Processamento de pagamento
    const confirmarPagamento = document.getElementById('confirmarPagamento');
    
    if (confirmarPagamento) {
        confirmarPagamento.addEventListener('click', function() {
            const form = document.getElementById('pagamentoForm');
            
            if (form.checkValidity()) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processando...';
                this.disabled = true;
                
                // Simulação de processamento de pagamento
                setTimeout(() => {
                    // Fecha todos os modais
                    const modals = document.querySelectorAll('.modal');
                    modals.forEach(modal => {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) modalInstance.hide();
                    });
                    
                    // Atualiza a UI para refletir o novo plano
                    const planoLabel = document.querySelector('.card-header .badge');
                    if (planoLabel) planoLabel.textContent = 'Profissional';
                    
                    // Habilita os elementos do plano profissional
                    const disabledElements = document.querySelectorAll('input[disabled], select[disabled], button[disabled]');
                    disabledElements.forEach(el => {
                        if (!el.classList.contains('btn-outline-primary')) {
                            el.disabled = false;
                        }
                    });
                    
                    // Altera as mensagens limitativas
                    const alertPlano = document.querySelectorAll('.alert-info');
                    alertPlano.forEach(alert => {
                        alert.classList.replace('alert-info', 'alert-success');
                        alert.innerHTML = '<i class="bi bi-check-circle me-2"></i><span>Recursos do plano profissional estão ativados!</span>';
                    });
                    
                    // Mostra mensagem de sucesso
                    alert('Parabéns! Seu plano foi atualizado para Profissional com sucesso!');
                    
                    // Restaura o botão
                    this.innerHTML = '<i class="bi bi-credit-card me-2"></i>Confirmar Pagamento';
                    this.disabled = false;
                }, 2500);
            } else {
                form.reportValidity();
            }
        });
    }
}