// Verificação do token de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Se não estiver logado, redireciona para o login
        window.location.href = 'index.html';
        return;
    }
    
    // Toggle para verificar/desmarcar todos os serviços
    const checkAllServicos = document.getElementById('checkAllServicos');
    
    if (checkAllServicos) {
        checkAllServicos.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#comboForm .combo-service');
            checkboxes.forEach(checkbox => {
                checkbox.checked = checkAllServicos.checked;
            });
            
            // Recalcular os totais do combo
            calcularTotaisCombo();
        });
    }
    
    // Toggle para verificar/desmarcar todos os serviços no formulário de edição
    const editarCheckAllServicos = document.getElementById('editarCheckAllServicos');
    
    if (editarCheckAllServicos) {
        editarCheckAllServicos.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#editarComboForm .combo-service');
            checkboxes.forEach(checkbox => {
                checkbox.checked = editarCheckAllServicos.checked;
            });
            
            // Recalcular os totais do combo
            calcularTotaisComboEditado();
        });
    }
    
    // Eventos para calcular os totais do combo ao selecionar/deselecionar serviços
    const comboServices = document.querySelectorAll('#comboForm .combo-service');
    comboServices.forEach(checkbox => {
        checkbox.addEventListener('change', calcularTotaisCombo);
    });
    
    // Eventos para calcular os totais do combo editado
    const editarComboServices = document.querySelectorAll('#editarComboForm .combo-service');
    editarComboServices.forEach(checkbox => {
        checkbox.addEventListener('change', calcularTotaisComboEditado);
    });
    
    // Evento para recalcular os totais quando o desconto mudar
    const comboDesconto = document.getElementById('comboDesconto');
    if (comboDesconto) {
        comboDesconto.addEventListener('input', calcularTotaisCombo);
    }
    
    // Evento para recalcular os totais quando o desconto do combo editado mudar
    const editarComboDesconto = document.getElementById('editarComboDesconto');
    if (editarComboDesconto) {
        editarComboDesconto.addEventListener('input', calcularTotaisComboEditado);
    }
    
    // Formulário de novo serviço
    const servicoForm = document.getElementById('servicoForm');
    if (servicoForm) {
        servicoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Serviço salvo com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoServicoModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar';
                submitBtn.disabled = false;
                
                // Em um cenário real, recarregaríamos a lista de serviços
            }, 1500);
        });
    }
    
    // Formulário de edição de serviço
    const editarServicoForm = document.getElementById('editarServicoForm');
    if (editarServicoForm) {
        editarServicoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Serviço atualizado com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editarServicoModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar Alterações';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Formulário de nova categoria
    const categoriaForm = document.getElementById('categoriaForm');
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Categoria salva com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novaCategoriaModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Formulário de novo combo
    const comboForm = document.getElementById('comboForm');
    if (comboForm) {
        comboForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar se foi selecionado pelo menos um serviço
            const servicosSelecionados = document.querySelectorAll('#comboForm .combo-service:checked');
            if (servicosSelecionados.length === 0) {
                alert('Selecione pelo menos um serviço para o combo.');
                return;
            }
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Combo salvo com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoComboModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Formulário de edição de combo
    const editarComboForm = document.getElementById('editarComboForm');
    if (editarComboForm) {
        editarComboForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar se foi selecionado pelo menos um serviço
            const servicosSelecionados = document.querySelectorAll('#editarComboForm .combo-service:checked');
            if (servicosSelecionados.length === 0) {
                alert('Selecione pelo menos um serviço para o combo.');
                return;
            }
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Combo atualizado com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editarComboModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar Alterações';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Calcular totais iniciais dos combos
    calcularTotaisComboEditado();
    
    // Modal de confirmação de exclusão
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    if (confirmDeleteModal) {
        confirmDeleteModal.addEventListener('show.bs.modal', function(event) {
            // Botão que acionou o modal
            const button = event.relatedTarget;
            
            // Extrair informações da linha da tabela
            const row = button.closest('tr');
            const servicoNome = row.querySelector('h6').textContent;
            
            // Atualizar o texto do modal
            const modalText = this.querySelector('p strong');
            modalText.textContent = servicoNome;
            
            // Configurar botão de exclusão
            const deleteButton = this.querySelector('.btn-danger');
            deleteButton.onclick = function() {
                // Em um cenário real, faríamos uma requisição para deletar o serviço
                // Por enquanto, apenas fechamos o modal e damos feedback
                const modal = bootstrap.Modal.getInstance(confirmDeleteModal);
                modal.hide();
                
                alert(`Serviço "${servicoNome}" excluído com sucesso!`);
            };
        });
    }
});

// Função para calcular os totais do combo
function calcularTotaisCombo() {
    const servicosSelecionados = document.querySelectorAll('#comboForm .combo-service:checked');
    let tempoTotal = 0;
    let precoTotal = 0;
    
    servicosSelecionados.forEach(checkbox => {
        tempoTotal += parseInt(checkbox.dataset.duracao);
        precoTotal += parseFloat(checkbox.dataset.preco);
    });
    
    // Aplicar desconto
    const descontoInput = document.getElementById('comboDesconto');
    const desconto = descontoInput ? parseFloat(descontoInput.value) / 100 : 0;
    const precoFinal = precoTotal * (1 - desconto);
    
    // Atualizar valores na interface
    const tempoTotalElement = document.getElementById('comboTempoTotal');
    const precoIndividualElement = document.getElementById('comboPrecoIndividual');
    const precoFinalElement = document.getElementById('comboPrecoFinal');
    
    if (tempoTotalElement) tempoTotalElement.value = `${tempoTotal} min`;
    if (precoIndividualElement) precoIndividualElement.value = `R$ ${precoTotal.toFixed(2)}`;
    if (precoFinalElement) precoFinalElement.textContent = `R$ ${precoFinal.toFixed(2)}`;
}

// Função para calcular os totais do combo editado
function calcularTotaisComboEditado() {
    const servicosSelecionados = document.querySelectorAll('#editarComboForm .combo-service:checked');
    let tempoTotal = 0;
    let precoTotal = 0;
    
    servicosSelecionados.forEach(checkbox => {
        tempoTotal += parseInt(checkbox.dataset.duracao);
        precoTotal += parseFloat(checkbox.dataset.preco);
    });
    
    // Aplicar desconto
    const descontoInput = document.getElementById('editarComboDesconto');
    const desconto = descontoInput ? parseFloat(descontoInput.value) / 100 : 0;
    const precoFinal = precoTotal * (1 - desconto);
    
    // Atualizar valores na interface
    const tempoTotalElement = document.getElementById('editarComboTempoTotal');
    const precoIndividualElement = document.getElementById('editarComboPrecoIndividual');
    const precoFinalElement = document.getElementById('editarComboPrecoFinal');
    
    if (tempoTotalElement) tempoTotalElement.value = `${tempoTotal} min`;
    if (precoIndividualElement) precoIndividualElement.value = `R$ ${precoTotal.toFixed(2)}`;
    if (precoFinalElement) precoFinalElement.textContent = `R$ ${precoFinal.toFixed(2)}`;
}