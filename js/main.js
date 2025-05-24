// Helper functions
const API_URL = 'http://localhost:5000/api';

// Loading Animation
document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);

    // Hide loading overlay after 1.5 seconds
    setTimeout(function() {
        loadingOverlay.style.opacity = '0';
        setTimeout(function() {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Toggle dark mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
    
    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(event.target) && event.target !== mobileToggle) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // Smooth scroll para links da landing page
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!' && document.querySelector(href)) {
                e.preventDefault();
                const targetEl = document.querySelector(href);
                
                window.scrollTo({
                    top: targetEl.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Fechar navbar mobile após clique
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                if (navbarToggler && !navbarToggler.classList.contains('collapsed') && navbarCollapse) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Formulário de contato da landing page
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Enviando...';
            submitBtn.disabled = true;
            
            // Coleta os dados do formulário
            const formData = new FormData(this);
            const formObj = {
                nome: formData.get('name'),
                email: formData.get('email'),
                assunto: formData.get('subject'),
                mensagem: formData.get('message')
            };
            
            try {
                // Simular envio (em produção faria uma chamada API real)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Mostrar mensagem de sucesso
                showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Limpar formulário
                this.reset();
            } catch (error) {
                showMessage('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
                console.error('Erro ao enviar formulário:', error);
            } finally {
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Formulário newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (!emailInput || !emailInput.value) {
                showMessage('Por favor, informe seu e-mail', 'error');
                return;
            }
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
            submitBtn.disabled = true;
            
            try {
                // Simular envio (em produção faria uma chamada API real)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Mostrar mensagem de sucesso
                showMessage('Inscrição realizada com sucesso!', 'success');
                
                // Limpar formulário
                this.reset();
            } catch (error) {
                showMessage('Erro ao realizar inscrição. Por favor, tente novamente.', 'error');
                console.error('Erro ao enviar formulário de newsletter:', error);
            } finally {
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Inicializar tooltips do Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }
    
    // Animar elementos na landing page conforme scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .resource-content, .resource-image');
        
        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Inicializar animações se estiver na landing page
    if (document.querySelector('.hero-content')) {
        animateOnScroll();
    }
});

// Função para mostrar uma mensagem toast
function showMessage(message, type = 'success') {
    // Verificar se já existe um container de toast
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed p-3 bottom-0 end-0';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toastEl.id = toastId;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastEl);
    
    const toast = new bootstrap.Toast(toastEl, {
        delay: 5000,
        autohide: true
    });
    
    toast.show();
    
    // Remove o toast do DOM quando ele for escondido
    toastEl.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}

// Função para fazer uma requisição à API com autorização
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, mergedOptions);
        
        if (!response.ok) {
            // Se o token é inválido (não autorizado), fazer logout
            if (response.status === 401) {
                if (typeof logout === 'function') {
                    logout();
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    window.location.href = 'index.html';
                }
                throw new Error('Sessão expirada. Por favor, faça login novamente.');
            }
            
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na requisição à API:', error);
        throw error;
    }
}