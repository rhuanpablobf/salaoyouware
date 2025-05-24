// Verificação do token de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Se não estiver logado, redireciona para o login
        window.location.href = 'index.html';
        return;
    }
    
    // Inicializa o módulo de clientes
    setupSearch();
    setupClienteForm();
    setupFidelidade();
    setupClienteActions();
    setupModalDetails();
});

// Configuração da busca e filtros
function setupSearch() {
    const searchInput = document.querySelector('.input-group input[type="text"]');
    const searchButton = document.querySelector('.input-group button');
    const orderSelect = document.querySelector('.card-body select');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            buscarClientes(searchInput.value, orderSelect.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarClientes(searchInput.value, orderSelect.value);
            }
        });
    }
    
    if (orderSelect) {
        orderSelect.addEventListener('change', function() {
            ordenarClientes(this.value);
        });
    }
}

// Função para simular busca de clientes
function buscarClientes(termo, ordem) {
    if (!termo) {
        alert('Mostrando todos os clientes');
        return;
    }
    
    console.log(`Buscando por: ${termo} (Ordenação: ${ordem})`);
    alert(`Buscando clientes com o termo: ${termo}`);
    
    // Na implementação real, faríamos uma requisição para a API
    // e atualizaríamos a tabela com os resultados
}

// Função para ordenar a tabela de clientes
function ordenarClientes(criterio) {
    console.log(`Ordenando por: ${criterio}`);
    
    // Na implementação real, reordenaria a tabela baseado no critério
    // ou faria uma nova requisição para a API
}

// Configuração do formulário de cadastro de cliente
function setupClienteForm() {
    const clienteForm = document.getElementById('clienteForm');
    
    if (clienteForm) {
        clienteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter todos os campos do formulário
            const formData = new FormData(clienteForm);
            const clienteData = {};
            
            formData.forEach((value, key) => {
                clienteData[key] = value;
            });
            
            console.log('Dados do cliente:', clienteData);
            
            // Simular envio para API
            const submitBtn = document.querySelector('.modal-footer button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cadastrando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Cliente cadastrado com sucesso!');
                
                // Restaurar botão
                submitBtn.innerHTML = 'Cadastrar Cliente';
                submitBtn.disabled = false;
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoClienteModal'));
                if (modal) modal.hide();
                
                // Limpar o formulário
                clienteForm.reset();
                
                // Em um sistema real, recarregaríamos a lista de clientes
            }, 1500);
        });
    }
}

// Configuração do sistema de fidelidade
function setupFidelidade() {
    const fidelidadeBtn = document.querySelector('.btn-outline-primary');
    
    if (fidelidadeBtn) {
        fidelidadeBtn.addEventListener('click', function() {
            // Modal de configurações do programa de fidelidade
            const html = `
            <div class="modal fade" id="fidelidadeModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Configurações do Programa de Fidelidade</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="fidelidadeForm">
                                <div class="mb-3">
                                    <label class="form-label">Tipo de Programa</label>
                                    <select class="form-select" id="tipoPrograma">
                                        <option value="estrelas" selected>Estrelas (5 Visitas = 1 Estrela)</option>
                                        <option value="pontos">Pontos (R$ 1,00 = 1 Ponto)</option>
                                        <option value="cashback">Cashback (% do valor gasto retorna como crédito)</option>
                                    </select>
                                </div>
                                
                                <div id="estrelasConfig">
                                    <div class="mb-3">
                                        <label class="form-label">Visitas por Estrela</label>
                                        <input type="number" class="form-control" value="5" min="1">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Prêmio ao completar 5 estrelas</label>
                                        <select class="form-select">
                                            <option value="servico" selected>Serviço gratuito (até R$ 50,00)</option>
                                            <option value="desconto">Desconto de 50% em qualquer serviço</option>
                                            <option value="credito">R$ 50,00 em crédito</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div id="pontosConfig" style="display: none;">
                                    <div class="mb-3">
                                        <label class="form-label">Valor (R$) por Ponto</label>
                                        <div class="input-group">
                                            <span class="input-group-text">R$</span>
                                            <input type="number" class="form-control" value="1" min="0.01" step="0.01">
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Pontos para Resgate</label>
                                        <input type="number" class="form-control" value="100" min="1">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Valor do Resgate</label>
                                        <div class="input-group">
                                            <span class="input-group-text">R$</span>
                                            <input type="number" class="form-control" value="10" min="1" step="0.01">
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="cashbackConfig" style="display: none;">
                                    <div class="mb-3">
                                        <label class="form-label">Percentual de Cashback</label>
                                        <div class="input-group">
                                            <input type="number" class="form-control" value="5" min="1" max="100">
                                            <span class="input-group-text">%</span>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Valor mínimo para usar crédito</label>
                                        <div class="input-group">
                                            <span class="input-group-text">R$</span>
                                            <input type="number" class="form-control" value="10" min="0" step="0.01">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="notificarClientes" checked>
                                        <label class="form-check-label" for="notificarClientes">Notificar clientes sobre pontos/estrelas</label>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="ativarAniversario" checked>
                                        <label class="form-check-label" for="ativarAniversario">Bônus para aniversariantes</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="salvarFidelidade">Salvar Configurações</button>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Adicionar modal ao body se não existir
            if (!document.getElementById('fidelidadeModal')) {
                document.body.insertAdjacentHTML('beforeend', html);
                
                // Configurar troca de tipo de programa
                const tipoPrograma = document.getElementById('tipoPrograma');
                if (tipoPrograma) {
                    tipoPrograma.addEventListener('change', function() {
                        document.getElementById('estrelasConfig').style.display = 'none';
                        document.getElementById('pontosConfig').style.display = 'none';
                        document.getElementById('cashbackConfig').style.display = 'none';
                        
                        document.getElementById(`${this.value}Config`).style.display = 'block';
                    });
                }
                
                // Configurar botão salvar
                const salvarBtn = document.getElementById('salvarFidelidade');
                if (salvarBtn) {
                    salvarBtn.addEventListener('click', function() {
                        alert('Configurações do programa de fidelidade salvas com sucesso!');
                        const modal = bootstrap.Modal.getInstance(document.getElementById('fidelidadeModal'));
                        if (modal) modal.hide();
                    });
                }
            }
            
            // Mostrar modal
            const fidelidadeModal = new bootstrap.Modal(document.getElementById('fidelidadeModal'));
            fidelidadeModal.show();
        });
    }
    
    // Configurações para envio de mensagens de aniversário
    const aniversarioButtons = document.querySelectorAll('button.btn-outline-primary');
    
    aniversarioButtons.forEach(button => {
        if (button.textContent.trim() === 'Enviar Mensagem') {
            button.addEventListener('click', function() {
                const clienteName = this.closest('.list-group-item').querySelector('span:first-child').textContent;
                const clienteDate = this.closest('.list-group-item').querySelector('span.text-muted').textContent;
                
                // Modal de envio de mensagem
                const html = `
                <div class="modal fade" id="mensagemModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Enviar Mensagem de Aniversário</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="mensagemForm">
                                    <div class="mb-3">
                                        <label class="form-label">Cliente</label>
                                        <input type="text" class="form-control" value="${clienteName}" readonly>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Data de Aniversário</label>
                                        <input type="text" class="form-control" value="${clienteDate}" readonly>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Modelo de Mensagem</label>
                                        <select class="form-select" id="modeloMensagem">
                                            <option value="padrao" selected>Mensagem Padrão</option>
                                            <option value="desconto">Mensagem com Oferta (10% de desconto)</option>
                                            <option value="personalizada">Mensagem Personalizada</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Mensagem</label>
                                        <textarea class="form-control" rows="4">Olá ${clienteName}, a equipe do BelezaPro deseja um Feliz Aniversário! Temos um presente especial para você. Venha nos fazer uma visita!</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="enviarWhatsapp" checked>
                                            <label class="form-check-label" for="enviarWhatsapp">Enviar por WhatsApp</label>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="enviarEmail" checked>
                                            <label class="form-check-label" for="enviarEmail">Enviar por E-mail</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="enviarMensagem">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                // Adicionar modal ao body se não existir
                if (!document.getElementById('mensagemModal')) {
                    document.body.insertAdjacentHTML('beforeend', html);
                    
                    // Configurar modelo de mensagem
                    const modeloMensagem = document.getElementById('modeloMensagem');
                    const mensagemTextarea = document.querySelector('#mensagemForm textarea');
                    
                    if (modeloMensagem) {
                        modeloMensagem.addEventListener('change', function() {
                            switch(this.value) {
                                case 'padrao':
                                    mensagemTextarea.value = `Olá ${clienteName}, a equipe do BelezaPro deseja um Feliz Aniversário! Temos um presente especial para você. Venha nos fazer uma visita!`;
                                    break;
                                case 'desconto':
                                    mensagemTextarea.value = `Olá ${clienteName}, feliz aniversário! 🎂 Como presente, oferecemos 10% de desconto em qualquer serviço. Essa oferta é válida por 7 dias. Aguardamos sua visita!`;
                                    break;
                                case 'personalizada':
                                    mensagemTextarea.value = '';
                                    break;
                            }
                        });
                    }
                    
                    // Configurar botão enviar
                    const enviarBtn = document.getElementById('enviarMensagem');
                    if (enviarBtn) {
                        enviarBtn.addEventListener('click', function() {
                            this.disabled = true;
                            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...';
                            
                            setTimeout(() => {
                                alert(`Mensagem de aniversário enviada com sucesso para ${clienteName}!`);
                                const modal = bootstrap.Modal.getInstance(document.getElementById('mensagemModal'));
                                if (modal) modal.hide();
                                
                                this.disabled = false;
                                this.innerHTML = 'Enviar';
                            }, 1500);
                        });
                    }
                } else {
                    // Atualizar valores
                    document.querySelector('#mensagemForm input').value = clienteName;
                    document.querySelector('#mensagemForm input:nth-child(2)').value = clienteDate;
                    document.querySelector('#mensagemForm textarea').value = `Olá ${clienteName}, a equipe do BelezaPro deseja um Feliz Aniversário! Temos um presente especial para você. Venha nos fazer uma visita!`;
                }
                
                // Mostrar modal
                const mensagemModal = new bootstrap.Modal(document.getElementById('mensagemModal'));
                mensagemModal.show();
            });
        }
    });
}

// Configuração das ações da tabela de clientes
function setupClienteActions() {
    const actionButtons = document.querySelectorAll('.dropdown-menu a');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.querySelector('i').classList.contains('bi-calendar-plus') ? 'agendamento' :
                         this.querySelector('i').classList.contains('bi-eye') ? 'detalhes' :
                         this.querySelector('i').classList.contains('bi-pencil') ? 'editar' :
                         this.querySelector('i').classList.contains('bi-trash') ? 'excluir' : null;
            
            const clientRow = this.closest('tr');
            const clientName = clientRow.querySelector('.d-flex h6').textContent;
            
            switch(action) {
                case 'agendamento':
                    // Abrir modal de agendamento com o cliente já selecionado
                    alert(`Novo agendamento para ${clientName}`);
                    // Na implementação real, abriria o modal de agendamento
                    break;
                    
                case 'detalhes':
                    // Já tratado pelo modal de detalhes
                    break;
                    
                case 'editar':
                    // Abrir modal com o formulário preenchido para edição
                    alert(`Editar cliente: ${clientName}`);
                    // Na implementação real, abriria o modal com os dados do cliente
                    break;
                    
                case 'excluir':
                    if (confirm(`Tem certeza que deseja excluir o cliente ${clientName}? Esta ação não pode ser desfeita.`)) {
                        alert(`Cliente ${clientName} excluído com sucesso!`);
                        // Na implementação real, removeria o cliente da base e da tabela
                    }
                    break;
            }
        });
    });
}

// Configuração do modal de detalhes do cliente
function setupModalDetails() {
    // Tabs do modal de detalhes
    const tabButtons = document.querySelectorAll('.nav-link');
    
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // Removendo a classe active de todas as tabs e conteúdos
            document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(c => {
                c.classList.remove('show');
                c.classList.remove('active');
            });
            
            // Adicionando active à tab clicada
            this.classList.add('active');
            
            // Mostrando o conteúdo correspondente
            const contentId = this.getAttribute('data-bs-target').substring(1);
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.add('show');
                content.classList.add('active');
            }
        });
    });
    
    // Modal de detalhes - Aba de Fidelidade
    const editPontosBtn = document.querySelector('#fidelidade .btn-outline-primary');
    const resgatarBtn = document.querySelector('#fidelidade .btn-primary');
    
    if (editPontosBtn) {
        editPontosBtn.addEventListener('click', function() {
            // Modal de edição de pontos
            const html = `
            <div class="modal fade" id="editarPontosModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Pontos de Fidelidade</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="pontosForm">
                                <div class="mb-3">
                                    <label class="form-label">Cliente</label>
                                    <input type="text" class="form-control" value="Ana Silva" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Estrelas Atuais</label>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-star-fill text-warning mx-1"></i>
                                        <i class="bi bi-star-fill text-warning mx-1"></i>
                                        <i class="bi bi-star-fill text-warning mx-1"></i>
                                        <i class="bi bi-star mx-1"></i>
                                        <i class="bi bi-star mx-1"></i>
                                        <span class="ms-2">(3 de 5)</span>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Ajustar Pontuação</label>
                                    <div class="input-group">
                                        <button type="button" class="btn btn-outline-secondary" id="diminuirEstrela">
                                            <i class="bi bi-dash-lg"></i>
                                        </button>
                                        <input type="number" class="form-control text-center" value="3" min="0" max="5" id="estrelasInput">
                                        <button type="button" class="btn btn-outline-secondary" id="aumentarEstrela">
                                            <i class="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Motivo da Alteração</label>
                                    <select class="form-select">
                                        <option selected>Correção</option>
                                        <option>Bônus Especial</option>
                                        <option>Fidelidade</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Observações</label>
                                    <textarea class="form-control" rows="2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="salvarPontos">Salvar Alterações</button>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Adicionar modal ao body se não existir
            if (!document.getElementById('editarPontosModal')) {
                document.body.insertAdjacentHTML('beforeend', html);
                
                // Configurar botões de ajuste
                const diminuirBtn = document.getElementById('diminuirEstrela');
                const aumentarBtn = document.getElementById('aumentarEstrela');
                const estrelasInput = document.getElementById('estrelasInput');
                
                if (diminuirBtn && aumentarBtn && estrelasInput) {
                    diminuirBtn.addEventListener('click', function() {
                        if (parseInt(estrelasInput.value) > 0) {
                            estrelasInput.value = parseInt(estrelasInput.value) - 1;
                        }
                    });
                    
                    aumentarBtn.addEventListener('click', function() {
                        if (parseInt(estrelasInput.value) < 5) {
                            estrelasInput.value = parseInt(estrelasInput.value) + 1;
                        }
                    });
                }
                
                // Configurar botão salvar
                const salvarBtn = document.getElementById('salvarPontos');
                if (salvarBtn) {
                    salvarBtn.addEventListener('click', function() {
                        const estrelas = document.getElementById('estrelasInput').value;
                        alert(`Pontuação atualizada para ${estrelas} estrelas`);
                        
                        // Atualizar a visualização das estrelas na aba de fidelidade
                        const estrelasElements = document.querySelectorAll('#fidelidade .bi-star, #fidelidade .bi-star-fill');
                        
                        estrelasElements.forEach((el, index) => {
                            el.classList.remove('bi-star-fill', 'bi-star');
                            el.classList.add(index < estrelas ? 'bi-star-fill' : 'bi-star');
                        });
                        
                        // Atualizar textos
                        document.querySelector('#fidelidade p').textContent = `Ana tem ${estrelas} estrelas de 5`;
                        
                        // Atualizar barra de progresso
                        const progressBar = document.querySelector('#fidelidade .progress-bar');
                        if (progressBar) {
                            progressBar.style.width = `${estrelas * 20}%`;
                        }
                        
                        // Atualizar mensagem
                        const mensagem = document.querySelector('#fidelidade p.mb-3');
                        if (mensagem) {
                            const faltam = 5 - parseInt(estrelas);
                            mensagem.textContent = faltam > 0 
                                ? `Faltam ${faltam} atendimento${faltam > 1 ? 's' : ''} para atingir 5 estrelas e ganhar um serviço gratuito!`
                                : 'Cliente atingiu 5 estrelas! Pode resgatar um serviço gratuito.';
                        }
                        
                        // Fechar o modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('editarPontosModal'));
                        if (modal) modal.hide();
                    });
                }
            }
            
            // Mostrar modal
            const editarPontosModal = new bootstrap.Modal(document.getElementById('editarPontosModal'));
            editarPontosModal.show();
        });
    }
    
    if (resgatarBtn) {
        resgatarBtn.addEventListener('click', function() {
            const clienteEstrelas = document.querySelector('#fidelidade p').textContent.split(' ')[2];
            
            if (parseInt(clienteEstrelas) < 5) {
                alert('O cliente precisa ter 5 estrelas para resgatar o prêmio.');
                return;
            }
            
            // Modal de resgate
            const html = `
            <div class="modal fade" id="resgatarPremioModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Resgatar Prêmio de Fidelidade</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <i class="bi bi-award text-warning" style="font-size: 4rem;"></i>
                                <h5 class="mt-3">Parabéns, Ana Silva!</h5>
                                <p>O cliente completou 5 estrelas e tem direito a um serviço gratuito de até R$ 50,00</p>
                            </div>
                            
                            <form id="resgatarForm">
                                <div class="mb-3">
                                    <label class="form-label">Serviço a ser resgatado</label>
                                    <select class="form-select">
                                        <option selected>Corte Feminino (R$ 80,00) - Você pagará R$ 30,00</option>
                                        <option>Escova (R$ 60,00) - Você pagará R$ 10,00</option>
                                        <option>Manicure (R$ 45,00) - Serviço Gratuito</option>
                                        <option>Pedicure (R$ 50,00) - Serviço Gratuito</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Data do Resgate</label>
                                    <input type="date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Observações</label>
                                    <textarea class="form-control" rows="2"></textarea>
                                </div>
                                
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle me-2"></i>
                                    Após o resgate, as estrelas serão zeradas e o cliente voltará a acumular a partir da próxima visita.
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirmarResgate">Confirmar Resgate</button>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Adicionar modal ao body se não existir
            if (!document.getElementById('resgatarPremioModal')) {
                document.body.insertAdjacentHTML('beforeend', html);
                
                // Configurar botão de confirmação
                const confirmarBtn = document.getElementById('confirmarResgate');
                if (confirmarBtn) {
                    confirmarBtn.addEventListener('click', function() {
                        this.disabled = true;
                        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processando...';
                        
                        setTimeout(() => {
                            alert('Prêmio resgatado com sucesso! As estrelas foram zeradas.');
                            
                            // Atualizar a visualização das estrelas na aba de fidelidade
                            const estrelasElements = document.querySelectorAll('#fidelidade .bi-star-fill');
                            estrelasElements.forEach(el => {
                                el.classList.remove('bi-star-fill');
                                el.classList.add('bi-star');
                            });
                            
                            // Atualizar textos
                            document.querySelector('#fidelidade p').textContent = 'Ana tem 0 estrelas de 5';
                            
                            // Atualizar barra de progresso
                            const progressBar = document.querySelector('#fidelidade .progress-bar');
                            if (progressBar) {
                                progressBar.style.width = '0%';
                            }
                            
                            // Atualizar mensagem
                            const mensagem = document.querySelector('#fidelidade p.mb-3');
                            if (mensagem) {
                                mensagem.textContent = 'Faltam 5 atendimentos para atingir 5 estrelas e ganhar um serviço gratuito!';
                            }
                            
                            // Fechar o modal
                            const modal = bootstrap.Modal.getInstance(document.getElementById('resgatarPremioModal'));
                            if (modal) modal.hide();
                            
                            this.disabled = false;
                            this.innerHTML = 'Confirmar Resgate';
                        }, 1500);
                    });
                }
            }
            
            // Mostrar modal
            const resgatarModal = new bootstrap.Modal(document.getElementById('resgatarPremioModal'));
            resgatarModal.show();
        });
    }
}