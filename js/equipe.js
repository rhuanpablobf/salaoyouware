// Verificação do token de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        // Se não estiver logado, redireciona para o login
        window.location.href = 'index.html';
        return;
    }
    
    // Eventos para o formulário de novo profissional
    const fotoInput = document.getElementById('fotoInput');
    const previewFoto = document.getElementById('previewFoto');
    
    if (fotoInput && previewFoto) {
        fotoInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewFoto.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Eventos para o formulário de edição de profissional
    const editFotoInput = document.getElementById('editFotoInput');
    
    if (editFotoInput) {
        editFotoInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const parentDiv = editFotoInput.closest('div');
                    if (parentDiv) {
                        parentDiv.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                        <input type="file" id="editFotoInput" class="d-none" accept="image/*">
                        <label for="editFotoInput" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 30px; height: 30px; cursor: pointer;">
                            <i class="bi bi-camera"></i>
                        </label>`;
                        
                        // Readiciona o evento após substituir o HTML
                        document.getElementById('editFotoInput').addEventListener('change', editFotoInput.onchange);
                    }
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Funcionalidade de copiar horários para dias úteis
    const copiarHorariosBtn = document.getElementById('copiarHorarios');
    
    if (copiarHorariosBtn) {
        copiarHorariosBtn.addEventListener('click', function() {
            // Aqui seria implementada a lógica para copiar os horários
            // da segunda-feira para os outros dias úteis
            
            // Para o exemplo, apenas mostramos uma mensagem
            alert('Horários copiados para os dias úteis (terça a sexta)');
        });
    }
    
    // Gerenciar eventos para adicionar intervalos de horário
    const adicionarIntervaloBtn = document.getElementById('adicionarIntervaloSegunda');
    
    if (adicionarIntervaloBtn) {
        adicionarIntervaloBtn.addEventListener('click', function() {
            const horariosContainer = document.querySelector('.horarios-container');
            
            if (horariosContainer) {
                // Cria um novo elemento de horário
                const novoHorario = document.createElement('div');
                novoHorario.className = 'horario-item mb-3 p-3 border rounded';
                novoHorario.innerHTML = `
                    <div class="d-flex justify-content-between mb-2">
                        <h6>Horário de Trabalho</h6>
                        <button class="btn btn-sm btn-link text-danger p-0 remover-horario"><i class="bi bi-trash"></i></button>
                    </div>
                    <div class="row g-2">
                        <div class="col-md-5">
                            <label class="form-label small">Início</label>
                            <input type="time" class="form-control" value="09:00">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label small">Fim</label>
                            <input type="time" class="form-control" value="10:00">
                        </div>
                        <div class="col-md-2 d-flex align-items-end">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox">
                                <label class="form-check-label small">Pausa</label>
                            </div>
                        </div>
                    </div>
                `;
                
                horariosContainer.appendChild(novoHorario);
                
                // Adiciona evento para remover o horário
                const removerBtn = novoHorario.querySelector('.remover-horario');
                if (removerBtn) {
                    removerBtn.addEventListener('click', function() {
                        novoHorario.remove();
                    });
                }
            }
        });
    }
    
    // Adiciona eventos para remover horários existentes
    document.querySelectorAll('.horario-item .btn-link.text-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const horarioItem = this.closest('.horario-item');
            if (horarioItem && confirm('Tem certeza que deseja remover este horário?')) {
                horarioItem.remove();
            }
        });
    });
    
    // Toggle para verificar/desmarcar todos os serviços
    const checkAll = document.getElementById('checkAll');
    
    if (checkAll) {
        checkAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox !== checkAll) {
                    checkbox.checked = checkAll.checked;
                }
            });
        });
    }
    
    // Formulário de profissional
    const profissionalForm = document.getElementById('profissionalForm');
    
    if (profissionalForm) {
        profissionalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Em um cenário real, aqui seriam enviados os dados para o backend
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Profissional salvo com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoProfissionalModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar e Continuar';
                submitBtn.disabled = false;
                
                // Em um cenário real, recarregaríamos a lista de profissionais
            }, 1500);
        });
    }
    
    // Formulário de edição de profissional
    const editarProfissionalForm = document.getElementById('editarProfissionalForm');
    
    if (editarProfissionalForm) {
        editarProfissionalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Em um cenário real, aqui seriam enviados os dados para o backend
            
            // Simulando salvamento
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Salvando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Alterações salvas com sucesso!');
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editarProfissionalModal'));
                if (modal) modal.hide();
                
                // Restaurar o botão
                submitBtn.innerHTML = 'Salvar Alterações';
                submitBtn.disabled = false;
                
                // Em um cenário real, atualizaríamos as informações do profissional na tela
            }, 1500);
        });
    }
});