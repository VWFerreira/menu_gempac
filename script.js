// ========== CONFIGURAÇÃO E DADOS ==========

// Dados dos polos e contratos
const polosData = {
    "POLO RS": {
        "Contratos RS": {
            "Banrisul User 1": {
                url: "https://www.appsheet.com/start/c0fe2be5-d3b4-47cc-9a7d-445bb2f882ce",
                icon: "img/menugen.png",
            },
            "Banrisul User 2": {
                url: "https://www.appsheet.com/start/0301816b-0516-481f-bccb-19b31720175a",
                icon: "img/menugen.png",
            },
            Serpro: {
                url: "",
                icon: "img/menugen.png",
            },
            Inmetro: {
                url: "",
                icon: "img/menugen.png",
            },
            "Sec. Obras Públicas": {
                url: "https://www.appsheet.com/start/dadd8a36-177c-437b-9648-5f6ab6428b19",
                icon: "img/menueng.png",
            },
            "Smed Leste": {
                url: "https://www.appsheet.com/start/eb779b55-6ced-4a8e-b3c6-2caa271fc106",
                icon: "img/menueng.png",
            },
            "Smed Norte": {
                url: "https://www.appsheet.com/start/5be3b962-b0aa-4b42-b533-7573e7eb3da6",
                icon: "img/menugen.png",
            },
            "Banrisul Centro": {
                url: "https://www.appsheet.com/start/3e45dd23-b19e-49cb-9713-8cc856b1efaf",
                icon: "img/menugen.png",
            },
        },
    },
    "POLO RN NT": {
        Contratos: {
            "Menu App": {
                url: "https://www.appsheet.com/start/c4dbab31-a8e5-4762-ae9d-d36539332035",
                icon: "img/menueng.png",
            },
            "Formulário Feedback": {
                url: "https://formulario-feedback.onrender.com/",
                icon: "img/form.png",
                protected: true,
                password: "CONTRATOS2025",
            },
        },
    },
    "POLO DF": {},
    "POLO CG": {},
    "POLO GO": {},
    "POLO RN MO": {},
    "POLO RN MA": {},
    "POLO RN PF": {},
    "POLO MG BH": {},
    "POLO RS VERA": {},
    "POLO RS PE": {},
    "POLO RN AB": {},
    "POLO RN NC": {},
    "POLO PR": {
        "Contratos PR": {
            FUNDEPAR: {
                url: "https://www.appsheet.com/start/5be3b962-b0aa-4b42-b533-7573e7eb3da6",
                icon: "img/menueng.png",
            },
        },
    },
    "POLO REC": {},
};

// ========== CLASSE PRINCIPAL DA APLICAÇÃO ==========
class GenpacApp {
    constructor() {
        this.polos = polosData;
        this.currentPolo = null;
        this.currentSubpagina = null;
        this.elements = {};
        this.isLoading = false;

        this.init();
    }

    // Inicialização da aplicação
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializePoloSelect();
        this.initializeAnimations();
        this.setupVideoLazyLoading();

        // Log para debug (remover em produção)
        console.log("🚀 GENPAC App inicializada com sucesso!");
    }

    // Cache dos elementos DOM
    cacheElements() {
        this.elements = {
            poloSelect: document.getElementById("polo"),
            subpaginasContainer: document.getElementById("subpaginasContainer"),
            subpaginasDiv: document.getElementById("subpaginas"),
            contratosDiv: document.getElementById("contratos"),
            sidebar: document.getElementById("sidebar"),
            backgroundVideo: document.getElementById("background-video"),
            videoSections: document.querySelectorAll(".video-section"),
            videoCards: document.querySelectorAll(".video-card"),
        };

        // Verificar se elementos essenciais existem
        if (!this.elements.poloSelect) {
            console.error("❌ Elemento #polo não encontrado!");
            return;
        }
    }

    // Vincular eventos
    bindEvents() {
        // Evento de mudança do select de polo
        if (this.elements.poloSelect) {
            this.elements.poloSelect.addEventListener("change", () => {
                this.handlePoloChange();
            });
        }

        // Eventos de teclado para acessibilidade
        document.addEventListener("keydown", (e) => {
            this.handleKeyboard(e);
        });

        // Evento de redimensionamento da janela
        window.addEventListener(
            "resize",
            this.debounce(() => {
                this.handleResize();
            }, 250)
        );

        // Evento de scroll para lazy loading
        window.addEventListener(
            "scroll",
            this.throttle(() => {
                this.handleScroll();
            }, 100)
        );

        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 1024) {
                if (
                    !this.elements.sidebar.contains(e.target) &&
                    !e.target.classList.contains("sidebar-toggle")
                ) {
                    this.closeSidebar();
                }
            }
        });
    }

    // Inicializar select de polos
    initializePoloSelect() {
        if (!this.elements.poloSelect) return;

        const defaultOption = this.createElement("option", {
            value: "",
            textContent: "Escolha um polo...",
            disabled: true,
            selected: true,
        });

        this.elements.poloSelect.innerHTML = "";
        this.elements.poloSelect.appendChild(defaultOption);

        // Adicionar opções de polos
        Object.keys(this.polos).forEach((polo) => {
            const option = this.createElement("option", {
                value: polo,
                textContent: polo,
            });
            this.elements.poloSelect.appendChild(option);
        });

        // Adicionar animação ao carregar
        this.elements.poloSelect.classList.add("fade-in-left");
    }

    // Manipular mudança de polo
    handlePoloChange() {
        const selectedPolo = this.elements.poloSelect.value;
        this.currentPolo = selectedPolo;

        if (!selectedPolo || !this.polos[selectedPolo]) {
            this.hideSubpaginas();
            this.clearContratos();
            return;
        }

        const subpaginas = this.polos[selectedPolo];
        this.updateSubpaginas(subpaginas);
    }

    // Atualizar subpáginas
    updateSubpaginas(subpaginas) {
        if (!this.elements.subpaginasDiv || !this.elements.subpaginasContainer)
            return;

        // Limpar conteúdo anterior
        this.clearSubpaginas();
        this.clearContratos();

        const hasSubpaginas = Object.keys(subpaginas).length > 0;

        if (!hasSubpaginas) {
            this.hideSubpaginas();
            return;
        }

        this.showSubpaginas();

        // Criar botões de subpáginas com animação
        Object.keys(subpaginas).forEach((nome, index) => {
            const button = this.createElement("button", {
                className: "subpagina-btn",
                textContent: nome,
                type: "button",
            });

            button.setAttribute("aria-label", `Abrir contratos de ${nome}`);

            // Adicionar evento de clique
            button.addEventListener("click", () => {
                this.handleSubpaginaClick(nome, subpaginas[nome], button);
            });

            // Adicionar botão imediatamente e depois aplicar animação
            this.elements.subpaginasDiv.appendChild(button);

            // Animação escalonada
            setTimeout(() => {
                button.classList.add("fade-in-up");
            }, index * 100);
        });
    }

    // Manipular clique em subpágina
    handleSubpaginaClick(nome, contratos, buttonElement) {
        // Remover estado ativo de outros botões
        document.querySelectorAll(".subpagina-btn").forEach((btn) => {
            btn.classList.remove("active");
        });

        // Adicionar estado ativo ao botão clicado
        buttonElement.classList.add("active");

        this.currentSubpagina = nome;
        this.showContratos(contratos);
    }

    // Exibir contratos
    showContratos(contratos) {
        if (!this.elements.contratosDiv) return;

        this.setLoading(true);

        // Simular carregamento
        setTimeout(() => {
            this.renderContratos(contratos);
            this.setLoading(false);
        }, 600);
    }

    // Renderizar contratos
    renderContratos(contratos) {
        // Limpar conteúdo anterior
        this.elements.contratosDiv.innerHTML = "";

        const header = this.createElement("h3", {
            innerHTML: '<i class="bi bi-file-earmark-text"></i> Contratos',
        });

        this.elements.contratosDiv.appendChild(header);

        // Criar links de contratos
        Object.entries(contratos).forEach(([nome, dados], index) => {
            const link = this.createContratoLink(nome, dados);

            // Animação escalonada
            setTimeout(() => {
                link.classList.add("fade-in-left");
                this.elements.contratosDiv.appendChild(link);
            }, index * 100);
        });
    }

    // Criar link de contrato
    createContratoLink(nome, dados) {
        const {
            url = "#",
            icon = "img/default.png",
            protected: isProtected = false,
        } = dados;

        const link = this.createElement("a", {
            href: "#",
            className: "contrato-link",
            innerHTML: `
                <img src="${icon}" 
                     width="24" 
                     height="24" 
                     alt="Ícone ${nome}"
                     class="contrato-icon"
                     onerror="this.src='img/default.png'">
                <span>${nome}</span>
                ${isProtected ? '<i class="bi bi-lock ms-auto"></i>' : ""}
            `,
        });

        link.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleContratoClick(nome, dados);
        });

        return link;
    }

    // Manipular clique em contrato
    handleContratoClick(nome, dados) {
        const { url, protected: isProtected, password } = dados;

        if (isProtected) {
            this.handleProtectedAccess(nome, url, password);
        } else {
            this.openUrl(url, nome);
        }
    }

    // Manipular acesso protegido
    handleProtectedAccess(nome, url, correctPassword) {
        const userPassword = prompt(
            `🔐 Digite o código de acesso para "${nome}":`
        );

        if (userPassword === correctPassword) {
            this.showSuccessMessage("✅ Acesso autorizado!");
            this.openUrl(url, nome);
        } else if (userPassword !== null) {
            this.showErrorMessage("❌ Código incorreto. Acesso negado.");
        }
    }

    // Abrir URL
    openUrl(url, nome) {
        if (!url || url === "#") {
            this.showWarningMessage(`⚠️ Link não disponível para "${nome}"`);
            return;
        }

        try {
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error("Erro ao abrir URL:", error);
            this.showErrorMessage("❌ Erro ao abrir o link.");
        }
    }

    // ========== FUNÇÕES UTILITÁRIAS ==========

    // Criar elemento DOM
    createElement(tag, options = {}) {
        const element = document.createElement(tag);

        Object.entries(options).forEach(([key, value]) => {
            if (key === "className") {
                element.className = value;
            } else if (key === "innerHTML") {
                element.innerHTML = value;
            } else if (key === "textContent") {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        return element;
    }

    // Debounce para performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle para performance
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // ========== GERENCIAMENTO DE ESTADO ==========

    // Definir estado de carregamento
    setLoading(isLoading) {
        this.isLoading = isLoading;

        if (isLoading) {
            this.elements.contratosDiv.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Carregando contratos...</p>
                </div>
            `;
        }
    }

    // Limpar subpáginas
    clearSubpaginas() {
        if (this.elements.subpaginasDiv) {
            this.elements.subpaginasDiv.innerHTML = "";
        }
    }

    // Limpar contratos
    clearContratos() {
        if (this.elements.contratosDiv) {
            this.elements.contratosDiv.innerHTML = "";
        }
    }

    // Mostrar subpáginas
    showSubpaginas() {
        if (this.elements.subpaginasContainer) {
            this.elements.subpaginasContainer.style.display = "block";
        }
    }

    // Esconder subpáginas
    hideSubpaginas() {
        if (this.elements.subpaginasContainer) {
            this.elements.subpaginasContainer.style.display = "none";
        }
    }

    // ========== FUNCIONALIDADES ADICIONAIS ==========

    // Manipular eventos de teclado
    handleKeyboard(e) {
        // ESC para fechar sidebar (mobile)
        if (e.key === "Escape" && window.innerWidth <= 1024) {
            this.closeSidebar();
        }

        // Enter para confirmar seleções
        if (e.key === "Enter" && e.target.classList.contains("subpagina-btn")) {
            e.target.click();
        }
    }

    // Manipular redimensionamento
    handleResize() {
        // Fechar sidebar automaticamente em telas grandes
        if (window.innerWidth > 1024) {
            this.elements.sidebar.classList.remove("show");
        }
    }

    // Manipular scroll
    handleScroll() {
        // Implementar lazy loading ou outros efeitos baseados em scroll
        this.updateVideoLazyLoading();
    }

    // Inicializar animações
    initializeAnimations() {
        // Observador de interseção para animações
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("fade-in-up");
                        }
                    });
                },
                { threshold: 0.1 }
            );

            this.elements.videoSections.forEach((section) => {
                observer.observe(section);
            });
        }
    }

    // Configurar lazy loading de vídeos
    setupVideoLazyLoading() {
        if ("IntersectionObserver" in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const iframe = entry.target.querySelector("iframe");
                        if (iframe && !iframe.src) {
                            iframe.src = iframe.dataset.src;
                        }
                    }
                });
            });

            this.elements.videoCards.forEach((card) => {
                videoObserver.observe(card);
            });
        }
    }

    // Atualizar lazy loading de vídeos
    updateVideoLazyLoading() {
        // Implementar lógica adicional se necessário
    }

    // ========== FEEDBACK VISUAL ==========

    // Mostrar mensagem de sucesso
    showSuccessMessage(message) {
        this.showToast(message, "success");
    }

    // Mostrar mensagem de erro
    showErrorMessage(message) {
        this.showToast(message, "error");
    }

    // Mostrar mensagem de aviso
    showWarningMessage(message) {
        this.showToast(message, "warning");
    }

    // Sistema simples de toast
    showToast(message, type = "info") {
        const toast = this.createElement("div", {
            className: `toast toast-${type}`,
            innerHTML: message,
        });

        // Estilos inline básicos
        Object.assign(toast.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "500",
            zIndex: "9999",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor:
                type === "success"
                    ? "#10b981"
                    : type === "error"
                    ? "#ef4444"
                    : type === "warning"
                    ? "#f59e0b"
                    : "#3b82f6",
            animation: "slideInRight 0.3s ease",
        });

        document.body.appendChild(toast);

        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = "slideOutRight 0.3s ease";
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// ========== FUNÇÕES GLOBAIS ==========

// Toggle da sidebar (chamada pelo HTML)
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.toggle("show");
    }
}

// Fechar sidebar
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.classList.remove("show");
    }
}

// Função legacy para manter compatibilidade
function updateSubpaginas() {
    if (window.genpacApp) {
        window.genpacApp.handlePoloChange();
    }
}

// ========== INICIALIZAÇÃO ==========

// Aguardar DOM carregar
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar aplicação
    window.genpacApp = new GenpacApp();

    // Adicionar estilos CSS dinâmicos para animações
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .loading-state {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary, #64748b);
        }
        
        .loading-state p {
            margin-top: 1rem;
            font-size: 0.875rem;
        }
        
        .subpagina-btn.active {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
    `;
    document.head.appendChild(style);
});

// Service Worker para cache (opcional)
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("✅ SW registrado:", registration);
            })
            .catch((error) => {
                console.log("❌ SW falhou:", error);
            });
    });
}
