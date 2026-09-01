// ================= SOCIAL PROOF NOTIFICATIONS (AUTONOMOUS ENGINE) =================
(function initSocialProof() {
  if (window.__socialProofInitialized) return;
  window.__socialProofInitialized = true;

  const namesPool = [
    "Juliana Costa", "Lucas Silveira", "Amanda Souza", "Carlos Eduardo",
    "Fernanda Lima", "Marcos Oliveira", "Rafael Santos", "Camila Pereira",
    "Pedro Henrique", "Larissa Ferreira", "Rodrigo Alves", "Beatriz Rocha",
    "Gabriel Ramos", "Patrícia Ribeiro", "Felipe Martins", "Mariana Castro",
    "Thiago Cardoso", "Aline Barbosa", "Bruno Carvalho", "Letícia Mendes",
    "Gustavo Nunes", "Vanessa Moreira", "Leonardo Freitas", "Tatiane Duarte",
    "Matheus Farias", "Jéssica Santana", "Diego Guimarães", "Renata Nogueira",
    "Vinícius Moraes", "Carla Vasconcelos", "André Rezende", "Priscila Monteiro",
    "Caio Barreto", "Natália Medeiros", "Eduardo Brandão", "Sabrina Pires",
    "Marcelo Antunes", "Bruna Caldeira", "Danilo Peixoto", "Luana Siqueira",
    "Henrique Fontes", "Débora Viana", "Alexandre Neves", "Kelly Albuquerque",
    "Igor Figueiredo", "Talita Queiroz", "Vitor Meireles", "Monique Tavares",
    "Renan Pinheiro", "Fabiana Prado", "Leandro Teles", "Paula Bastos"
  ];

  const brazilianCitiesPool = [
    "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR",
    "Porto Alegre, RS", "Canoas, RS", "Salvador, BA", "Fortaleza, CE",
    "Brasília, DF", "Campinas, SP", "Goiânia, GO", "Recife, PE",
    "Florianópolis, SC", "Santos, SP", "Ribeirão Preto, SP", "Joinville, SC",
    "Caxias do Sul, RS", "Londrina, PR", "São José dos Campos, SP", "Vitória, ES",
    "Campo Grande, MS", "Cuiabá, MT", "Natal, RN", "João Pessoa, PB",
    "Maceió, AL", "São Luís, MA", "Teresina, PI", "Aracaju, SE",
    "Manaus, AM", "Belém, PA", "Sorocaba, SP", "Uberlândia, MG",
    "Juiz de Fora, MG", "Blumenau, SC", "Maringá, PR", "Ponta Grossa, PR",
    "Pelotas, RS", "Santa Maria, RS", "Novo Hamburgo, RS", "Gravataí, RS",
    "São Bernardo do Campo, SP", "Santo André, SP", "Osasco, SP", "Niterói, RJ",
    "Nova Iguaçu, RJ", "São Gonçalo, RJ", "Feira de Santana, BA", "Anápolis, GO",
    "Vila Velha, ES", "Serra, ES", "Betim, MG", "Contagem, MG"
  ];

  // Non-repeating randomized queues (Fisher-Yates shuffle)
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let remainingNames = shuffle(namesPool);
  let remainingCities = shuffle(brazilianCitiesPool);

  function getNextName() {
    if (remainingNames.length === 0) {
      remainingNames = shuffle(namesPool);
    }
    return remainingNames.pop();
  }

  function getNextCity() {
    if (remainingCities.length === 0) {
      remainingCities = shuffle(brazilianCitiesPool);
    }
    return remainingCities.pop();
  }

  let detectedLocation = (typeof window !== "undefined" && window.__GEO_LOCATION) || localStorage.getItem("geo_location") || sessionStorage.getItem("geo_location") || "";
  let notificationCount = 0;
  let locationReady = Boolean(detectedLocation);

  window.addEventListener("geo_city_ready", (e) => {
    if (e && e.detail) {
      detectedLocation = e.detail.location || e.detail.city || "";
      locationReady = Boolean(detectedLocation);
    }
  });

  // Real IP Geolocation retrieval with fallbacks
  function fetchLocation() {
    if (detectedLocation) return;
    fetch("https://ipwho.is/")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.city) {
          const loc = d.region_code ? (d.city + ", " + d.region_code) : (d.region ? (d.city + ", " + d.region) : d.city);
          localStorage.setItem("geo_city", d.city);
          sessionStorage.setItem("geo_city", d.city);
          localStorage.setItem("geo_location", loc);
          sessionStorage.setItem("geo_location", loc);
          detectedLocation = loc;
          locationReady = true;
        } else throw new Error();
      })
      .catch(() => {
        fetch("https://get.geojs.io/v1/ip/geo.json")
          .then(r => r.json())
          .then(d => {
            if (d.city) {
              const loc = d.region ? (d.city + ", " + d.region.substring(0, 2).toUpperCase()) : d.city;
              localStorage.setItem("geo_city", d.city);
              sessionStorage.setItem("geo_city", d.city);
              localStorage.setItem("geo_location", loc);
              sessionStorage.setItem("geo_location", loc);
              detectedLocation = loc;
              locationReady = true;
            } else {
              throw new Error();
            }
          })
          .catch(() => {
            locationReady = true;
          });
      });
  }

  // Instant or idle lookup
  if (!detectedLocation) {
    fetchLocation();
  }

  // Create Popup Toast in DOM
  const container = document.createElement("div");
  container.id = "cnh-social-proof-toast";
  container.style.cssText = [
    "position: fixed",
    "bottom: max(18px, env(safe-area-inset-bottom, 18px))",
    "left: max(14px, env(safe-area-inset-left, 14px))",
    "z-index: 99999",
    "background: #ffffff",
    "border: 1px solid rgba(7, 27, 53, 0.08)",
    "border-radius: 14px",
    "padding: 8px 14px 8px 10px",
    "display: flex",
    "align-items: center",
    "gap: 10px",
    "box-shadow: 0 8px 24px rgba(7, 27, 53, 0.14)",
    "max-width: min(290px, calc(100vw - 28px))",
    "width: auto",
    "font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    "user-select: none",
    "pointer-events: none",
    "transform: translate3d(0, 20px, 0) scale(0.96)",
    "opacity: 0",
    "will-change: transform, opacity",
    "-webkit-backface-visibility: hidden",
    "backface-visibility: hidden",
    "transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
    "box-sizing: border-box"
  ].join(";");

  container.innerHTML = `
    <div style="position: relative; flex-shrink: 0; width: 34px; height: 34px;">
      <div style="width: 34px; height: 34px; border-radius: 10px; background: #FF5A1F; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(255, 90, 31, 0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 17px; height: 17px;">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
      <div style="position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" style="width: 9px; height: 9px;">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
    </div>
    <div style="min-width: 0; flex: 1;">
      <p style="margin: 0; font-size: 11.5px; line-height: 1.25; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        <strong id="sp-name" style="color: #071B35; font-weight: 700;"></strong> comprou agora
      </p>
      <p id="sp-loc-time" style="margin: 2px 0 0 0; font-size: 10px; color: #6B7280; font-weight: 400; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      </p>
    </div>
    <div style="position: absolute; top: 8px; right: 8px; width: 6px; height: 6px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #10B981; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <span style="position: relative; width: 4.5px; height: 4.5px; border-radius: 50%; background: #10B981;"></span>
    </div>
  `;

  document.body ? document.body.appendChild(container) : document.addEventListener("DOMContentLoaded", () => document.body.appendChild(container));

  function showNotification() {
    const nextNotification = notificationCount + 1;

    // The third notification is reserved for the visitor's actual IP city.
    // Wait briefly instead of showing a random city before the lookup finishes.
    if (nextNotification === 3 && !locationReady) {
      setTimeout(showNotification, 500);
      return;
    }

    notificationCount = nextNotification;
    const name = getNextName();
    const loc = notificationCount === 3
      ? (detectedLocation || sessionStorage.getItem("geo_location") || sessionStorage.getItem("geo_city") || getNextCity())
      : getNextCity();

    const mins = Math.floor(Math.random() * 3) + 1;
    const timeStr = mins === 1 ? "há 1 min" : `há ${mins} min`;

    const nameEl = document.getElementById("sp-name");
    const locEl = document.getElementById("sp-loc-time");
    if (nameEl && locEl) {
      nameEl.textContent = name;
      locEl.textContent = `${loc} · ${timeStr}`;
    }

    container.style.transform = "translate3d(0, 0, 0) scale(1)";
    container.style.opacity = "1";

    // Stay visible for 4.5 seconds
    setTimeout(() => {
      container.style.transform = "translate3d(0, 20px, 0) scale(0.96)";
      container.style.opacity = "0";
      // After hiding, schedule next notification between 6 and 12 seconds (random)
      scheduleNext();
    }, 4500);
  }

  function scheduleNext() {
    // Random delay between 6000ms (6s) and 12000ms (12s)
    const delay = Math.floor(Math.random() * (12000 - 6000 + 1)) + 6000;
    setTimeout(() => {
      showNotification();
    }, delay);
  }

  // Initial trigger after 5 seconds
  setTimeout(() => {
    showNotification();
  }, 5000);
})();

const planSystemItems = [
  "Apostila",
  "Plano de estudo guiado (7 dias)",
  "Plataforma Plano Aprovação CNH",
  "Questões comentadas do DETRAN",
  "Simulado completo da prova",
  "Cronograma semanal pronto",
  "Suporte no WhatsApp",
  "Aula em vídeo explicativa"
];

function createPlanSystemSection() {
  const section = document.createElement("section");
  section.className = "cnh-plan-system-section";
  section.setAttribute("aria-labelledby", "cnh-plan-system-heading");

  section.innerHTML = `
    <style>
      .cnh-plan-system-section {
        background: #FAF7F0 !important;
        background-color: #FAF7F0 !important;
        width: 100% !important;
        padding: 3rem 1rem 2.75rem !important;
        box-sizing: border-box !important;
        display: block !important;
        text-align: center !important;
      }
      .cnh-plan-system-inner {
        max-width: 25.5rem !important;
        margin: 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        box-sizing: border-box !important;
      }
      .cnh-plan-system-intro {
        font-family: 'Plus Jakarta Sans', Inter, -apple-system, sans-serif !important;
        font-size: clamp(1.2rem, 3.8vw, 1.4rem) !important;
        font-weight: 800 !important;
        color: #071B35 !important;
        margin: 0 0 0.65rem 0 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.01em !important;
      }
      .cnh-plan-system-badge {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.4rem !important;
        background: #071B35 !important;
        background-color: #071B35 !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 9999px !important;
        padding: 0.45rem 1.25rem 0.5rem !important;
        box-shadow: 0 6px 18px rgba(7, 27, 53, 0.22) !important;
        margin-bottom: 0.85rem !important;
      }
      .cnh-plan-system-badge-white {
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.15rem, 3.8vw, 1.45rem) !important;
        font-weight: 900 !important;
        color: #ffffff !important;
        letter-spacing: 0.02em !important;
        line-height: 1 !important;
        text-transform: uppercase !important;
      }
      .cnh-plan-system-badge-orange {
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.15rem, 3.8vw, 1.45rem) !important;
        font-weight: 900 !important;
        color: #FF5A1F !important;
        letter-spacing: 0.02em !important;
        line-height: 1 !important;
        text-transform: uppercase !important;
      }
      .cnh-plan-system-sub {
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: clamp(0.88rem, 2.4vw, 0.98rem) !important;
        font-weight: 500 !important;
        color: #5F6673 !important;
        line-height: 1.4 !important;
        margin: 0 0 1.6rem 0 !important;
        max-width: 22rem !important;
      }
      .cnh-plan-system-card {
        background: #071B35 !important;
        background-color: #071B35 !important;
        width: 100% !important;
        border-radius: 1.35rem !important;
        border: 1px solid rgba(255, 255, 255, 0.09) !important;
        box-shadow: 0 16px 36px -6px rgba(7, 27, 53, 0.28), 0 4px 12px rgba(7, 27, 53, 0.08) !important;
        padding: 1.5rem 1.4rem 1.65rem !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }
      .cnh-plan-system-card-header {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
        margin-bottom: 1.35rem !important;
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: 1.05rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.03em !important;
        text-transform: uppercase !important;
      }
      .cnh-plan-system-card-header-icon {
        width: 16px !important;
        height: 16px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1.8px solid #FF5A1F !important;
        border-radius: 3px !important;
        box-sizing: border-box !important;
        position: relative !important;
        flex-shrink: 0 !important;
      }
      .cnh-plan-system-card-header-icon svg {
        width: 10px !important;
        height: 10px !important;
        stroke: #FF5A1F !important;
      }
      .cnh-plan-system-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.9rem !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }
      .cnh-plan-system-item {
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
      }
      .cnh-plan-system-check {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        border-radius: 50% !important;
        background: #FF5A1F !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        box-shadow: 0 2px 6px rgba(255, 90, 31, 0.35) !important;
      }
      .cnh-plan-system-check svg {
        width: 12px !important;
        height: 12px !important;
        stroke: #ffffff !important;
      }
      .cnh-plan-system-item-text {
        color: #ffffff !important;
        font-family: 'Plus Jakarta Sans', Inter, -apple-system, sans-serif !important;
        font-size: clamp(0.85rem, 2.5vw, 0.92rem) !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.01em !important;
      }
      @media (max-width: 640px) {
        .cnh-plan-system-section {
          padding: 2.25rem 0.85rem 1.85rem !important;
        }
        .cnh-plan-system-inner {
          max-width: 22.5rem !important;
        }
        .cnh-plan-system-intro {
          font-size: 1.12rem !important;
          margin-bottom: 0.5rem !important;
        }
        .cnh-plan-system-sub {
          font-size: 0.85rem !important;
          margin-bottom: 1.25rem !important;
        }
        .cnh-plan-system-card {
          padding: 1.25rem 1.15rem 1.4rem !important;
          border-radius: 1.15rem !important;
        }
        .cnh-plan-system-card-header {
          font-size: 0.95rem !important;
          margin-bottom: 1.15rem !important;
        }
        .cnh-plan-system-list {
          gap: 0.75rem !important;
        }
        .cnh-plan-system-check {
          width: 20px !important;
          height: 20px !important;
          min-width: 20px !important;
        }
        .cnh-plan-system-check svg {
          width: 11px !important;
          height: 11px !important;
        }
        .cnh-plan-system-item-text {
          font-size: 0.82rem !important;
        }
      }
    </style>

    <div class="cnh-plan-system-inner">
      <h2 class="cnh-plan-system-intro" id="cnh-plan-system-heading">Foi por isso que criamos o</h2>

      <div class="cnh-plan-system-badge" aria-label="Plano de Aprovação CNH 2026">
        <span class="cnh-plan-system-badge-white">PLANO DE APROVAÇÃO</span>
        <span class="cnh-plan-system-badge-orange">CNH 2026</span>
      </div>

      <p class="cnh-plan-system-sub">
        Um plano simples, direto ao ponto e sem enrolação.
      </p>

      <div class="cnh-plan-system-card">
        <div class="cnh-plan-system-card-header">
          <div class="cnh-plan-system-card-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span>O QUE VOCÊ RECEBE:</span>
        </div>

        <ul class="cnh-plan-system-list">
          ${planSystemItems.map(itemText => `
            <li class="cnh-plan-system-item">
              <div class="cnh-plan-system-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span class="cnh-plan-system-item-text">${itemText}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;

  return section;
}

const materialItems = [
  ["📚", "FOCO NO QUE REALMENTE CAI", "Revise os temas essenciais da prova teórica direto ao ponto, sem perder tempo."],
  ["📅", "CRONOGRAMA DE 7 DIAS", "Organize sua rotina de estudos passo a passo, mesmo com pouco tempo livre."],
  ["🎯", "RESUMOS OBJETIVOS", "Acesse os conceitos-chave de cada matéria em resumos claros e fáceis de memorizar."],
  ["🧠", "QUESTÕES COMENTADAS", "Treine com o padrão real do DETRAN e compreenda a lógica de cada alternativa."],
  ["📝", "SIMULADO NO PADRÃO OFICIAL", "Avalie seu desempenho real e identifique pontos de melhoria antes do exame."],
  ["⏱️", "REVISÃO DA RETA FINAL", "Fixe os temas com maior índice de cobrança na véspera da sua prova."],
  ["✅", "MÉTODO COMPLETO E GUIADO", "Saiba exatamente o que estudar, revisar e praticar até a sua aprovação."],
];

function createMaterialSection() {
  const section = document.createElement("section");
  section.className = "material-section";
  section.setAttribute("aria-labelledby", "material-section-title");
  section.style.cssText = "background: #ffffff !important; background-color: #ffffff !important;";
  section.innerHTML = `
    <div class="material-section__inner">
      <header class="material-section__header">
        <p class="material-section__eyebrow">POR DENTRO DO MATERIAL</p>
        <h2 class="material-section__title" id="material-section-title">
          TUDO O QUE VOCÊ PRECISA PARA CHEGAR<br>
          <strong>MAIS PREPARADO À PROVA</strong>
        </h2>
        <p class="material-section__subtitle">
          Conteúdo organizado para você estudar com direção, revisar o essencial e praticar antes da prova teórica da CNH.
        </p>
      </header>
      <div class="material-section__content">
        <div class="material-section__book-wrap">
          <!-- Imagem final da apostila inserida aqui. -->
          <div class="material-section__placeholder material-section__image-placeholder">
            <img class="material-section__book-image" src="/assets/apostila-cnh-2026.png" alt="Apostila Plano Aprovação CNH 2026" loading="lazy" decoding="async" width="560" height="740">
          </div>
        </div>
        <div class="material-section__items">
          ${materialItems.map(([icon, title, description]) => `
            <article class="material-section__item">
              <span class="material-section__icon" aria-hidden="true">${icon}</span>
              <div>
                <h3 class="material-section__item-title">${title}</h3>
                <p class="material-section__item-description">${description}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="material-section__cta">
        <p class="material-section__cta-copy">
          VOCÊ NÃO PRECISA ESTUDAR TUDO.<br>
          <strong>VOCÊ PRECISA ESTUDAR <em>O QUE REALMENTE CAI.</em></strong>
        </p>
        <button class="material-section__cta-button" type="button">QUERO COMEÇAR AGORA</button>
      </div>
    </div>
  `;
  section.querySelector(".material-section__cta-button").addEventListener("click", (e) => {
    scrollToOffer(e);
  });
  return section;
}

function createPlatformSection() {
  const section = document.createElement("section");
  section.className = "platform-section";
  section.setAttribute("aria-labelledby", "platform-section-title");
  section.innerHTML = `
    <div class="platform-section__inner">
      <p class="platform-section__eyebrow">
        <span aria-hidden="true">🎓</span>
        BENEFÍCIO ADICIONAL INCLUSO
      </p>
      <h2 class="platform-section__title" id="platform-section-title">
        E NÃO PARA POR AÍ...
      </h2>
      <p class="platform-section__subtitle">
        Além da Apostila, você recebe acesso à
        <strong style="color: #000000 !important; font-weight: 700;">Plataforma Plano Aprovação</strong> sem custo adicional.
      </p>
      <div class="platform-section__explanation">
        <p>
          Enquanto a apostila mostra o caminho, a <strong style="color: #000000 !important; font-weight: 700;">Plataforma Plano Aprovação</strong> acompanha sua evolução diariamente e ajuda você a estudar de forma organizada para conquistar sua aprovação!
        </p>
        <p>
          Você terá acesso a uma experiência completa de estudos, com acompanhamento inteligente, simulados e professores especializados para orientar sua preparação.
        </p>
      </div>
      <div class="platform-section__screenshots" aria-label="Telas da Plataforma Plano Aprovação">
        <figure class="platform-section__screenshot">
          <div class="app-screen-card" style="box-shadow: 0 18px 42px -6px rgba(7, 27, 53, 0.24), 0 8px 20px -3px rgba(7, 27, 53, 0.14), 0 2px 6px rgba(7, 27, 53, 0.06) !important;">
            <img src="/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_22_44_42_1787710108509.png" alt="Planejamento e diagnóstico da Plataforma Plano Aprovação" loading="lazy" decoding="async" class="platform-screenshot-img" width="948" height="1659">
          </div>
          <figcaption>Planejamento e diagnóstico</figcaption>
        </figure>
        <figure class="platform-section__screenshot">
          <div class="app-screen-card" style="box-shadow: 0 18px 42px -6px rgba(7, 27, 53, 0.24), 0 8px 20px -3px rgba(7, 27, 53, 0.14), 0 2px 6px rgba(7, 27, 53, 0.06) !important;">
            <img src="/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_22_41_46_1787710096912.png" alt="Painel inicial da Plataforma Plano Aprovação" loading="lazy" decoding="async" class="platform-screenshot-img" width="934" height="1684">
          </div>
          <figcaption>Painel inicial</figcaption>
        </figure>
        <figure class="platform-section__screenshot">
          <div class="app-screen-card" style="box-shadow: 0 18px 42px -6px rgba(7, 27, 53, 0.24), 0 8px 20px -3px rgba(7, 27, 53, 0.14), 0 2px 6px rgba(7, 27, 53, 0.06) !important;">
            <img src="/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_22_43_24_1787710096914.png" alt="Ferramentas de estudo da Plataforma Plano Aprovação" loading="lazy" decoding="async" class="platform-screenshot-img" width="959" height="1641">
          </div>
          <figcaption>Ferramentas de estudo</figcaption>
        </figure>
      </div>
    </div>
  `;
  return section;
}

function createPlatformFeaturesSection() {
  const section = document.createElement("section");
  section.className = "platform-features-section";
  section.setAttribute("aria-labelledby", "platform-features-title");
  section.style.cssText = "background: #faf7f0 !important; background-color: #faf7f0 !important; border-top: 1px solid rgba(7, 27, 53, 0.06); padding: 2rem 1.25rem 2.75rem !important; width: 100%; box-sizing: border-box; display: block;";

  const cardStyle = "background: #ffffff !important; background-color: #ffffff !important; border: 1px solid rgba(7, 27, 53, 0.07) !important; border-radius: 0.95rem !important; padding: 0.75rem 0.85rem 0.8rem !important; box-shadow: 0 4px 14px -2px rgba(7, 27, 53, 0.06), 0 2px 5px -1px rgba(7, 27, 53, 0.03) !important; text-align: left !important; display: flex !important; flex-direction: column !important; align-items: flex-start !important; justify-content: flex-start !important; box-sizing: border-box !important; min-width: 0 !important;";
  const emojiStyle = "font-size: 1.25rem !important; line-height: 1 !important; margin: 0 0 0.35rem 0 !important; display: block !important; user-select: none !important;";
  const titleStyle = "color: #071b35 !important; font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', 'Outfit', Arial, sans-serif !important; font-size: 0.85rem !important; font-weight: 800 !important; letter-spacing: -0.01em !important; line-height: 1.18 !important; text-transform: uppercase !important; margin: 0 0 0.2rem 0 !important; word-break: break-word !important;";
  const descStyle = "color: #5F6673 !important; font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important; font-size: 0.72rem !important; line-height: 1.34 !important; margin: 0 !important; font-weight: 400 !important;";

  section.innerHTML = `
    <style>
      .platform-features-section {
        background: #faf7f0 !important;
        width: 100% !important;
        padding: 2rem 1.25rem 2.75rem !important;
        box-sizing: border-box !important;
      }
      .platform-features__inner {
        max-width: 38rem !important;
        margin: 0 auto !important;
        padding: 0 !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .platform-features__title {
        margin: 0 0 1.15rem !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.25rem, 3.5vw, 1.75rem) !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.1 !important;
        text-transform: uppercase !important;
      }
      .platform-features__grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 0.75rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .platform-features__card {
        background: #ffffff !important;
        background-color: #ffffff !important;
        border: 1px solid rgba(7, 27, 53, 0.07) !important;
        border-radius: 0.95rem !important;
        padding: 0.75rem 0.85rem 0.8rem !important;
        box-shadow: 0 4px 14px -2px rgba(7, 27, 53, 0.06), 0 2px 5px -1px rgba(7, 27, 53, 0.03) !important;
        text-align: left !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        box-sizing: border-box !important;
        min-width: 0 !important;
      }
      @media (max-width: 640px) {
        .platform-features-section {
          padding: 1.5rem 0.85rem 2rem !important;
        }
        .platform-features__title {
          margin-bottom: 0.9rem !important;
          font-size: 1.25rem !important;
        }
        .platform-features__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 0.6rem !important;
        }
        .platform-features__card {
          padding: 0.65rem 0.65rem 0.7rem !important;
          border-radius: 0.85rem !important;
        }
        .platform-features__emoji {
          font-size: 1.15rem !important;
          margin-bottom: 0.25rem !important;
        }
        .platform-features__card-title {
          font-size: 0.76rem !important;
          line-height: 1.14 !important;
          margin-bottom: 0.15rem !important;
        }
        .platform-features__card-desc {
          font-size: 0.65rem !important;
          line-height: 1.28 !important;
        }
      }
    </style>
    <div class="platform-features__inner" style="max-width: 38rem; margin: 0 auto !important; padding: 0 !important; text-align: center; box-sizing: border-box;">
      <h2 class="platform-features__title" id="platform-features-title" style="margin: 0 0 1.15rem; color: #071b35; font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif; font-size: clamp(1.25rem, 3.5vw, 1.75rem); font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; text-transform: uppercase;">
        O QUE VOCÊ TERÁ NA PLATAFORMA
      </h2>
      <div class="platform-features__grid">
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">🤖</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">PROFESSORES IA</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Orientação personalizada com IA para ajudar você a entender os conteúdos da prova teórica.</p>
        </article>
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">📝</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">SIMULADOS CNH</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Pratique com questões voltadas aos principais conteúdos da prova teórica.</p>
        </article>
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">📚</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">PLANO DE ESTUDOS</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Saiba o que estudar e siga uma preparação organizada passo a passo.</p>
        </article>
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">🎯</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">QUESTÕES DIRECIONADAS</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Pratique os conteúdos que mais precisam da sua atenção.</p>
        </article>
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">📊</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">ACOMPANHE SUA EVOLUÇÃO</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Veja seu progresso, acertos e desempenho durante a preparação.</p>
        </article>
        <article class="platform-features__card" style="${cardStyle}">
          <span class="platform-features__emoji" style="${emojiStyle}" aria-hidden="true">📱</span>
          <h3 class="platform-features__card-title" style="${titleStyle}">ESTUDE ONDE QUISER</h3>
          <p class="platform-features__card-desc" style="${descStyle}">Acesse pelo celular, tablet ou computador.</p>
        </article>
      </div>
    </div>
  `;
  return section;
}

function insertPlatformSection() {
  const videoSection = document.getElementById("depoimento-video");
  if (!videoSection) return;

  if (!document.querySelector(".platform-section")) {
    videoSection.parentElement?.insertBefore(createPlatformSection(), videoSection);
  }

  const platformSec = document.querySelector(".platform-section");
  if (platformSec && !document.querySelector(".platform-features-section")) {
    platformSec.parentElement?.insertBefore(createPlatformFeaturesSection(), platformSec.nextSibling);
  }

  const platformFeaturesSec = document.querySelector(".platform-features-section");
  if (platformFeaturesSec && !document.querySelector(".cnh-motivation-section")) {
    platformFeaturesSec.parentElement?.insertBefore(createMotivationSection(), platformFeaturesSec.nextSibling);
  }

  const motivationSec = document.querySelector(".cnh-motivation-section");
  if (motivationSec && !document.querySelector(".cnh-testimonials-section")) {
    motivationSec.parentElement?.insertBefore(createTestimonialsSection(), motivationSec.nextSibling);
  } else if (!document.querySelector(".cnh-testimonials-section") && videoSection) {
    videoSection.parentElement?.insertBefore(createTestimonialsSection(), videoSection);
  }

  // Insert Bonus Section, Not-Just-A-Book Section, and Main Offer Section directly after video section
  const currentTestimonials = document.querySelector(".cnh-testimonials-section");
  const targetAnchor = videoSection || currentTestimonials;
  if (targetAnchor) {
    if (!document.querySelector(".cnh-bonus-section")) {
      targetAnchor.parentElement?.insertBefore(createBonusSection(), targetAnchor.nextSibling);
    }

    const bonusSec = document.querySelector(".cnh-bonus-section");
    if (bonusSec && !document.querySelector(".cnh-not-just-book-section")) {
      bonusSec.parentElement?.insertBefore(createNotJustABookSection(), bonusSec.nextSibling);
    }

    const notJustBookSec = document.querySelector(".cnh-not-just-book-section") || bonusSec;
    if (notJustBookSec && !document.querySelector(".cnh-main-offer-section")) {
      notJustBookSec.parentElement?.insertBefore(createMainOfferSection(), notJustBookSec.nextSibling);
    }
  }

  // Remove the unwanted "TUDO QUE VOCÊ RECEBE AO ENTRAR" / "O QUE VOCÊ RECEBE" fold
  removeUnwantedRecebeSection();

  // Remove the old React offer section if present to avoid duplication
  const oldReactOffer = [...document.querySelectorAll("section#oferta")].find(
    (sec) => !sec.classList.contains("cnh-main-offer-section")
  );
  if (oldReactOffer) {
    oldReactOffer.remove();
  }

  // Remove the old duplicate plan cards if present
  const oldPlanSection = [...document.querySelectorAll("section")].find((sec) => {
    const text = sec.textContent || "";
    return !sec.classList.contains("cnh-bonus-section") &&
      !sec.classList.contains("cnh-main-offer-section") &&
      !sec.classList.contains("cnh-plan-system-section") &&
      !sec.classList.contains("material-section") &&
      text.includes("Foi por isso que criamos o") &&
      text.includes("PLANO DE APROVAÇÃO CNH 2026");
  });
  if (oldPlanSection) {
    oldPlanSection.remove();
  }
}

function removeUnwantedRecebeSection() {
  document.querySelectorAll("section").forEach((sec) => {
    const text = sec.textContent || "";
    if (
      !sec.classList.contains("cnh-bonus-section") &&
      !sec.classList.contains("cnh-main-offer-section") &&
      !sec.classList.contains("cnh-testimonials-section") &&
      !sec.classList.contains("cnh-plan-system-section") &&
      !sec.classList.contains("material-section") &&
      (
        text.includes("TUDO QUE VOCÊ RECEBE AO ENTRAR") ||
        (text.includes("O QUE VOCÊ RECEBE") && text.includes("Plano de Estudos Direcionado")) ||
        (text.includes("Plano de Estudos Direcionado") && text.includes("Resumos Objetivos") && text.includes("Simulados"))
      )
    ) {
      sec.remove();
    }
  });
}

// ================= 3 EXCLUSIVE BONUSES CONFIGURATION (EASILY EDITABLE) =================
const CNH_BONUS_CONFIG = {
  headerBadge: "COMPRANDO HOJE VOCÊ GANHA",
  titlePart1: "3 BÔNUS",
  titlePart2: "EXCLUSIVOS",
  subtitle: "Liberados gratuitamente junto com o seu Plano de Aprovação CNH 2026.",
  bonuses: [
    {
      id: 1,
      tag: "BÔNUS 1",
      icon: "🎧",
      title: "ACOMPANHAMENTO NO WHATSAPP",
      description: "Suporte e orientações para ajudar você durante toda a sua preparação.",
      referencePrice: "R$ 37,00",
      freePrice: "AGORA GRÁTIS",
      imagePendingLabel: "Bônus 1 — imagem pendente",
      imageUrl: "/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_23_40_40_1787712887482.png"
    },
    {
      id: 2,
      tag: "BÔNUS 2",
      icon: "👥",
      title: "GRUPO VIP DE ALUNOS",
      description: "Comunidade exclusiva para trocar experiências, receber orientações e acompanhar sua preparação.",
      referencePrice: "R$ 37,00",
      freePrice: "AGORA GRÁTIS",
      imagePendingLabel: "Bônus 2 — imagem pendente",
      imageUrl: "/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_23_46_59_1787712893435.png"
    },
    {
      id: 3,
      tag: "BÔNUS 3",
      icon: "📚",
      title: "GUIA DE REVISÃO FINAL",
      description: "Material de apoio para revisar os conteúdos essenciais antes da prova.",
      referencePrice: "R$ 37,00",
      freePrice: "AGORA GRÁTIS",
      imagePendingLabel: "Bônus 3 — imagem pendente",
      imageUrl: "/attached_assets/ChatGPT_Image_25_de_ago._de_2026,_23_52_47_1787712899171.png"
    }
  ],
  totalValue: {
    badge: "VALOR TOTAL DOS BÔNUS",
    referenceTotal: "R$ 111,00",
    freeTotal: "R$ 0,00",
    highlightText: "100% GRÁTIS HOJE",
    footerText: "junto com o Plano Aprovação CNH 2026."
  },
  cta: {
    mainText: "QUERO MEU PLANO + BÔNUS →",
    subText: "ACESSO AO PLANO APROVAÇÃO CNH 2026"
  }
};

// ================= MAIN OFFER CONFIGURATION (EASILY EDITABLE) =================
const CNH_OFFER_CONFIG = {
  titlePart1: "PARE DE TENTAR.",
  titlePart2: "COMECE A PASSAR!",
  productImage: {
    pendingLabel: "IMAGEM DO PRODUTO — PENDENTE",
    imageUrl: "/assets/oferta-combo-postimg.png"
  },
  whatsIncludedTitle: "TUDO O QUE VOCÊ LEVA HOJE",
  items: [
    { title: "Apostila Plano de Aprovação", icon: "📖", tag: "PRINCIPAL", tagType: "pill-primary" },
    { title: "Plataforma Plano Aprovação", icon: "💻", tag: "INCLUSO", tagType: "pill-secondary" },
    { title: "3 Bônus exclusivos", icon: "🎁", tag: "GRÁTIS", tagType: "pill-highlight" },
    { title: "Acompanhamento no WhatsApp", icon: "💬", tag: "✓", tagType: "check" },
    { title: "Grupo VIP de alunos", icon: "👥", tag: "✓", tagType: "check" },
    { title: "Simulados e materiais de preparação", icon: "🎯", tag: "✓", tagType: "check" }
  ],
  pricing: {
    referencePrice: "De: R$ 67,00",
    leadText: "POR APENAS",
    mainPrice: "R$ 27,90",
    termsText: "à vista"
  },
  timer: {
    labelActive: "OFERTA EXPIRA EM",
    labelExpired: "OFERTA EXPIRADA",
    minutes: 10
  },
  cta: {
    mainText: "QUERO SER APROVADO →",
    subText: "GARANTA AGORA SUA APOSTILA"
  },
  whatsappDeliveryText: "Após a compra, você recebe o acesso direto no seu WhatsApp — sem complicação.",
  trustBadges: [
    { type: "lock", label: "Compra 100% segura" },
    { type: "shield", label: "Dados criptografados" },
    { type: "seal", label: "Garantia de 7 dias" }
  ],
  footerNote: "Pagamento processado com SSL 256-bit"
};

function createBonusSection() {
  const section = document.createElement("section");
  section.className = "cnh-bonus-section";
  section.setAttribute("aria-labelledby", "cnh-bonus-title");

  const cardsHtml = CNH_BONUS_CONFIG.bonuses.map((b) => {
    let imageAreaContent = "";
    if (b.imageUrl) {
      imageAreaContent = `<img src="${b.imageUrl}" alt="${b.title}" class="cnh-bonus-card-img" loading="lazy" decoding="async">`;
    } else {
      // Professional compact placeholder matching reference aesthetic
      imageAreaContent = `
        <div class="cnh-bonus-img-placeholder">
          <div class="cnh-bonus-placeholder-badge">
            <span class="cnh-bonus-ph-icon" aria-hidden="true">${b.icon}</span>
          </div>
          <div class="cnh-bonus-placeholder-title">${b.title}</div>
          <div class="cnh-bonus-placeholder-tag">[${b.imagePendingLabel.toUpperCase()}]</div>
          <div class="cnh-bonus-placeholder-note">Plano Aprovação CNH 2026</div>
        </div>
      `;
    }

    return `
      <article class="cnh-bonus-card" data-bonus-id="${b.id}">
        <div class="cnh-bonus-card-top">
          ${imageAreaContent}
          <div class="cnh-bonus-gratis-badge" aria-label="Bônus Gratuito">
            <span>GRÁTIS</span>
          </div>
        </div>

        <div class="cnh-bonus-card-bottom">
          <div class="cnh-bonus-tag-row">
            <span class="cnh-bonus-tag-icon">${b.icon}</span>
            <span class="cnh-bonus-tag-text">${b.tag}</span>
          </div>

          <h3 class="cnh-bonus-card-title">${b.title}</h3>

          <p class="cnh-bonus-card-desc">${b.description}</p>

          <div class="cnh-bonus-divider"></div>

          <div class="cnh-bonus-price-row">
            <div class="cnh-bonus-price-de">
              <span class="cnh-bonus-price-label">DE</span>
              <span class="cnh-bonus-price-old">${b.referencePrice}</span>
            </div>
            <div class="cnh-bonus-price-por">
              <span class="cnh-bonus-price-label">POR</span>
              <span class="cnh-bonus-price-new">${b.freePrice}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  section.innerHTML = `
    <style>
      .cnh-bonus-section {
        background: #051329 !important;
        background-color: #051329 !important;
        background-image: 
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px) !important;
        background-size: 32px 32px !important;
        width: 100% !important;
        padding: 2.75rem 0.85rem 3.25rem !important;
        box-sizing: border-box !important;
        position: relative !important;
        overflow: hidden !important;
        display: block !important;
      }
      .cnh-bonus-inner {
        max-width: 24.5rem !important;
        margin: 0 auto !important;
        padding: 0 !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .cnh-bonus-header-lockup {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.65rem !important;
        margin-bottom: 0.75rem !important;
      }
      @keyframes cnhGiftFloating {
        0%, 100% {
          transform: translateY(0px) rotate(-6deg) scale(1);
          box-shadow: 0 6px 16px rgba(255, 90, 31, 0.45), 0 0 12px rgba(255, 90, 31, 0.25);
        }
        50% {
          transform: translateY(-9px) rotate(-10deg) scale(1.05);
          box-shadow: 0 14px 28px rgba(255, 90, 31, 0.7), 0 0 20px rgba(255, 90, 31, 0.45);
        }
      }
      .cnh-bonus-gift-badge {
        width: 48px !important;
        height: 48px !important;
        background: linear-gradient(135deg, #FF6B35 0%, #FF5A1F 100%) !important;
        border-radius: 14px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 6px 16px rgba(255, 90, 31, 0.45) !important;
        flex-shrink: 0 !important;
        animation: cnhGiftFloating 2.4s ease-in-out infinite !important;
        transform-origin: center center !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      .cnh-bonus-gift-svg {
        width: 25px !important;
        height: 25px !important;
        stroke: #ffffff !important;
      }
      .cnh-bonus-badge-top {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        background: rgba(255, 90, 31, 0.12) !important;
        border: 1.5px solid rgba(255, 90, 31, 0.45) !important;
        border-radius: 9999px !important;
        padding: 0.32rem 0.85rem !important;
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
      }
      .cnh-bonus-badge-sparkle {
        color: #FF5A1F !important;
        font-size: 0.75rem !important;
      }
      .cnh-bonus-title {
        margin: 0 0 0.4rem !important;
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(2rem, 7.5vw, 2.75rem) !important;
        font-weight: 900 !important;
        letter-spacing: -0.01em !important;
        line-height: 1 !important;
        text-transform: uppercase !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 0.05rem !important;
      }
      .cnh-bonus-title-highlight {
        color: #FF5A1F !important;
      }
      .cnh-bonus-subtitle {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.82rem !important;
        font-weight: 500 !important;
        line-height: 1.35 !important;
        margin: 0 auto 1.6rem !important;
        max-width: 22rem !important;
      }
      .cnh-bonus-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.25rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 1.35rem !important;
      }
      .cnh-bonus-card {
        background: #FAF7F0 !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 1.25rem !important;
        overflow: hidden !important;
        box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.45) !important;
        text-align: left !important;
        box-sizing: border-box !important;
        width: 100% !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      }
      .cnh-bonus-card:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 16px 34px -4px rgba(0, 0, 0, 0.55) !important;
      }
      .cnh-bonus-card-top {
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        max-height: none !important;
        aspect-ratio: 3 / 4 !important;
        background: #091c36 !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-bonus-card-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        object-position: center !important;
        display: block !important;
      }
      .cnh-bonus-img-placeholder {
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 1.35rem 1.1rem !important;
        box-sizing: border-box !important;
        background: linear-gradient(180deg, #0d274c 0%, #06152b 100%) !important;
        text-align: center !important;
      }
      .cnh-bonus-placeholder-badge {
        width: 56px !important;
        height: 56px !important;
        border-radius: 50% !important;
        background: rgba(255, 90, 31, 0.15) !important;
        border: 2px solid #FF5A1F !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 0 18px rgba(255, 90, 31, 0.3) !important;
        margin-bottom: 0.75rem !important;
      }
      .cnh-bonus-ph-icon {
        font-size: 1.6rem !important;
        line-height: 1 !important;
      }
      .cnh-bonus-placeholder-title {
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 1.12rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.4rem !important;
        line-height: 1.15 !important;
      }
      .cnh-bonus-placeholder-tag {
        display: inline-block !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px dashed rgba(255, 255, 255, 0.3) !important;
        border-radius: 9999px !important;
        padding: 0.2rem 0.65rem !important;
        color: #FF5A1F !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.64rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        margin-bottom: 0.4rem !important;
      }
      .cnh-bonus-placeholder-note {
        color: #64748b !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.7rem !important;
        font-weight: 600 !important;
      }
      .cnh-bonus-gratis-badge {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        background: #FF5A1F !important;
        border: 1.5px solid #ffffff !important;
        border-radius: 9999px !important;
        padding: 0.22rem 0.68rem !important;
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 900 !important;
        letter-spacing: 0.06em !important;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35) !important;
        z-index: 2 !important;
      }
      .cnh-bonus-card-bottom {
        padding: 0.95rem 1.05rem 0.85rem !important;
        background: #FAF7F0 !important;
        box-sizing: border-box !important;
      }
      .cnh-bonus-tag-row {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        margin-bottom: 0.35rem !important;
      }
      .cnh-bonus-tag-icon {
        font-size: 0.85rem !important;
        line-height: 1 !important;
      }
      .cnh-bonus-tag-text {
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.78rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
      }
      .cnh-bonus-card-title {
        margin: 0 0 0.35rem !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: 1.05rem !important;
        font-weight: 800 !important;
        letter-spacing: -0.01em !important;
        line-height: 1.15 !important;
        text-transform: uppercase !important;
      }
      .cnh-bonus-card-desc {
        margin: 0 0 0.75rem !important;
        color: #475569 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.76rem !important;
        line-height: 1.38 !important;
        font-weight: 500 !important;
      }
      .cnh-bonus-divider {
        border-top: 1px dashed rgba(7, 27, 53, 0.15) !important;
        margin: 0 0 0.65rem !important;
      }
      .cnh-bonus-price-row {
        display: flex !important;
        align-items: flex-end !important;
        justify-content: space-between !important;
      }
      .cnh-bonus-price-de {
        display: flex !important;
        flex-direction: column !important;
      }
      .cnh-bonus-price-por {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
      }
      .cnh-bonus-price-label {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.62rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
        line-height: 1 !important;
        margin-bottom: 0.15rem !important;
      }
      .cnh-bonus-price-old {
        color: #64748b !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.92rem !important;
        font-weight: 700 !important;
        text-decoration: line-through !important;
        line-height: 1 !important;
      }
      .cnh-bonus-price-new {
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 1.08rem !important;
        font-weight: 900 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1 !important;
      }
      .cnh-bonus-total-box {
        position: relative !important;
        background: linear-gradient(135deg, #FF5A1F 0%, #FF4500 100%) !important;
        border-radius: 1.25rem !important;
        padding: 1.15rem 1rem 1.05rem !important;
        box-shadow: 0 12px 30px -4px rgba(255, 90, 31, 0.45) !important;
        text-align: center !important;
        box-sizing: border-box !important;
        width: 100% !important;
        margin-bottom: 0.85rem !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }
      .cnh-bonus-total-sparkle {
        position: absolute !important;
        color: rgba(255, 255, 255, 0.5) !important;
        font-size: 0.95rem !important;
        pointer-events: none !important;
        user-select: none !important;
      }
      .cnh-bonus-total-sparkle-tl { top: 8px; left: 10px; }
      .cnh-bonus-total-sparkle-tr { top: 8px; right: 10px; }
      .cnh-bonus-total-sparkle-br { bottom: 8px; right: 10px; }
      .cnh-bonus-total-pill {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        background: rgba(255, 255, 255, 0.22) !important;
        border: 1px solid rgba(255, 255, 255, 0.35) !important;
        border-radius: 9999px !important;
        padding: 0.22rem 0.75rem !important;
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.68rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.45rem !important;
      }
      .cnh-bonus-total-old {
        color: rgba(255, 255, 255, 0.75) !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.95rem !important;
        font-weight: 800 !important;
        text-decoration: line-through !important;
        line-height: 1 !important;
        margin-bottom: 0.15rem !important;
      }
      .cnh-bonus-total-zero {
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(2.4rem, 8vw, 3.2rem) !important;
        font-weight: 900 !important;
        line-height: 0.95 !important;
        letter-spacing: -0.03em !important;
        margin: 0 0 0.25rem !important;
        text-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
      }
      .cnh-bonus-total-free-label {
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.95rem !important;
        font-weight: 900 !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.25rem !important;
      }
      .cnh-bonus-total-footnote {
        color: rgba(255, 255, 255, 0.92) !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 500 !important;
        margin: 0 !important;
      }
      .cnh-bonus-cta-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        background: #FF5A1F !important;
        border: none !important;
        border-radius: 1rem !important;
        padding: 0.95rem 1.15rem !important;
        color: #ffffff !important;
        text-decoration: none !important;
        cursor: pointer !important;
        box-shadow: 0 8px 20px -3px rgba(255, 90, 31, 0.4) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
        box-sizing: border-box !important;
      }
      .cnh-bonus-cta-btn:hover {
        background: #e04b14 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 25px -3px rgba(255, 90, 31, 0.5) !important;
      }
      .cnh-bonus-cta-btn:active {
        transform: translateY(0) !important;
      }
      .cnh-bonus-cta-main {
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(1.05rem, 3.4vw, 1.22rem) !important;
        font-weight: 900 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1.1 !important;
      }
      .cnh-bonus-cta-sub {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.66rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        opacity: 0.95 !important;
        margin-top: 0.2rem !important;
      }
      @media (max-width: 640px) {
        .cnh-bonus-section {
          padding: 2.25rem 0.75rem 2.75rem !important;
        }
        .cnh-bonus-card-top {
          height: auto !important;
          max-height: none !important;
          aspect-ratio: 3 / 4 !important;
        }
      }
    </style>
    <div class="cnh-bonus-inner">
      <div class="cnh-bonus-header-lockup">
        <div class="cnh-bonus-gift-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" class="cnh-bonus-gift-svg">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5" rx="1.5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
        </div>
        <div class="cnh-bonus-badge-top">
          <span class="cnh-bonus-badge-sparkle" aria-hidden="true">✦</span>
          <span>${CNH_BONUS_CONFIG.headerBadge}</span>
        </div>
      </div>

      <h2 class="cnh-bonus-title" id="cnh-bonus-title">
        <span>${CNH_BONUS_CONFIG.titlePart1}</span>
        <span class="cnh-bonus-title-highlight">${CNH_BONUS_CONFIG.titlePart2}</span>
      </h2>

      <p class="cnh-bonus-subtitle">
        ${CNH_BONUS_CONFIG.subtitle}
      </p>

      <div class="cnh-bonus-list">
        ${cardsHtml}
      </div>

      <div class="cnh-bonus-total-box">
        <span class="cnh-bonus-total-sparkle cnh-bonus-total-sparkle-tl" aria-hidden="true">✦</span>
        <span class="cnh-bonus-total-sparkle cnh-bonus-total-sparkle-tr" aria-hidden="true">✦</span>
        <span class="cnh-bonus-total-sparkle cnh-bonus-total-sparkle-br" aria-hidden="true">✦</span>

        <div class="cnh-bonus-total-pill">
          <span aria-hidden="true">🎁</span>
          <span>${CNH_BONUS_CONFIG.totalValue.badge}</span>
        </div>

        <div class="cnh-bonus-total-old">${CNH_BONUS_CONFIG.totalValue.referenceTotal}</div>

        <div class="cnh-bonus-total-zero">${CNH_BONUS_CONFIG.totalValue.freeTotal}</div>

        <div class="cnh-bonus-total-free-label">${CNH_BONUS_CONFIG.totalValue.highlightText}</div>

        <p class="cnh-bonus-total-footnote">${CNH_BONUS_CONFIG.totalValue.footerText}</p>
      </div>

      <a href="#oferta" class="cnh-bonus-cta-btn" data-scroll-to-offer="true" role="button">
        <span class="cnh-bonus-cta-main">${CNH_BONUS_CONFIG.cta.mainText}</span>
        <span class="cnh-bonus-cta-sub">${CNH_BONUS_CONFIG.cta.subText}</span>
      </a>
    </div>
  `;

  return section;
}

function initOfferTimer(section) {
  const minEl = section.querySelector("#cnh-timer-min");
  const secEl = section.querySelector("#cnh-timer-sec");
  const statusEl = section.querySelector("#cnh-timer-status");
  if (!minEl || !secEl) return;

  const STORAGE_KEY = "cnh_offer_timer_expires_v2";
  const DURATION_MS = (CNH_OFFER_CONFIG.timer?.minutes || 10) * 60 * 1000;

  let expiresAt = parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
  const now = Date.now();
  if (!expiresAt || expiresAt < now || expiresAt > now + DURATION_MS + 5000) {
    expiresAt = now + DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY, expiresAt.toString());
  }

  function update() {
    const current = Date.now();
    const remainingMs = expiresAt - current;
    if (remainingMs <= 0) {
      minEl.textContent = "00";
      secEl.textContent = "00";
      if (statusEl) statusEl.textContent = CNH_OFFER_CONFIG.timer?.labelExpired || "OFERTA EXPIRADA";
      return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    minEl.textContent = String(mins).padStart(2, "0");
    secEl.textContent = String(secs).padStart(2, "0");
    if (statusEl) statusEl.textContent = CNH_OFFER_CONFIG.timer?.labelActive || "OFERTA EXPIRA EM";
  }

  update();
  return setInterval(update, 1000);
}

function createNotJustABookSection() {
  const section = document.createElement("section");
  section.className = "cnh-not-just-book-section";
  section.setAttribute("aria-labelledby", "cnh-njb-heading");

  section.innerHTML = `
    <style>
      .cnh-not-just-book-section {
        background: #faf7f0 !important;
        width: 100% !important;
        padding: 0.6rem 0.85rem !important;
        box-sizing: border-box !important;
        display: block !important;
      }
      .cnh-njb-container {
        max-width: 42rem !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
      }
      .cnh-njb-card {
        background: #071B35 !important;
        background-color: #071B35 !important;
        border-radius: 0.85rem !important;
        border-top: 3px solid #FF5A1F !important;
        border-left: 1px solid rgba(255, 255, 255, 0.07) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.07) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
        box-shadow: 0 10px 24px -4px rgba(7, 27, 53, 0.2), 0 2px 6px rgba(7, 27, 53, 0.06) !important;
        padding: 1.1rem 1.3rem 1.15rem !important;
        text-align: left !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .cnh-njb-title {
        margin: 0 0 0.45rem 0 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.05rem, 3vw, 1.35rem) !important;
        font-weight: 900 !important;
        letter-spacing: -0.01em !important;
        line-height: 1.15 !important;
        text-transform: uppercase !important;
        color: #ffffff !important;
      }
      .cnh-njb-emoji {
        display: inline-block !important;
        margin-right: 0.25rem !important;
        font-size: 1.1em !important;
        vertical-align: -0.06em !important;
      }
      .cnh-njb-title-white {
        color: #ffffff !important;
      }
      .cnh-njb-title-orange {
        color: #FF5A1F !important;
        display: block !important;
      }
      .cnh-njb-text {
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        color: #cbd5e1 !important;
        font-size: clamp(0.75rem, 1.9vw, 0.84rem) !important;
        font-weight: 400 !important;
        line-height: 1.4 !important;
        margin: 0 0 0.85rem 0 !important;
      }
      .cnh-njb-text strong {
        color: #ffffff !important;
        font-weight: 700 !important;
      }
      .cnh-njb-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 0.45rem 1.25rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
        align-items: center !important;
      }
      .cnh-njb-item {
        display: flex !important;
        align-items: center !important;
        gap: 0.45rem !important;
        min-height: 22px !important;
      }
      .cnh-njb-check {
        width: 16px !important;
        height: 16px !important;
        min-width: 16px !important;
        border-radius: 50% !important;
        border: 1.5px solid #FF5A1F !important;
        background: rgba(255, 90, 31, 0.12) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        flex-shrink: 0 !important;
      }
      .cnh-njb-check svg {
        width: 9px !important;
        height: 9px !important;
        stroke: #FF5A1F !important;
      }
      .cnh-njb-item-text {
        color: #cbd5e1 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: clamp(0.72rem, 1.7vw, 0.82rem) !important;
        font-weight: 600 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.01em !important;
      }
      @media (max-width: 640px) {
        .cnh-not-just-book-section {
          padding: 0.6rem 0.6rem 0.5rem !important;
        }
        .cnh-njb-card {
          padding: 0.85rem 0.85rem 0.95rem !important;
          border-radius: 0.75rem !important;
        }
        .cnh-njb-title {
          font-size: 1.05rem !important;
          margin-bottom: 0.35rem !important;
        }
        .cnh-njb-text {
          margin-bottom: 0.7rem !important;
          font-size: 0.74rem !important;
          line-height: 1.35 !important;
        }
        .cnh-njb-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 0.4rem 0.55rem !important;
          align-items: center !important;
        }
        .cnh-njb-item {
          gap: 0.35rem !important;
          min-height: 20px !important;
        }
        .cnh-njb-check {
          width: 14px !important;
          height: 14px !important;
          min-width: 14px !important;
        }
        .cnh-njb-check svg {
          width: 8px !important;
          height: 8px !important;
        }
        .cnh-njb-item-text {
          font-size: 0.69rem !important;
          line-height: 1.2 !important;
        }
      }
    </style>

    <div class="cnh-njb-container">
      <div class="cnh-njb-card">
        <h2 class="cnh-njb-title" id="cnh-njb-heading">
          <span class="cnh-njb-emoji" aria-hidden="true">🚀</span>
          <span class="cnh-njb-title-white">VOCÊ NÃO ESTÁ ADQUIRINDO</span>
          <span class="cnh-njb-title-orange">APENAS UMA APOSTILA.</span>
        </h2>

        <p class="cnh-njb-text">
          Você está entrando para um <strong>sistema completo</strong>, com tudo o que precisa para estudar, praticar e chegar mais preparado para a prova teórica da CNH.
        </p>

        <div class="cnh-njb-grid">
          <!-- Linha 1 -->
          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Apostila Plano Aprovação CNH 2026</span>
          </div>

          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Plataforma Plano Aprovação</span>
          </div>

          <!-- Linha 2 -->
          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Professores IA</span>
          </div>

          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Simulados CNH</span>
          </div>

          <!-- Linha 3 -->
          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Plano de Estudos</span>
          </div>

          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Questões Direcionadas</span>
          </div>

          <!-- Linha 4 -->
          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Grupo VIP de Alunos</span>
          </div>

          <div class="cnh-njb-item">
            <div class="cnh-njb-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="cnh-njb-item-text">Suporte pelo WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return section;
}

function createMainOfferSection() {
  const section = document.createElement("section");
  section.id = "oferta";
  section.className = "cnh-main-offer-section";
  section.setAttribute("aria-labelledby", "cnh-main-offer-title");

  const itemsHtml = CNH_OFFER_CONFIG.items.map((item) => {
    let rightBadge = "";
    if (item.tagType === "pill-primary") {
      rightBadge = `<span class="cnh-offer-item-pill cnh-offer-item-pill-primary">${item.tag}</span>`;
    } else if (item.tagType === "pill-secondary") {
      rightBadge = `<span class="cnh-offer-item-pill cnh-offer-item-pill-secondary">${item.tag}</span>`;
    } else if (item.tagType === "pill-highlight") {
      rightBadge = `<span class="cnh-offer-item-pill cnh-offer-item-pill-highlight">${item.tag}</span>`;
    } else {
      rightBadge = `
        <span class="cnh-offer-item-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      `;
    }

    return `
      <li class="cnh-offer-included-item">
        <div class="cnh-offer-item-left">
          <span class="cnh-offer-item-icon" aria-hidden="true">${item.icon}</span>
          <span class="cnh-offer-item-text">${item.title}</span>
        </div>
        <div class="cnh-offer-item-right">
          ${rightBadge}
        </div>
      </li>
    `;
  }).join("");

  let productImageHtml = "";
  if (CNH_OFFER_CONFIG.productImage.imageUrl) {
    productImageHtml = `<img src="${CNH_OFFER_CONFIG.productImage.imageUrl}" alt="Plano Aprovação CNH 2026" class="cnh-offer-product-img" loading="lazy" decoding="async">`;
  } else {
    // Professional product mockup composition placeholder (compact)
    productImageHtml = `
      <div class="cnh-offer-product-placeholder">
        <div class="cnh-offer-mockup-stack">
          <div class="cnh-offer-mock-sheet cnh-offer-mock-sheet-left"></div>
          <div class="cnh-offer-mock-sheet cnh-offer-mock-sheet-right"></div>
          <div class="cnh-offer-mock-main">
            <div class="cnh-offer-mock-logo">PLANO DE APROVAÇÃO</div>
            <div class="cnh-offer-mock-badge">CNH 2026</div>
            <div class="cnh-offer-mock-ph-text">[${CNH_OFFER_CONFIG.productImage.pendingLabel}]</div>
          </div>
        </div>
      </div>
    `;
  }

  section.innerHTML = `
    <style>
      .cnh-main-offer-section {
        background: #FAF7F0 !important;
        background-color: #FAF7F0 !important;
        width: 100% !important;
        padding: 2.25rem 0.75rem 3rem !important;
        box-sizing: border-box !important;
        scroll-margin-top: 2rem !important;
        display: block !important;
      }
      .cnh-offer-card-wrapper {
        max-width: 23.5rem !important;
        margin: 0 auto !important;
        background: #071B35 !important;
        background-color: #071B35 !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 1.3rem !important;
        padding: 1.15rem 0.95rem 1.05rem !important;
        box-shadow: 0 20px 44px -6px rgba(7, 27, 53, 0.35), 0 6px 16px rgba(0,0,0,0.25) !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .cnh-offer-title {
        margin: 0 0 0.65rem !important;
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.48rem, 5.4vw, 1.95rem) !important;
        font-weight: 900 !important;
        letter-spacing: 0.01em !important;
        line-height: 1.08 !important;
        text-transform: uppercase !important;
        text-align: center !important;
      }
      .cnh-offer-title-highlight {
        color: #FF5A1F !important;
        display: inline !important;
      }
      .cnh-offer-product-wrap {
        width: 100% !important;
        margin: 0.15rem auto 0.65rem !important;
        box-sizing: border-box !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
      }
      .cnh-offer-product-img {
        width: 100% !important;
        max-width: 195px !important;
        height: auto !important;
        max-height: 135px !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4)) !important;
        transform: translateZ(0) !important;
      }
      .cnh-offer-product-placeholder {
        width: 100% !important;
        padding: 0.2rem 0.2rem !important;
        box-sizing: border-box !important;
        display: flex !important;
        justify-content: center !important;
      }
      .cnh-offer-mockup-stack {
        position: relative !important;
        width: 155px !important;
        height: 96px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-offer-mock-sheet {
        position: absolute !important;
        width: 90px !important;
        height: 90px !important;
        border-radius: 9px !important;
        background: #0f274a !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .cnh-offer-mock-sheet-left {
        transform: rotate(-10deg) translate(-18px, -3px) !important;
        opacity: 0.65 !important;
      }
      .cnh-offer-mock-sheet-right {
        transform: rotate(12deg) translate(18px, -2px) !important;
        opacity: 0.65 !important;
      }
      .cnh-offer-mock-main {
        position: relative !important;
        width: 114px !important;
        height: 96px !important;
        border-radius: 11px !important;
        background: linear-gradient(145deg, #0d284e 0%, #06152a 100%) !important;
        border: 1.5px solid rgba(255, 90, 31, 0.4) !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0.35rem !important;
        box-sizing: border-box !important;
        z-index: 2 !important;
      }
      .cnh-offer-mock-logo {
        color: #ffffff !important;
        font-family: 'Oswald', sans-serif !important;
        font-size: 0.58rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        line-height: 1 !important;
        margin-bottom: 0.12rem !important;
      }
      .cnh-offer-mock-badge {
        color: #FF5A1F !important;
        font-family: 'Oswald', sans-serif !important;
        font-size: 0.78rem !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        margin-bottom: 0.25rem !important;
      }
      .cnh-offer-mock-ph-text {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.46rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.02em !important;
        text-align: center !important;
      }
      .cnh-offer-included-box {
        background: #0f274a !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 0.95rem !important;
        padding: 0.65rem 0.75rem 0.6rem !important;
        text-align: left !important;
        box-sizing: border-box !important;
        width: 100% !important;
        margin-bottom: 0.55rem !important;
      }
      .cnh-offer-included-header {
        display: flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.8rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.45rem !important;
      }
      .cnh-offer-included-list {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0.35rem !important;
      }
      .cnh-offer-included-item {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 0.35rem !important;
      }
      .cnh-offer-item-left {
        display: flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
        flex: 1 !important;
        min-width: 0 !important;
      }
      .cnh-offer-item-icon {
        font-size: 0.82rem !important;
        line-height: 1 !important;
        flex-shrink: 0 !important;
      }
      .cnh-offer-item-text {
        color: #ffffff !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.74rem !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
      }
      .cnh-offer-item-pill {
        display: inline-block !important;
        border-radius: 9999px !important;
        padding: 0.12rem 0.44rem !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.54rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        line-height: 1 !important;
        flex-shrink: 0 !important;
      }
      .cnh-offer-item-pill-primary {
        background: #EA580C !important;
        color: #ffffff !important;
      }
      .cnh-offer-item-pill-secondary {
        background: #C2410C !important;
        color: #ffffff !important;
      }
      .cnh-offer-item-pill-highlight {
        background: #854D0E !important;
        color: #FEF08A !important;
      }
      .cnh-offer-item-check {
        width: 13px !important;
        height: 13px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
      }
      .cnh-offer-item-check svg {
        width: 100% !important;
        height: 100% !important;
      }
      .cnh-offer-price-box {
        background: #0a1f3c !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 0.95rem !important;
        padding: 0.7rem 0.65rem 0.6rem !important;
        text-align: center !important;
        box-sizing: border-box !important;
        width: 100% !important;
        margin-bottom: 0.55rem !important;
      }
      .cnh-offer-price-old {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.74rem !important;
        font-weight: 600 !important;
        text-decoration: line-through !important;
        margin-bottom: 0.1rem !important;
      }
      .cnh-offer-price-lead {
        color: #cbd5e1 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.64rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.05rem !important;
      }
      .cnh-offer-price-main {
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(2.35rem, 8vw, 2.95rem) !important;
        font-weight: 900 !important;
        line-height: 0.95 !important;
        letter-spacing: -0.03em !important;
        margin: 0.05rem 0 0.18rem !important;
        text-shadow: 0 4px 16px rgba(255, 90, 31, 0.35) !important;
      }
      .cnh-offer-price-terms {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 500 !important;
      }
      .cnh-offer-timer-box {
        background: #06152a !important;
        border: 1.5px solid rgba(255, 90, 31, 0.45) !important;
        border-radius: 0.95rem !important;
        padding: 0.55rem 0.75rem 0.6rem !important;
        margin-bottom: 0.55rem !important;
        text-align: center !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .cnh-offer-timer-header {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.35rem !important;
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 0.8rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.35rem !important;
      }
      .cnh-offer-timer-clock-icon {
        width: 14px !important;
        height: 14px !important;
        stroke: #FF5A1F !important;
      }
      .cnh-offer-timer-digits-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.45rem !important;
      }
      .cnh-offer-timer-tile {
        background: #091c36 !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 10px !important;
        min-width: 52px !important;
        padding: 0.3rem 0.55rem 0.35rem !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      .cnh-timer-digit {
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: 1.55rem !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        letter-spacing: 0.02em !important;
      }
      .cnh-timer-unit {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.58rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        margin-top: 0.15rem !important;
        line-height: 1 !important;
      }
      .cnh-offer-timer-colon {
        color: #94a3b8 !important;
        font-family: 'Oswald', sans-serif !important;
        font-size: 1.35rem !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        margin-bottom: 0.5rem !important;
      }
      .cnh-offer-checkout-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        background: linear-gradient(180deg, #FF6827 0%, #FF5A1F 100%) !important;
        border: none !important;
        border-radius: 0.95rem !important;
        padding: 0.85rem 1.05rem !important;
        color: #ffffff !important;
        text-decoration: none !important;
        cursor: pointer !important;
        box-shadow: 0 10px 24px rgba(255, 90, 31, 0.45) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
        box-sizing: border-box !important;
        margin-bottom: 0.6rem !important;
      }
      .cnh-offer-checkout-btn:hover {
        background: linear-gradient(180deg, #FF7638 0%, #e04b14 100%) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 14px 30px rgba(255, 90, 31, 0.55) !important;
      }
      .cnh-offer-checkout-btn:active {
        transform: translateY(0) !important;
      }
      .cnh-offer-checkout-main {
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(1.02rem, 3.3vw, 1.18rem) !important;
        font-weight: 900 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1.1 !important;
      }
      .cnh-offer-checkout-sub {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.62rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        opacity: 0.95 !important;
        margin-top: 0.18rem !important;
      }
      .cnh-offer-whatsapp-note {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.55rem !important;
        background: rgba(16, 185, 129, 0.08) !important;
        border: 1px solid rgba(34, 197, 94, 0.35) !important;
        border-radius: 0.85rem !important;
        padding: 0.5rem 0.75rem !important;
        color: #ffffff !important;
        font-family: 'Plus Jakarta Sans', Inter, sans-serif !important;
        font-size: 0.68rem !important;
        font-weight: 600 !important;
        line-height: 1.3 !important;
        margin-bottom: 0.65rem !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }
      .cnh-offer-whatsapp-svg {
        flex-shrink: 0 !important;
      }
      .cnh-offer-whatsapp-text {
        color: #ffffff !important;
        font-size: 0.68rem !important;
        line-height: 1.3 !important;
      }
      .cnh-wa-highlight {
        color: #22c55e !important;
        font-weight: 700 !important;
      }
      .cnh-offer-trust-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 0.35rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 0.6rem !important;
      }
      .cnh-offer-trust-item {
        background: #0b1f3c !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 0.75rem !important;
        padding: 0.55rem 0.25rem 0.5rem !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.35rem !important;
        min-height: 62px !important;
        box-sizing: border-box !important;
      }
      .cnh-trust-svg {
        display: block !important;
        flex-shrink: 0 !important;
      }
      .cnh-trust-seal-wrap {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-offer-trust-label {
        color: #cbd5e1 !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.56rem !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }
      .cnh-offer-footer-note {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.35rem !important;
        color: #64748b !important;
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-size: 0.64rem !important;
        font-weight: 600 !important;
        margin: 0 !important;
      }
      .cnh-offer-footer-note svg {
        flex-shrink: 0 !important;
      }
      @media (max-width: 640px) {
        .cnh-main-offer-section {
          padding: 2rem 0.65rem 2.6rem !important;
        }
        .cnh-offer-card-wrapper {
          padding: 1.05rem 0.8rem 0.95rem !important;
          border-radius: 1.15rem !important;
        }
        .cnh-offer-trust-label {
          font-size: 0.52rem !important;
        }
      }
    </style>
    <div class="cnh-offer-card-wrapper" id="cnh-offer-pricing-card" data-scroll-anchor="oferta">
      <h2 class="cnh-offer-title" id="cnh-main-offer-title">
        <span>${CNH_OFFER_CONFIG.titlePart1}</span> <span class="cnh-offer-title-highlight">${CNH_OFFER_CONFIG.titlePart2}</span>
      </h2>

      <div class="cnh-offer-product-wrap">
        ${productImageHtml}
      </div>

      <div class="cnh-offer-included-box">
        <div class="cnh-offer-included-header">
          <span aria-hidden="true">🎁</span>
          <span>${CNH_OFFER_CONFIG.whatsIncludedTitle}</span>
        </div>
        <ul class="cnh-offer-included-list">
          ${itemsHtml}
        </ul>
      </div>

      <div class="cnh-offer-price-box">
        <div class="cnh-offer-price-old">${CNH_OFFER_CONFIG.pricing.referencePrice}</div>
        <div class="cnh-offer-price-lead">${CNH_OFFER_CONFIG.pricing.leadText}</div>
        <div class="cnh-offer-price-main">${CNH_OFFER_CONFIG.pricing.mainPrice}</div>
        <div class="cnh-offer-price-terms">${CNH_OFFER_CONFIG.pricing.termsText}</div>
      </div>

      <div class="cnh-offer-timer-box">
        <div class="cnh-offer-timer-header">
          <svg class="cnh-offer-timer-clock-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span id="cnh-timer-status">${CNH_OFFER_CONFIG.timer?.labelActive || "OFERTA EXPIRA EM"}</span>
        </div>
        <div class="cnh-offer-timer-digits-row">
          <div class="cnh-offer-timer-tile">
            <span id="cnh-timer-min" class="cnh-timer-digit">10</span>
            <span class="cnh-timer-unit">MIN</span>
          </div>
          <span class="cnh-offer-timer-colon" aria-hidden="true">:</span>
          <div class="cnh-offer-timer-tile">
            <span id="cnh-timer-sec" class="cnh-timer-digit">00</span>
            <span class="cnh-timer-unit">SEG</span>
          </div>
        </div>
      </div>

      <a href="https://ggcheckout.app/checkout/v5/cqXuS3l8MVTxF4UyzST9" id="oferta-checkout-btn" class="cnh-offer-checkout-btn" data-final-checkout="true" role="button" target="_self">
        <span class="cnh-offer-checkout-main">${CNH_OFFER_CONFIG.cta.mainText}</span>
        <span class="cnh-offer-checkout-sub">${CNH_OFFER_CONFIG.cta.subText}</span>
      </a>

      <div class="cnh-offer-whatsapp-note">
        <svg class="cnh-offer-whatsapp-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <div class="cnh-offer-whatsapp-text">
          Após a compra, você recebe o acesso <span class="cnh-wa-highlight">direto no seu WhatsApp</span> — sem complicação.
        </div>
      </div>

      <div class="cnh-offer-trust-grid">
        <div class="cnh-offer-trust-item">
          <svg class="cnh-trust-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2.5" ry="2.5"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span class="cnh-offer-trust-label">Compra 100% segura</span>
        </div>

        <div class="cnh-offer-trust-item">
          <svg class="cnh-trust-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
          <span class="cnh-offer-trust-label">Dados criptografados</span>
        </div>

        <div class="cnh-offer-trust-item">
          <div class="cnh-trust-seal-wrap">
            <svg viewBox="0 0 100 100" width="30" height="30" fill="none">
              <defs>
                <!-- Path for circular text on the white ring -->
                <path id="cnhSealTopArc" d="M 22 50 A 28 28 0 0 1 78 50" fill="none"/>
                <path id="cnhSealBottomArc" d="M 78 50 A 28 28 0 0 1 22 50" fill="none"/>
              </defs>
              
              <!-- Outer Golden Scalloped Rosette (16 rounded lobes) -->
              <path d="M 50 3 
                       C 54 3, 56 7, 60 8.5 
                       C 64 10, 68 8.5, 71.5 12 
                       C 75 15.5, 73.5 19.5, 75 23.5 
                       C 76.5 27.5, 80.5 29.5, 80.5 33.5 
                       C 80.5 37.5, 76.5 39.5, 75 43.5 
                       C 73.5 47.5, 75 51.5, 71.5 55 
                       C 68 58.5, 64 57, 60 58.5 
                       C 56 60, 54 64, 50 64 
                       C 46 64, 44 60, 40 58.5 
                       C 36 57, 32 58.5, 28.5 55 
                       C 25 51.5, 26.5 47.5, 25 43.5 
                       C 23.5 39.5, 19.5 37.5, 19.5 33.5 
                       C 19.5 29.5, 23.5 27.5, 25 23.5 
                       C 26.5 19.5, 25 15.5, 28.5 12 
                       C 32 8.5, 36 10, 40 8.5 
                       C 44 7, 46 3, 50 3 Z" 
                    transform="translate(0, 16) scale(1, 1)" 
                    style="display:none;" />

              <!-- Highly accurate multi-point scalloped medal -->
              <path d="M50 4 
                       Q54 4 57 7 Q60 10 64 9 Q68 8 70 12 Q72 16 76 17 Q80 18 81 22 Q82 26 86 28 Q90 30 89 34 Q88 38 91 42 Q94 46 92 50 Q90 54 91 58 Q92 62 89 66 Q86 70 86 74 Q86 78 81 80 Q76 82 74 86 Q72 90 68 90 Q64 90 60 93 Q56 96 50 96 Q44 96 40 93 Q36 90 32 90 Q28 90 26 86 Q24 82 19 80 Q14 78 14 74 Q14 70 11 66 Q8 62 9 58 Q10 54 8 50 Q6 46 9 42 Q12 38 11 34 Q10 30 14 28 Q18 26 19 22 Q20 18 24 17 Q28 16 30 12 Q32 8 36 9 Q40 10 43 7 Q46 4 50 4 Z" 
                    fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>

              <!-- White middle ring -->
              <circle cx="50" cy="50" r="37" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="0.5"/>

              <!-- Arc text on white ring -->
              <text font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="6.2" fill="#1F2937" letter-spacing="0.5">
                <textPath href="#cnhSealTopArc" startOffset="50%" text-anchor="middle">
                  100% GARANTIA DE
                </textPath>
              </text>

              <!-- Star accents on sides -->
              <text x="17" y="52" font-size="5" fill="#F59E0B" text-anchor="middle" dominant-baseline="middle">★</text>
              <text x="83" y="52" font-size="5" fill="#F59E0B" text-anchor="middle" dominant-baseline="middle">★</text>

              <text font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="6.2" fill="#1F2937" letter-spacing="0.8">
                <textPath href="#cnhSealBottomArc" startOffset="50%" text-anchor="middle">
                  SATISFAÇÃO
                </textPath>
              </text>

              <!-- Center Dark Circle -->
              <circle cx="50" cy="50" r="23" fill="#1E232F"/>
              <circle cx="50" cy="50" r="21.5" fill="none" stroke="#F59E0B" stroke-width="0.8" stroke-dasharray="1.5 1.5"/>

              <!-- Center "7" and "DIAS" in Yellow -->
              <text x="50" y="46" font-family="'Oswald', Arial, sans-serif" font-weight="900" font-size="20" fill="#F59E0B" text-anchor="middle" dominant-baseline="middle">7</text>
              <text x="50" y="60" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="7.5" fill="#F59E0B" text-anchor="middle" dominant-baseline="middle" letter-spacing="0.6">DIAS</text>
            </svg>
          </div>
          <span class="cnh-offer-trust-label">Garantia de 7 dias</span>
        </div>
      </div>

      <p class="cnh-offer-footer-note">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>${CNH_OFFER_CONFIG.footerNote}</span>
      </p>
    </div>
  `;

  initOfferTimer(section);

  const checkoutBtn = section.querySelector("#oferta-checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      redirectToCheckout(e);
    });
  }

  return section;
}

// ================= TESTIMONIALS CONFIGURATION (EASILY EDITABLE) =================
const CNH_TESTIMONIALS_CONFIG = {
  headerBadge: "QUEM JÁ PASSOU CONTA",
  ratingScore: "4,9/5",
  studentsCount: "+12.000 alunos",
  closingTextPart1: "Mais de",
  closingTextCount: "12.000 brasileiros",
  closingTextPart2: "já garantiram sua aprovação com o nosso plano.",
  closingTextHighlight: "A próxima aprovação pode ser a sua.",
  testimonials: [
    {
      name: "CAMILA RIBEIRO",
      age: "25 anos",
      location: "Recife, PE",
      avatarUrl: "/attached_assets/65_1787710606336.jpg",
      avatarBg: "#FFE4D6",
      avatarColor: "#EA580C",
      gender: "female",
      quote: "Eu não sabia exatamente o que estudar e estava com medo de chegar despreparada para a prova. Com o plano consegui organizar meus estudos, praticar com os simulados e chegar muito mais confiante no dia.",
      badgeText: "APROVADA NA PROVA TEÓRICA",
      verified: true
    },
    {
      name: "ROBERTO ALMEIDA",
      age: "38 anos",
      location: "Belo Horizonte, MG",
      avatarUrl: "/attached_assets/32_1787710600860.jpg",
      avatarBg: "#E0F2FE",
      avatarColor: "#0284C7",
      gender: "male",
      quote: "Eu trabalhava o dia inteiro e tinha pouco tempo para estudar. O conteúdo direto ao ponto e os simulados me ajudaram a focar no que realmente precisava revisar. Finalmente consegui organizar minha preparação.",
      badgeText: "PREPARAÇÃO CONCLUÍDA",
      verified: true
    },
    {
      name: "MARLENE SOUZA",
      age: "53 anos",
      location: "Salvador, BA",
      avatarUrl: "/attached_assets/74_1787710600860.jpg",
      avatarBg: "#FEF3C7",
      avatarColor: "#D97706",
      gender: "female",
      quote: "Eu já tinha tentado estudar sozinha e sempre acabava perdida no meio de tanta informação. Com o Plano Aprovação ficou muito mais fácil saber o que estudar, revisar meus erros e praticar antes da prova.",
      badgeText: "OBJETIVO CONQUISTADO",
      verified: true
    }
  ]
};

function createTestimonialsSection() {
  const section = document.createElement("section");
  section.className = "cnh-testimonials-section";
  section.setAttribute("aria-labelledby", "cnh-testimonials-title");
  section.style.cssText = "background: #faf7f0 !important; background-color: #faf7f0 !important; border-top: 1px solid rgba(7, 27, 53, 0.06); padding: 2.75rem 1rem 3.5rem !important; width: 100%; box-sizing: border-box; display: block;";

  const getAvatarSvg = (t) => {
    if (t.avatarUrl) {
      return `<img src="${t.avatarUrl}" alt="${t.name}" class="cnh-testi-avatar-img" loading="lazy" decoding="async">`;
    }
    // High-fidelity illustrated vector avatar placeholder matching reference aesthetic
    if (t.gender === "female" && t.name.includes("CAMILA")) {
      return `
        <svg viewBox="0 0 64 64" class="cnh-testi-avatar-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#FED7AA"/>
          <path d="M16 54C16 44 23 38 32 38C41 38 48 44 48 54" fill="#0284C7"/>
          <circle cx="32" cy="27" r="13" fill="#FDBA74"/>
          <path d="M20 25C20 17 25 12 32 12C39 12 44 17 44 25C44 27 43 32 40 35C38 31 38 27 32 27C26 27 26 31 24 35C21 32 20 27 20 25Z" fill="#78350F"/>
        </svg>
      `;
    } else if (t.gender === "male") {
      return `
        <svg viewBox="0 0 64 64" class="cnh-testi-avatar-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#BAE6FD"/>
          <path d="M16 54C16 44 23 38 32 38C41 38 48 44 48 54" fill="#0369A1"/>
          <circle cx="32" cy="27" r="12.5" fill="#FED7AA"/>
          <path d="M21 24C21 16 26 13 32 13C38 13 43 16 43 24C41 23 37 22 32 22C27 22 23 23 21 24Z" fill="#451A03"/>
          <path d="M24 30C26 34 38 34 40 30C40 35 37 38 32 38C27 38 24 35 24 30Z" fill="#78350F" opacity="0.3"/>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 64 64" class="cnh-testi-avatar-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#FEF08A"/>
          <path d="M16 54C16 44 23 38 32 38C41 38 48 44 48 54" fill="#B45309"/>
          <circle cx="32" cy="27" r="13" fill="#FED7AA"/>
          <path d="M19 26C19 16 25 13 32 13C39 13 45 16 45 26C45 34 42 37 40 36C38 31 38 27 32 27C26 27 26 31 24 36C22 37 19 34 19 26Z" fill="#713F12"/>
        </svg>
      `;
    }
  };

  const cardsHtml = CNH_TESTIMONIALS_CONFIG.testimonials.map((t, idx) => `
    <article class="cnh-testi-card" data-index="${idx}">
      <!-- Decorative quotes in top right -->
      <span class="cnh-testi-quote-mark" aria-hidden="true">”</span>

      <div class="cnh-testi-card-header">
        <div class="cnh-testi-avatar-wrapper">
          <div class="cnh-testi-avatar">
            ${getAvatarSvg(t)}
          </div>
          <div class="cnh-testi-avatar-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <div class="cnh-testi-info">
          <div class="cnh-testi-name-row">
            <h3 class="cnh-testi-name">${t.name}</h3>
            <span class="cnh-testi-age">· ${t.age}</span>
          </div>
          <div class="cnh-testi-location">
            <span class="cnh-testi-pin" aria-hidden="true">📍</span>
            <span>${t.location}</span>
          </div>
          <div class="cnh-testi-stars" aria-label="Avaliação: 5 de 5 estrelas">
            <span class="cnh-testi-star">★</span>
            <span class="cnh-testi-star">★</span>
            <span class="cnh-testi-star">★</span>
            <span class="cnh-testi-star">★</span>
            <span class="cnh-testi-star">★</span>
          </div>
        </div>
      </div>

      <p class="cnh-testi-body">
        “${t.quote}”
      </p>

      <div class="cnh-testi-divider"></div>

      <div class="cnh-testi-card-footer">
        <div class="cnh-testi-result-pill">
          <span class="cnh-testi-result-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 10 11 15 8 12"></polyline>
            </svg>
          </span>
          <span class="cnh-testi-result-text">${t.badgeText}</span>
        </div>

        <div class="cnh-testi-verified">
          <span class="cnh-testi-verified-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 10 11 15 8 12"></polyline>
            </svg>
          </span>
          <span class="cnh-testi-verified-text">Depoimento verificado</span>
        </div>
      </div>
    </article>
  `).join("");

  section.innerHTML = `
    <style>
      .cnh-testimonials-section {
        background: #faf7f0 !important;
        width: 100% !important;
        padding: 2.75rem 1rem 3.5rem !important;
        box-sizing: border-box !important;
      }
      .cnh-testimonials-inner {
        max-width: 40rem !important;
        margin: 0 auto !important;
        padding: 0 !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .cnh-testimonials-badge {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
        background: #ffffff !important;
        border: 1px solid rgba(7, 27, 53, 0.1) !important;
        border-radius: 9999px !important;
        padding: 0.35rem 0.95rem !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', sans-serif !important;
        font-size: 0.82rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
        margin-bottom: 0.95rem !important;
        box-shadow: 0 2px 6px rgba(7, 27, 53, 0.04) !important;
      }
      .cnh-testimonials-title {
        margin: 0 0 0.85rem !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.45rem, 4.2vw, 2.15rem) !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.15 !important;
        text-transform: uppercase !important;
      }
      .cnh-testimonials-title-highlight {
        color: #FF5A1F !important;
      }
      .cnh-testimonials-rating-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.45rem !important;
        margin-bottom: 2rem !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.92rem !important;
      }
      .cnh-testimonials-stars-summary {
        display: inline-flex !important;
        gap: 2px !important;
        color: #FF5A1F !important;
        font-size: 1.05rem !important;
        line-height: 1 !important;
      }
      .cnh-testimonials-score {
        color: #071b35 !important;
        font-weight: 800 !important;
      }
      .cnh-testimonials-count {
        color: #64748b !important;
        font-weight: 500 !important;
      }
      .cnh-testimonials-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.15rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .cnh-testi-card {
        position: relative !important;
        background: #ffffff !important;
        border: 1px solid rgba(7, 27, 53, 0.08) !important;
        border-radius: 1.25rem !important;
        padding: 1.25rem 1.4rem 1.15rem !important;
        box-shadow: 0 8px 24px -4px rgba(7, 27, 53, 0.06), 0 2px 6px -1px rgba(7, 27, 53, 0.03) !important;
        text-align: left !important;
        box-sizing: border-box !important;
        width: 100% !important;
        transition: transform 0.25s ease, box-shadow 0.25s ease !important;
      }
      .cnh-testi-card:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 28px -4px rgba(7, 27, 53, 0.09) !important;
      }
      .cnh-testi-quote-mark {
        position: absolute !important;
        top: 0.85rem !important;
        right: 1.35rem !important;
        font-family: Georgia, serif !important;
        font-size: 2.85rem !important;
        line-height: 1 !important;
        font-weight: 700 !important;
        color: rgba(255, 90, 31, 0.2) !important;
        pointer-events: none !important;
        user-select: none !important;
      }
      .cnh-testi-card-header {
        display: flex !important;
        align-items: center !important;
        gap: 0.85rem !important;
      }
      .cnh-testi-avatar-wrapper {
        position: relative !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
      }
      .cnh-testi-avatar {
        width: 52px !important;
        height: 52px !important;
        border-radius: 50% !important;
        overflow: hidden !important;
        border: 2px solid #ffffff !important;
        box-shadow: 0 0 0 1.5px #FF5A1F, 0 2px 6px rgba(0,0,0,0.08) !important;
        background: #f1f5f9 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-testi-avatar-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
      }
      .cnh-testi-avatar-svg {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
      }
      .cnh-testi-avatar-check {
        position: absolute !important;
        bottom: -2px !important;
        right: -2px !important;
        width: 17px !important;
        height: 17px !important;
        border-radius: 50% !important;
        background: #FF5A1F !important;
        border: 1.5px solid #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
      }
      .cnh-testi-avatar-check svg {
        width: 9px !important;
        height: 9px !important;
      }
      .cnh-testi-info {
        flex: 1 !important;
        min-width: 0 !important;
      }
      .cnh-testi-name-row {
        display: flex !important;
        align-items: baseline !important;
        gap: 0.35rem !important;
        flex-wrap: wrap !important;
      }
      .cnh-testi-name {
        margin: 0 !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', sans-serif !important;
        font-size: 1.02rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1.2 !important;
      }
      .cnh-testi-age {
        color: #94a3b8 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.82rem !important;
        font-weight: 500 !important;
      }
      .cnh-testi-location {
        color: #64748b !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.78rem !important;
        font-weight: 500 !important;
        margin-top: 0.15rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.25rem !important;
      }
      .cnh-testi-pin {
        font-size: 0.75rem !important;
        line-height: 1 !important;
      }
      .cnh-testi-stars {
        display: flex !important;
        gap: 1.5px !important;
        color: #FF5A1F !important;
        font-size: 0.82rem !important;
        margin-top: 0.2rem !important;
      }
      .cnh-testi-body {
        margin: 1rem 0 1.15rem !important;
        color: #1e293b !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.92rem !important;
        font-style: italic !important;
        line-height: 1.55 !important;
        font-weight: 400 !important;
      }
      .cnh-testi-divider {
        border-top: 1px dashed rgba(7, 27, 53, 0.12) !important;
        margin: 0 0 0.85rem !important;
        width: 100% !important;
      }
      .cnh-testi-card-footer {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 0.75rem !important;
        flex-wrap: wrap !important;
      }
      .cnh-testi-result-pill {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        background: rgba(255, 90, 31, 0.08) !important;
        border: 1px solid rgba(255, 90, 31, 0.22) !important;
        border-radius: 9999px !important;
        padding: 0.28rem 0.7rem !important;
        color: #FF5A1F !important;
      }
      .cnh-testi-result-check {
        width: 13px !important;
        height: 13px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-testi-result-check svg {
        width: 100% !important;
        height: 100% !important;
      }
      .cnh-testi-result-text {
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1 !important;
      }
      .cnh-testi-verified {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        color: #64748b !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.76rem !important;
        font-weight: 500 !important;
      }
      .cnh-testi-verified-icon {
        width: 14px !important;
        height: 14px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .cnh-testi-verified-icon svg {
        width: 100% !important;
        height: 100% !important;
      }
      .cnh-testimonials-closing {
        margin-top: 1.85rem !important;
        text-align: center !important;
        padding: 0 0.5rem !important;
      }
      .cnh-testimonials-closing p {
        margin: 0 !important;
        color: #475569 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: clamp(0.92rem, 2.5vw, 1.02rem) !important;
        line-height: 1.48 !important;
      }
      .cnh-testimonials-closing strong {
        color: #071b35 !important;
        font-weight: 800 !important;
      }
      .cnh-testimonials-closing-highlight {
        color: #FF5A1F !important;
        font-weight: 700 !important;
      }
      @media (max-width: 640px) {
        .cnh-testimonials-section {
          padding: 2.25rem 0.85rem 2.85rem !important;
        }
        .cnh-testi-card {
          padding: 1.1rem 1.15rem 1rem !important;
          border-radius: 1.1rem !important;
        }
        .cnh-testi-body {
          font-size: 0.88rem !important;
          margin: 0.85rem 0 1rem !important;
        }
        .cnh-testi-card-footer {
          gap: 0.5rem !important;
        }
      }
    </style>
    <div class="cnh-testimonials-inner">
      <div class="cnh-testimonials-badge">
        <span aria-hidden="true">👍</span>
        <span>${CNH_TESTIMONIALS_CONFIG.headerBadge}</span>
      </div>

      <h2 class="cnh-testimonials-title" id="cnh-testimonials-title">
        HISTÓRIAS REAIS DE QUEM FOI <span class="cnh-testimonials-title-highlight">APROVADO</span>
      </h2>

      <div class="cnh-testimonials-rating-row">
        <div class="cnh-testimonials-stars-summary" aria-hidden="true">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <span class="cnh-testimonials-score">${CNH_TESTIMONIALS_CONFIG.ratingScore}</span>
        <span class="cnh-testimonials-count">· ${CNH_TESTIMONIALS_CONFIG.studentsCount}</span>
      </div>

      <div class="cnh-testimonials-list">
        ${cardsHtml}
      </div>

      <div class="cnh-testimonials-closing">
        <p>
          ${CNH_TESTIMONIALS_CONFIG.closingTextPart1} <strong>${CNH_TESTIMONIALS_CONFIG.closingTextCount}</strong> ${CNH_TESTIMONIALS_CONFIG.closingTextPart2} <span class="cnh-testimonials-closing-highlight">${CNH_TESTIMONIALS_CONFIG.closingTextHighlight}</span>
        </p>
      </div>
    </div>
  `;

  return section;
}

function createMotivationSection() {
  const section = document.createElement("section");
  section.className = "cnh-motivation-section";
  section.setAttribute("aria-labelledby", "cnh-motivation-title");
  section.style.cssText = "background: #faf7f0 !important; background-color: #faf7f0 !important; border-top: 1px solid rgba(7, 27, 53, 0.06); padding: 3.25rem 1.25rem 3.75rem !important; width: 100%; box-sizing: border-box; display: block;";

  const options = [
    "Quero ter mais liberdade para ir onde eu quiser",
    "Preciso da CNH para ter novas oportunidades de trabalho",
    "Quero parar de depender de outras pessoas para me locomover",
    "Quero poder dirigir e ajudar mais minha família",
    "Estou cansado(a) de adiar minha habilitação",
    "Quero conquistar meu primeiro carro",
    "Quero finalmente tirar esse objetivo do papel"
  ];

  const optionsHtml = options.map((text, index) => `
    <div class="cnh-motivation-option" role="checkbox" tabindex="0" data-index="${index}" aria-checked="false">
      <div class="cnh-motivation-checkbox">
        <svg class="cnh-motivation-check-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="cnh-motivation-text">${text}</span>
    </div>
  `).join("");

  section.innerHTML = `
    <style>
      .cnh-motivation-section {
        background: #faf7f0 !important;
        width: 100% !important;
        padding: 3.25rem 1.25rem 3.75rem !important;
        box-sizing: border-box !important;
      }
      .cnh-motivation-inner {
        max-width: 44rem !important;
        margin: 0 auto !important;
        padding: 0 !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .cnh-motivation-badge {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #fff3ec !important;
        border: 1px solid rgba(255, 90, 31, 0.25) !important;
        color: #FF5A1F !important;
        font-family: 'Outfit', 'Plus Jakarta Sans', Arial, sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.06em !important;
        text-transform: uppercase !important;
        padding: 0.45rem 1.15rem !important;
        border-radius: 9999px !important;
        margin-bottom: 1.25rem !important;
      }
      .cnh-motivation-title {
        margin: 0 0 0.65rem 0 !important;
        color: #071b35 !important;
        font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif !important;
        font-size: clamp(1.45rem, 4.4vw, 2.15rem) !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em !important;
        line-height: 1.15 !important;
        text-transform: uppercase !important;
      }
      .cnh-motivation-title-highlight {
        color: #FF5A1F !important;
      }
      .cnh-motivation-subtitle {
        margin: 0 0 1.85rem 0 !important;
        color: #64748b !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: clamp(0.9rem, 2.6vw, 1.05rem) !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
      }
      .cnh-motivation-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .cnh-motivation-option {
        background: #ffffff !important;
        border: 2px solid transparent !important;
        outline: 1.5px solid rgba(7, 27, 53, 0.09) !important;
        outline-offset: -1.5px !important;
        border-radius: 1.15rem !important;
        padding: 1.05rem 1.35rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 1rem !important;
        cursor: pointer !important;
        text-align: left !important;
        box-shadow: 0 4px 16px -2px rgba(7, 27, 53, 0.04) !important;
        transition: all 180ms ease-in-out !important;
        box-sizing: border-box !important;
        width: 100% !important;
        user-select: none !important;
      }
      .cnh-motivation-option:hover {
        outline-color: rgba(255, 90, 31, 0.45) !important;
        background: #fffdfb !important;
      }
      .cnh-motivation-option.is-selected {
        background: #ffffff !important;
        border: 2px solid #FF5A1F !important;
        outline: none !important;
        box-shadow: 0 6px 20px -2px rgba(255, 90, 31, 0.12) !important;
      }
      .cnh-motivation-checkbox {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        border-radius: 50% !important;
        border: 2px solid #cbd5e1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #ffffff !important;
        transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-sizing: border-box !important;
      }
      .cnh-motivation-check-icon {
        width: 13px !important;
        height: 13px !important;
        transform: scale(0);
        opacity: 0;
        transition: transform 180ms cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 180ms ease !important;
      }
      .cnh-motivation-option.is-selected .cnh-motivation-checkbox {
        background: #FF5A1F !important;
        border-color: #FF5A1F !important;
      }
      .cnh-motivation-option.is-selected .cnh-motivation-check-icon {
        transform: scale(1) !important;
        opacity: 1 !important;
      }
      .cnh-motivation-text {
        color: #071b35 !important;
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: clamp(0.92rem, 2.5vw, 1.02rem) !important;
        font-weight: 600 !important;
        line-height: 1.38 !important;
        flex: 1 !important;
      }
      .cnh-motivation-closing-card {
        margin-top: 1.65rem !important;
        background: #071b35 !important;
        border-radius: 1.15rem !important;
        padding: 1.35rem 1.5rem !important;
        text-align: center !important;
        box-shadow: 0 10px 25px -4px rgba(7, 27, 53, 0.18) !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .cnh-motivation-closing-line1 {
        color: #ffffff !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(1.05rem, 3.2vw, 1.25rem) !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1.2 !important;
        margin-bottom: 0.25rem !important;
      }
      .cnh-motivation-closing-line2 {
        color: #FF5A1F !important;
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(1.05rem, 3.2vw, 1.3rem) !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        line-height: 1.2 !important;
      }
      .cnh-motivation-cta {
        margin-top: 0.85rem !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        background: #FF5A1F !important;
        background-color: #FF5A1F !important;
        border: none !important;
        border-radius: 1.15rem !important;
        padding: 1.1rem 1.5rem !important;
        color: #ffffff !important;
        text-decoration: none !important;
        cursor: pointer !important;
        box-shadow: 0 10px 25px -3px rgba(255, 90, 31, 0.35) !important;
        transition: all 180ms ease !important;
        box-sizing: border-box !important;
      }
      .cnh-motivation-cta:hover {
        background: #e04b14 !important;
        background-color: #e04b14 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 12px 28px -3px rgba(255, 90, 31, 0.45) !important;
      }
      .cnh-motivation-cta:active {
        transform: translateY(0) !important;
      }
      .cnh-motivation-cta-main {
        font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif !important;
        font-size: clamp(1.1rem, 3.4vw, 1.35rem) !important;
        font-weight: 800 !important;
        letter-spacing: 0.01em !important;
        text-transform: uppercase !important;
        line-height: 1.15 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
        justify-content: center !important;
      }
      .cnh-motivation-cta-sub {
        font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        opacity: 0.92 !important;
        margin-top: 0.3rem !important;
      }
      @media (max-width: 640px) {
        .cnh-motivation-section {
          padding: 2.35rem 0.85rem 3rem !important;
        }
        .cnh-motivation-badge {
          font-size: 0.68rem !important;
          padding: 0.4rem 1rem !important;
          margin-bottom: 1rem !important;
        }
        .cnh-motivation-title {
          margin-bottom: 0.5rem !important;
        }
        .cnh-motivation-subtitle {
          margin-bottom: 1.35rem !important;
        }
        .cnh-motivation-option {
          padding: 0.9rem 1.1rem !important;
          border-radius: 1rem !important;
          gap: 0.85rem !important;
        }
        .cnh-motivation-text {
          font-size: 0.88rem !important;
        }
        .cnh-motivation-closing-card {
          margin-top: 1.35rem !important;
          padding: 1.15rem 1.15rem !important;
          border-radius: 1rem !important;
        }
        .cnh-motivation-cta {
          padding: 1rem 1.25rem !important;
          border-radius: 1rem !important;
        }
      }
    </style>
    <div class="cnh-motivation-inner">
      <div class="cnh-motivation-badge">
        PRA VOCÊ QUE QUER DAR ESSE PASSO
      </div>
      <h2 class="cnh-motivation-title" id="cnh-motivation-title">
        POR QUE CONQUISTAR <span class="cnh-motivation-title-highlight">SUA CNH</span> É IMPORTANTE PRA VOCÊ?
      </h2>
      <p class="cnh-motivation-subtitle">
        Qual dessas situações mais combina com o seu momento?
      </p>

      <div class="cnh-motivation-list">
        ${optionsHtml}
      </div>

      <div class="cnh-motivation-closing-card">
        <div class="cnh-motivation-closing-line1">Independente do seu motivo…</div>
        <div class="cnh-motivation-closing-line2">tudo começa com a aprovação.</div>
      </div>

      <a href="#oferta" class="cnh-motivation-cta btn-checkout-trigger" role="button">
        <span class="cnh-motivation-cta-main">QUERO COMEÇAR MINHA PREPARAÇÃO →</span>
        <span class="cnh-motivation-cta-sub">PLANO APROVAÇÃO CNH 2026</span>
      </a>
    </div>
  `;

  // Attach interactive multi-select toggle click handler
  const optionEls = section.querySelectorAll(".cnh-motivation-option");
  optionEls.forEach((el) => {
    el.addEventListener("click", () => {
      const isSelected = el.classList.contains("is-selected");
      if (isSelected) {
        el.classList.remove("is-selected");
        el.setAttribute("aria-checked", "false");
      } else {
        el.classList.add("is-selected");
        el.setAttribute("aria-checked", "true");
      }
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  return section;
}

function enhancePlanSection() {
  const planSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return text.includes("Foi por isso que criamos o") &&
      text.includes("PLANO DE APROVAÇÃO CNH 2026");
  });

  if (!planSection) return;
  planSection.classList.add("plan-explanation-section");

  const planInner = planSection.firstElementChild;
  const planCardWrapper = [...(planInner?.children || [])].find((element) => {
    return (element.textContent || "").includes("PLANO DE APROVAÇÃO CNH 2026");
  });
  const receiveCardWrapper = [...(planInner?.children || [])].find((element) => {
    return (element.textContent || "").includes("O QUE VOCÊ RECEBE");
  });

  planCardWrapper?.classList.add("plan-card-wrapper");
  receiveCardWrapper?.classList.add("receive-card-wrapper");

  const planCard = [...(planCardWrapper?.querySelectorAll("div") || [])].find((element) => {
    return element.classList.contains("bg-[#071B35]");
  });
  const receiveCard = [...(receiveCardWrapper?.querySelectorAll("div") || [])].find((element) => {
    return element.classList.contains("bg-[#071B35]");
  });

  planCard?.classList.add("plan-card");
  receiveCard?.classList.add("receive-card");

  const planIntro = [...planSection.querySelectorAll("p")].find((element) => {
    return element.textContent.trim() === "Foi por isso que criamos o";
  });
  planIntro?.classList.add("plan-intro");

  if (receiveCard) {
    const receiveHeading = [...receiveCard.querySelectorAll("p")].find((element) => {
      return (element.textContent || "").includes("O QUE VOCÊ RECEBE");
    });
    receiveHeading?.classList.add("receive-card-heading");

    const receiveList = [...receiveCard.querySelectorAll("div")].find((element) => {
      return [...element.children].some((child) => {
        return child.children.length === 2 &&
          child.lastElementChild?.tagName === "SPAN" &&
          (child.textContent || "").includes("Plano de estudo guiado (7 dias)");
      });
    });
    receiveList?.classList.add("receive-card-list");

    [...(receiveList?.children || [])].forEach((item) => {
      item.classList.add("receive-card-item");
      item.firstElementChild?.classList.add("receive-card-check");
      item.lastElementChild?.classList.add("receive-card-text");
    });
  }

  const title = [...planSection.querySelectorAll("span")].find((element) => {
    return element.textContent.trim() === "CNH 2026";
  });

  if (title) {
    title.classList.add("plan-title-highlight");
  }
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".material-section__header, .material-section__book-wrap, .material-section__item, .material-section__cta"
  );

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  revealElements.forEach((element, index) => {
    element.style.setProperty("--material-reveal-delay", `${Math.min(index * 55, 330)}ms`);
    revealObserver.observe(element);
  });
}

function enhanceBenefitsSection() {
  const benefitsSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return text.includes("Foco no que realmente cai") &&
      text.includes("Cronograma pronto para seguir") &&
      text.includes("Questões comentadas e diretas") &&
      text.includes("Chegue preparado e confiante");
  });

  if (!benefitsSection || benefitsSection.dataset.benefitsEnhanced === "true") return;

  const grid = benefitsSection.querySelector(".grid-cols-2");
  if (!grid) return;

  const emblems = [
    `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="15"></circle><circle cx="24" cy="24" r="8"></circle><circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none"></circle></svg>`,
    `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="13" width="26" height="25" rx="3"></rect><path d="M16 10v7M32 10v7M11 21h26"></path></svg>`,
    `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 10h14l7 7v21H14z"></path><path d="M28 10v8h7M19 32l3-8 8-8 4 4-8 8zM19 32l-4 1 1-4"></path></svg>`,
    `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m8 21 16-8 16 8-16 8z"></path><path d="M15 25v7c4 4 14 4 18 0v-7M40 22v10"></path></svg>`
  ];

  const cards = [...grid.children]
    .map((wrapper) => wrapper.firstElementChild)
    .filter((card) => card && card.querySelector("p"));

  cards.forEach((card, index) => {
    card.classList.add("benefit-card");
    const emblem = document.createElement("span");
    emblem.className = "benefit-emblem";
    emblem.setAttribute("aria-hidden", "true");
    emblem.innerHTML = emblems[index] || emblems[0];
    card.insertBefore(emblem, card.firstElementChild);
  });

  benefitsSection.classList.add("benefits-section");
  benefitsSection.dataset.benefitsEnhanced = "true";
}

function enhanceProblemEmblems() {
  const problemSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return text.includes("Muito conteúdo para estudar") &&
      text.includes("Pouco tempo na rotina") &&
      text.includes("Falta de direção clara") &&
      text.includes("Já tentou e não passou antes");
  });

  if (!problemSection || problemSection.dataset.problemEmblemsEnhanced === "true") return;

  const icons = [
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22z"></path></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"></circle></svg>`,
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6z"></path><path d="m9 12 2 2 4-4"></path></svg>`
  ];

  const labels = [
    "Muito conteúdo para estudar",
    "Pouco tempo na rotina",
    "Falta de direção clara",
    "Já tentou e não passou antes"
  ];

  labels.forEach((label, index) => {
    const textElement = [...problemSection.querySelectorAll("span")].find((span) => {
      return span.textContent.trim() === label;
    });
    const iconContainer = textElement?.parentElement?.firstElementChild;
    if (iconContainer) {
      iconContainer.innerHTML = icons[index];
      iconContainer.classList.add("problem-emblem");
    }
  });

  problemSection.dataset.problemEmblemsEnhanced = "true";
}

function enhanceFaqSection() {
  document.querySelectorAll(".faq-trust-section").forEach((section) => section.remove());

  const faqSection = [...document.querySelectorAll("section")].find((section) => {
    return (section.textContent || "").includes("PERGUNTAS FREQUENTES");
  });

  if (!faqSection || faqSection.classList.contains("faq-enhanced")) return;
  faqSection.classList.add("faq-enhanced");

  const faqInner = faqSection.firstElementChild;
  const faqHeading = faqInner?.querySelector("h2");
  if (faqHeading) {
    faqHeading.classList.add("faq-title");
    faqHeading.innerHTML = 'AINDA COM <strong>DÚVIDA?</strong>';

    const eyebrow = document.createElement("p");
    eyebrow.className = "faq-eyebrow";
    eyebrow.textContent = "PERGUNTAS FREQUENTES";
    faqHeading.parentElement?.insertBefore(eyebrow, faqHeading);

    const subtitle = document.createElement("p");
    subtitle.className = "faq-subtitle";
    subtitle.textContent = "Aqui estão as respostas que você precisa antes de garantir seu plano.";
    faqHeading.insertAdjacentElement("afterend", subtitle);
  }

}

function enhanceVideoDepoimento() {
  const videoSection = document.getElementById("depoimento-video");
  if (!videoSection) return false;
  if (videoSection.dataset.enhancedVideo === "true") return true;

  // Locate the video container wrapper inside depoimento section
  const videoWrapper = videoSection.querySelector('[style*="aspectRatio"], [style*="aspect-ratio"]') ||
                       videoSection.querySelector(".overflow-hidden.shadow-2xl") ||
                       videoSection.querySelector("iframe")?.parentElement;
  
  if (!videoWrapper) return false;

  // Mark as enhanced to prevent duplicate initialization
  videoSection.dataset.enhancedVideo = "true";

  // Pre-connect to YouTube when user approaches the video section
  if ("IntersectionObserver" in window) {
    const preconnectObserver = new IntersectionObserver((entries, obs) => {
      if (entries[0]?.isIntersecting) {
        ["https://www.youtube-nocookie.com", "https://i.ytimg.com", "https://googleads.g.doubleclick.net"].forEach((url) => {
          if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement("link");
            link.rel = "preconnect";
            link.href = url;
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
          }
        });
        obs.disconnect();
      }
    }, { rootMargin: "350px" });
    preconnectObserver.observe(videoSection);
  }

  // Inject High-Performance Pre-Optimized Video Facade
  videoWrapper.innerHTML = `
    <div class="video-facade-card" role="button" tabindex="0" aria-label="Assistir ao depoimento da aluna aprovada">
      <img src="/assets/video-depoimento-thumb.jpg" 
           alt="Depoimento em vídeo Plano Aprovação CNH" 
           loading="lazy" 
           decoding="async" 
           width="720" 
           height="1280"
           onerror="this.src='https://i.ytimg.com/vi/jinexB5AnBg/maxresdefault.jpg'" />
      
      <!-- Vignette and dark gradient for maximum contrast -->
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7, 27, 53, 0.45) 0%, rgba(7, 27, 53, 0.05) 45%, rgba(7, 27, 53, 0.88) 100%); pointer-events: none;"></div>
      
      <!-- Top verified badge -->
      <div style="position: absolute; top: 12px; left: 12px; display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: rgba(7, 27, 53, 0.82); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.18); color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: #FF5A1F; box-shadow: 0 0 8px #FF5A1F; display: inline-block;"></span>
        <span>Depoimento Real</span>
      </div>

      <!-- Verified Student Badge (Top Right) -->
      <div style="position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 999px; background: rgba(37, 211, 102, 0.18); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(37, 211, 102, 0.35); color: #25D366; font-size: 11px; font-weight: 800;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <span>Aprovada</span>
      </div>

      <!-- Glowing Center Play Button -->
      <div class="video-facade-play" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" style="width: 30px; height: 30px; margin-left: 4px;">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>

      <!-- Bottom Play CTA Overlay -->
      <div style="position: absolute; bottom: 16px; left: 12px; right: 12px; text-align: center; pointer-events: none;">
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; background: rgba(7, 27, 53, 0.88); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 90, 31, 0.45); color: #ffffff; font-size: 12px; font-weight: 800; box-shadow: 0 4px 14px rgba(0,0,0,0.4);">
          <span style="color: #FF5A1F; font-size: 10px;">▶</span>
          <span>CLIQUE PARA ASSISTIR</span>
        </div>
      </div>
    </div>
  `;

  function startVideo() {
    videoWrapper.innerHTML = `
      <iframe 
        class="w-full h-full border-0" 
        src="https://www.youtube-nocookie.com/embed/jinexB5AnBg?autoplay=1&playsinline=1&rel=0&modestbranding=1" 
        title="Depoimento Plano Aprovação CNH" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen="true"
        style="width: 100%; height: 100%; border: 0; border-radius: inherit; display: block;">
      </iframe>
    `;
  }

  const card = videoWrapper.querySelector(".video-facade-card");
  if (card) {
    card.addEventListener("click", startVideo);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startVideo();
      }
    });
  }

  return true;
}

function replaceMaterialSection() {
  const currentSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return !section.classList.contains("material-section") &&
      !section.classList.contains("cnh-plan-system-section") &&
      text.includes("Dentro do plano") &&
      text.includes("TUDO ORGANIZADO.");
  });

  const problemSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return text.includes("REPROVAR DE NOVO CUSTA") &&
      text.includes("Mais taxas do Detran");
  });

  if (!currentSection || !problemSection) return false;
  const matSec = createMaterialSection();
  problemSection.replaceWith(matSec);
  currentSection.remove();

  if (!document.querySelector(".cnh-plan-system-section") && matSec.parentElement) {
    matSec.parentElement.insertBefore(createPlanSystemSection(), matSec);
  }

  insertPlatformSection();
  enhancePlanSection();
  enhanceFaqSection();
  setupRevealAnimations();
  return true;
}

function optimizeImagesSmoothly() {
  const images = document.querySelectorAll("img");
  if (!images.length) return;

  const isHeroImage = (src) => src.includes("logo-novo") || src.includes("hero-photo") || src.includes("logo-badge");

  images.forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (isHeroImage(src)) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
    } else {
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    }
  });
}

const CNH_MAIN_CHECKOUT_URL = "https://ggcheckout.app/checkout/v5/cqXuS3l8MVTxF4UyzST9";
const CNH_BACK_REDIRECT_CHECKOUT_URL = "https://ggcheckout.app/checkout/v5/kQMvWStj4GmaMJnhJsb7";

function decorateCheckoutUrl(baseUrl) {
  try {
    const targetUrl = new URL(baseUrl);
    
    // 1. Merge all query parameters from current page URL (UTMs, src, sck, etc.)
    if (window.location.search) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.forEach((value, key) => {
        if (value) targetUrl.searchParams.set(key, value);
      });
    }

    // 2. Check for UTMify or common UTM session/local storage
    const trackingKeys = [
      "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
      "src", "sck", "xcod", "fbclid", "gclid", "ttclid", "utmify_lead"
    ];
    trackingKeys.forEach((key) => {
      if (!targetUrl.searchParams.has(key)) {
        const storedVal = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (storedVal) targetUrl.searchParams.set(key, storedVal);
      }
    });

    // 3. Inherit any decorated params if UTMify decorated existing anchors
    const decoratedAnchor = document.querySelector("a[href*='ggcheckout.app'], a[href*='pay.wiapy.com']");
    if (decoratedAnchor && decoratedAnchor.href && decoratedAnchor.href.includes("?")) {
      try {
        const anchorUrl = new URL(decoratedAnchor.href);
        anchorUrl.searchParams.forEach((value, key) => {
          if (value) targetUrl.searchParams.set(key, value);
        });
      } catch (e) {}
    }

    return targetUrl.toString();
  } catch (err) {
    const search = window.location.search || "";
    if (search) {
      const sep = baseUrl.includes("?") ? "&" : "?";
      return baseUrl + sep + search.replace(/^\?/, "");
    }
    return baseUrl;
  }
}

function getMainCheckoutUrlWithParams() {
  return decorateCheckoutUrl(CNH_MAIN_CHECKOUT_URL);
}

function getBackRedirectCheckoutUrlWithParams() {
  return decorateCheckoutUrl(CNH_BACK_REDIRECT_CHECKOUT_URL);
}

function syncCheckoutLinks() {
  try {
    const mainUrl = getMainCheckoutUrlWithParams();
    const backUrl = getBackRedirectCheckoutUrlWithParams();

    // 1. Sync main offer button and final checkout triggers
    document.querySelectorAll("#oferta-checkout-btn, [data-final-checkout='true']").forEach((el) => {
      if (el.tagName === "A") {
        el.setAttribute("href", mainUrl);
      }
    });

    // 2. Sync back redirect button
    document.querySelectorAll("#cnh-back-accept-btn, .cnh-back-cta-btn").forEach((el) => {
      if (el.tagName === "A") {
        el.setAttribute("href", backUrl);
      }
    });

    // 3. Any other checkout links
    document.querySelectorAll("a[href*='ggcheckout.app'], a[href*='pay.wiapy.com']").forEach((el) => {
      if (el.id === "cnh-back-accept-btn" || el.closest("#cnh-back-redirect-modal")) {
        el.setAttribute("href", backUrl);
      } else {
        el.setAttribute("href", mainUrl);
      }
    });
  } catch (e) {}
}

function redirectToCheckout(e) {
  const finalUrl = getMainCheckoutUrlWithParams();

  // Try to fire InitiateCheckout for any active pixel trackers
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", "InitiateCheckout");
    }
  } catch (err) {}

  try {
    if (typeof window.ttq === "object" && typeof window.ttq.track === "function") {
      window.ttq.track("InitiateCheckout");
    }
  } catch (err) {}

  const targetAnchor = e && e.target ? e.target.closest("a") : null;
  if (targetAnchor) {
    targetAnchor.setAttribute("href", finalUrl);
  }

  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  try {
    if (window.top && window.top !== window) {
      window.top.location.href = finalUrl;
      return;
    }
  } catch (err) {
    try {
      window.open(finalUrl, "_blank");
      return;
    } catch (e2) {}
  }

  window.location.href = finalUrl;
}

function scrollToOffer(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
  }

  // Force synchronous full rendering of all injected sections immediately
  try {
    runOptimizations();
  } catch (err) {}

  // Clean any old React duplicate offer section to prevent conflict
  const oldReactOffer = [...document.querySelectorAll("section#oferta")].find(
    (sec) => !sec.classList.contains("cnh-main-offer-section")
  );
  if (oldReactOffer) {
    oldReactOffer.remove();
  }

  const getTarget = () => {
    return document.getElementById("cnh-offer-pricing-card") ||
           document.querySelector(".cnh-offer-card-wrapper") ||
           document.querySelector(".cnh-main-offer-section") ||
           document.getElementById("oferta");
  };

  const targetCard = getTarget();

  if (targetCard) {
    try {
      targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      const rect = targetCard.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: Math.max(0, rect.top + scrollTop - 16),
        behavior: "smooth"
      });
    }

    // Accurate multi-frame alignment loop to counteract any mobile reflow / image lazy loading
    const alignDelays = [60, 160, 320, 520, 800, 1100];
    alignDelays.forEach((delay) => {
      setTimeout(() => {
        const currentTarget = getTarget();
        if (currentTarget) {
          const rect = currentTarget.getBoundingClientRect();
          // If element top is off by more than 28px from desired position (-16px)
          if (Math.abs(rect.top - 16) > 28) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({
              top: Math.max(0, rect.top + scrollTop - 16),
              behavior: delay > 500 ? "smooth" : "auto"
            });
          }
        }
      }, delay);
    });
  } else {
    window.location.hash = "#oferta";
  }
}

function setupGlobalNavigation() {
  const handleNavClick = (e) => {
    // 1. Final decision button inside #oferta (the price card) triggers checkout
    const checkoutBtn = e.target.closest("#oferta-checkout-btn, [data-final-checkout='true']");
    if (checkoutBtn) {
      redirectToCheckout(e);
      return;
    }

    // 2. Ignore non-commercial interactions:
    // - Video player facade & iframe
    if (e.target.closest(".video-facade-card") || e.target.closest("#depoimento-video iframe")) {
      return;
    }
    // - FAQ accordion collapse/expand question triggers
    if (e.target.closest(".space-y-2") && (e.target.closest("button.text-left") || e.target.closest(".faq-title-btn"))) {
      return;
    }
    // - Interactive motivation multi-select checkbox items
    if (e.target.closest(".cnh-motivation-option")) {
      return;
    }
    // - Toast notification or social proof
    if (e.target.closest(".toast") || e.target.closest("#cnh-social-proof-toast")) {
      return;
    }

    // - Back redirect modal elements
    if (e.target.closest("#cnh-back-redirect-modal") || e.target.closest(".cnh-back-modal-dialog")) {
      return;
    }

    // 3. ALL other buttons & commercial CTAs on the page scroll smoothly to #oferta
    const commercialBtn = e.target.closest("button, a, .material-section__cta-button, .cnh-motivation-cta, .cnh-bonus-cta-btn, [data-scroll-to-offer]");
    if (commercialBtn) {
      // Allow external policy/terms links if any
      const href = commercialBtn.getAttribute("href") || "";
      if (href.startsWith("http") && !href.includes("wiapy") && !href.includes("ggcheckout") && !commercialBtn.classList.contains("btn-checkout-trigger")) {
        return;
      }
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      scrollToOffer(e);
    }
  };

  document.addEventListener("click", handleNavClick, true);
}

// ================= BACK REDIRECT MODAL ENGINE (PLANO APROVAÇÃO CNH 2026) =================
function injectBackRedirectStyles() {
  if (document.getElementById("cnh-back-redirect-styles")) return;

  const style = document.createElement("style");
  style.id = "cnh-back-redirect-styles";
  style.textContent = `
    @keyframes cnhBackOverlayFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes cnhBackModalPopIn {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes cnhModalGentlePulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 20px 48px -8px rgba(7, 27, 53, 0.28), 0 8px 18px -4px rgba(7, 27, 53, 0.12), 0 0 0 1px rgba(255, 90, 31, 0.4);
      }
      50% {
        transform: scale(1.025);
        box-shadow: 0 26px 58px -6px rgba(7, 27, 53, 0.36), 0 12px 28px -4px rgba(255, 90, 31, 0.28), 0 0 0 2px rgba(255, 90, 31, 0.65);
      }
    }

    @keyframes cnhPricePulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.06);
      }
    }

    @keyframes cnhSubtleCtaPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.015);
      }
    }

    .cnh-back-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      padding: 12px;
      box-sizing: border-box;
      animation: cnhBackOverlayFadeIn 180ms ease forwards;
    }

    .cnh-back-modal-dialog {
      position: relative;
      width: 100%;
      max-width: 420px;
      background: #FAF7F0;
      border: 1px solid rgba(255, 90, 31, 0.45);
      border-radius: 20px;
      padding: 1.35rem 1.25rem 1.1rem;
      box-shadow: 0 20px 48px -8px rgba(7, 27, 53, 0.28), 0 8px 18px -4px rgba(7, 27, 53, 0.12), 0 0 0 1px rgba(255, 90, 31, 0.4);
      text-align: center;
      box-sizing: border-box;
      animation: cnhBackModalPopIn 200ms ease-out forwards, cnhModalGentlePulse 2.6s ease-in-out 240ms infinite;
    }

    @media (max-width: 640px) {
      .cnh-back-modal-dialog {
        width: calc(100% - 20px);
        max-width: 390px;
        padding: 1.2rem 1rem 0.95rem;
        border-radius: 18px;
      }
    }

    .cnh-back-headline {
      font-family: 'Oswald', 'Bebas Neue', 'Roboto Condensed', Arial, sans-serif;
      font-size: clamp(1.45rem, 5.2vw, 1.75rem);
      font-weight: 900;
      line-height: 1.02;
      color: #071B35;
      text-transform: uppercase;
      margin: 0 0 0.45rem;
      letter-spacing: -0.01em;
    }

    .cnh-back-headline .cnh-highlight-orange {
      color: #FF5A1F;
      display: inline-block;
    }

    .cnh-back-anchor {
      font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif;
      font-size: clamp(0.72rem, 2.4vw, 0.8rem);
      font-weight: 600;
      color: #5F6673;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0 0 0.8rem;
      line-height: 1.35;
    }

    .cnh-back-pricing-box {
      background: transparent;
      border: none;
      border-top: 1px solid rgba(7, 21, 47, 0.12);
      border-bottom: 1px solid rgba(7, 21, 47, 0.12);
      border-radius: 0;
      padding: 9px 0 10px;
      margin: 0 0 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: none;
      box-sizing: border-box;
      text-align: center;
      width: 100%;
    }

    .cnh-back-old-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      margin-bottom: 6px;
    }

    .cnh-back-old-label {
      font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #8C929D;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      line-height: 1;
    }

    .cnh-back-old-value {
      font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #8C929D;
      text-decoration: line-through;
      line-height: 1.15;
      letter-spacing: 0.01em;
    }

    .cnh-back-now-label {
      font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #07152F;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1;
      margin-bottom: 2px;
    }

    .cnh-back-main-price {
      font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif;
      font-size: clamp(2.6rem, 8.8vw, 2.95rem);
      font-weight: 900;
      color: #07152F;
      line-height: 0.98;
      letter-spacing: -0.02em;
      display: block;
      margin-bottom: 6px;
      white-space: nowrap;
    }

    .cnh-back-discount-tag {
      background: #ECF9F0;
      color: #14823B;
      border: 1px solid #AFE6BF;
      font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 11px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      white-space: nowrap;
    }

    .cnh-back-body-text {
      font-family: 'Plus Jakarta Sans', Inter, -apple-system, sans-serif;
      font-size: clamp(0.76rem, 2.4vw, 0.82rem);
      color: #5F6673;
      line-height: 1.48;
      margin: 0 0 0.85rem;
      text-align: center;
      text-wrap: balance;
    }

    .cnh-back-body-text strong {
      color: #071B35;
      font-weight: 700;
    }

    .cnh-back-cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 52px;
      padding: 0.75rem 1rem;
      background: #FF5A1F;
      color: #FFFFFF !important;
      font-family: 'Oswald', 'Bebas Neue', Arial, sans-serif;
      font-size: clamp(0.98rem, 3.2vw, 1.1rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      border: none;
      border-radius: 14px;
      box-shadow: 0 8px 20px rgba(255, 90, 31, 0.20);
      cursor: pointer;
      text-decoration: none;
      box-sizing: border-box;
      transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
      animation: cnhSubtleCtaPulse 3s ease-in-out infinite;
    }

    .cnh-back-cta-btn:hover {
      transform: translateY(-1px);
      background: #E84E18;
      box-shadow: 0 10px 24px rgba(255, 90, 31, 0.30);
    }

    .cnh-back-cta-btn:active {
      transform: scale(0.985);
    }

    .cnh-back-refusal-btn {
      display: block;
      width: 100%;
      margin-top: 0.55rem;
      background: transparent;
      border: none;
      color: #64748B;
      font-family: 'Plus Jakarta Sans', Inter, Arial, sans-serif;
      font-size: clamp(0.68rem, 2.1vw, 0.74rem);
      font-weight: 700;
      text-align: center;
      cursor: pointer;
      padding: 0.35rem 0.2rem;
      transition: color 150ms ease, text-decoration-color 150ms ease;
      text-decoration: underline;
      text-decoration-color: #64748B;
      text-underline-offset: 3px;
      letter-spacing: 0.01em;
    }

    .cnh-back-refusal-btn:hover {
      color: #071B35;
      text-decoration-color: #071B35;
    }

    @media (prefers-reduced-motion: reduce) {
      .cnh-back-modal-overlay,
      .cnh-back-modal-dialog,
      .cnh-back-cta-btn {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function openBackRedirectModal() {
  if (document.getElementById("cnh-back-redirect-modal")) return;

  injectBackRedirectStyles();

  const overlay = document.createElement("div");
  overlay.id = "cnh-back-redirect-modal";
  overlay.className = "cnh-back-modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "cnh-back-title");

  const finalCheckoutUrl = getBackRedirectCheckoutUrlWithParams();

  overlay.innerHTML = `
    <div class="cnh-back-modal-dialog">
      <h3 id="cnh-back-title" class="cnh-back-headline">
        VAI DEIXAR SUA PREPARAÇÃO <span class="cnh-highlight-orange">PARA DEPOIS?</span>
      </h3>

      <p class="cnh-back-anchor">
        ANTES DE VOCÊ SAIR, LIBERAMOS UMA CONDIÇÃO ESPECIAL
      </p>

      <div class="cnh-back-pricing-box">
        <div class="cnh-back-old-group">
          <span class="cnh-back-old-label">ANTES</span>
          <span class="cnh-back-old-value">R$ 27,90</span>
        </div>
        <span class="cnh-back-now-label">AGORA POR</span>
        <span class="cnh-back-main-price">R$ 15,90</span>
        <div class="cnh-back-discount-tag">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#14823B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>ECONOMIZE 50%</span>
        </div>
      </div>

      <p class="cnh-back-body-text">
        Chegar à prova ainda cometendo erros pode custar caro. Como você estava saindo, reduzimos para <strong>R$ 15,90</strong> para você reforçar sua preparação, corrigir pontos fracos e evitar repetir os mesmos erros na prova.
      </p>

      <a href="${finalCheckoutUrl}" class="cnh-back-cta-btn" id="cnh-back-accept-btn" role="button" target="_self">
        GARANTIR MEU PLANO POR R$ 15,90
      </a>

      <button type="button" class="cnh-back-refusal-btn" id="cnh-back-refusal-btn">
        PREFIRO CHEGAR MENOS PREPARADO À PROVA
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  try {
    document.body.style.overflow = "hidden";
  } catch (e) {}

  const closeModal = () => {
    try {
      document.body.style.overflow = "";
    } catch (e) {}
    overlay.remove();
  };

  const acceptBtn = overlay.querySelector("#cnh-back-accept-btn");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      const liveUrl = getBackRedirectCheckoutUrlWithParams();
      acceptBtn.setAttribute("href", liveUrl);
      try {
        if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout");
        if (typeof window.ttq === "object" && typeof window.ttq.track === "function") window.ttq.track("InitiateCheckout");
      } catch (err) {}
    });
  }

  // Close modal and stay on site
  const refusalBtn = overlay.querySelector("#cnh-back-refusal-btn");
  if (refusalBtn) {
    refusalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  // Allow clicking on overlay background to close and stay on site
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}

// Expose globally for manual testing if desired
window.openBackRedirectModal = openBackRedirectModal;

let hasTriggeredBackModal = false;

function initBackRedirectEngine() {
  if (window.__cnhBackRedirectInitialized) return;
  window.__cnhBackRedirectInitialized = true;

  const pushGuard = () => {
    if (hasTriggeredBackModal) return;
    try {
      window.history.pushState({ cnh_back_guard: true }, document.title, window.location.href);
    } catch (err) {}
  };

  // Push immediately and with scheduled intervals
  pushGuard();
  setTimeout(pushGuard, 150);
  setTimeout(pushGuard, 400);
  setTimeout(pushGuard, 1000);

  // User interactions guarantee mobile browser history stack registration
  const onInteraction = () => {
    pushGuard();
  };
  ["touchstart", "touchend", "scroll", "click", "pointerdown"].forEach((evt) => {
    window.addEventListener(evt, onInteraction, { passive: true });
  });

  // Desktop exit intent
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY <= 8 && !hasTriggeredBackModal && !document.getElementById("cnh-back-redirect-modal")) {
      hasTriggeredBackModal = true;
      openBackRedirectModal();
    }
  });

  // Intercept back button / swipe back gesture
  window.addEventListener("popstate", () => {
    const existingModal = document.getElementById("cnh-back-redirect-modal");
    
    // If modal is currently open and user presses back, dismiss modal and return to page
    if (existingModal) {
      try {
        document.body.style.overflow = "";
      } catch (err) {}
      existingModal.remove();
      return;
    }

    // First back press -> trigger modal
    if (!hasTriggeredBackModal) {
      hasTriggeredBackModal = true;
      openBackRedirectModal();
      try {
        // Push a state so pressing back while viewing the modal will close it cleanly
        window.history.pushState({ cnh_modal_open: true }, document.title, window.location.href);
      } catch (err) {}
      return;
    }
  });
}

initBackRedirectEngine();

setupGlobalNavigation();

let materialReplaced = false;
let videoOptimized = false;

function runOptimizations() {
  removeUnwantedRecebeSection();
  optimizeImagesSmoothly();
  enhanceBenefitsSection();
  enhanceProblemEmblems();
  insertPlatformSection();
  if (!materialReplaced) {
    materialReplaced = replaceMaterialSection();
  }
  const matSec = document.querySelector(".material-section");
  if (matSec && !document.querySelector(".cnh-plan-system-section") && matSec.parentElement) {
    matSec.parentElement.insertBefore(createPlanSystemSection(), matSec);
  }
  if (!videoOptimized) {
    videoOptimized = enhanceVideoDepoimento();
  }
}

const observer = new MutationObserver(runOptimizations);
observer.observe(document.documentElement, { childList: true, subtree: true });

// Run immediately and upon idle
runOptimizations();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runOptimizations);
}
setTimeout(runOptimizations, 250);
setTimeout(runOptimizations, 800);

import("/assets/index-CIt76HRX.js");