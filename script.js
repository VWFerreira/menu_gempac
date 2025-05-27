// ---------- Dados ----------
const polos = {
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

            Serpro: { url: "", icon: "img/menugen.png" },
            Inmetro: { url: "", icon: "img/menugen.png" },

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
                url: "https://www.appsheet.com/start/3222c768-03d7-4100-ad23-437e3706a8d5",
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

// ---------- Seletores ----------
const poloSelect = document.getElementById("polo");
const subpaginasDiv = document.getElementById("subpaginas");
const subpaginasContainer = document.getElementById("subpaginasContainer");
const contratosDiv = document.getElementById("contratos");

// ---------- Utilitário ----------
const createElement = (tag, options = {}) => {
    const el = document.createElement(tag);
    Object.entries(options).forEach(([key, value]) => {
        if (key === "class") el.className = value;
        else if (key === "html") el.innerHTML = value;
        else el.setAttribute(key, value);
    });
    return el;
};

// ---------- Inicializa select ----------
const initPoloSelect = () => {
    poloSelect.innerHTML =
        '<option value="" disabled selected>-- Selecione --</option>';
    Object.keys(polos).forEach((polo) => {
        poloSelect.appendChild(
            createElement("option", { value: polo, html: polo })
        );
    });
};

/// ---------- Atualiza subpáginas ----------
const updateSubpaginas = () => {
    const selectedPolo = poloSelect.value;
    const subpaginas = polos[selectedPolo] || {};

    subpaginasDiv.innerHTML = "";
    contratosDiv.innerHTML = "";
    subpaginasContainer.style.display =
        Object.keys(subpaginas).length > 0 ? "block" : "none";

    Object.keys(subpaginas).forEach((nome) => {
        const btn = createElement("button", {
            class: "subpagina-btn",
            html: nome,
            type: "button",
            "aria-label": `Abrir contratos de ${nome}`,
        });
        btn.onclick = () => showContratos(subpaginas[nome]);
        subpaginasDiv.appendChild(btn);
    });
};

// ---------- Exibe contratos ----------
const showContratos = (contratos) => {
    contratosDiv.innerHTML = `
    <div class="spinner-border text-primary mb-3" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
    `;
    setTimeout(() => {
        contratosDiv.innerHTML = `<h3 class="h6 mb-3">Contratos:</h3>`;
        Object.entries(contratos).forEach(([nome, { url, icon }]) => {
            const link = createElement("a", {
                href: "#",
                class: "d-flex align-items-center gap-2 mb-2 text-decoration-none",
                html: `
                  <img src="${icon || "img/default.png"}" width="20" height="20" alt="">
                  <span>${nome}</span>
                `,
            });

            link.addEventListener("click", (e) => {
                e.preventDefault();
                if (nome === "Formulário Feedback") {
                    const codigo = prompt("Digite o código de acesso:");
                    if (codigo === "CONTRATOS2025") {
                        window.open(url, "_blank");
                    } else {
                        alert("Código incorreto. Acesso negado.");
                    }
                } else {
                    window.open(url || "#", "_blank");
                }
            });

            contratosDiv.appendChild(link);
        });
    }, 400);
};


// ---------- Inicialização ----------
document.addEventListener("DOMContentLoaded", () => {
    initPoloSelect();
    // applySavedDarkMode(); ← remova essa linha se não usa tema escuro
});


