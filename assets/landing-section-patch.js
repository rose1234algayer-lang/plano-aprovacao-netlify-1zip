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

  let detectedLocation = sessionStorage.getItem("geo_location") || "";
  let isFirstNotification = true;

  // Real IP Geolocation retrieval with fallbacks
  function fetchLocation() {
    if (detectedLocation) return;
    fetch("https://ipwho.is/")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.city) {
          const loc = d.region_code ? (d.city + ", " + d.region_code) : (d.region ? (d.city + ", " + d.region) : d.city);
          sessionStorage.setItem("geo_city", d.city);
          sessionStorage.setItem("geo_location", loc);
          detectedLocation = loc;
        } else throw new Error();
      })
      .catch(() => {
        fetch("https://get.geojs.io/v1/ip/geo.json")
          .then(r => r.json())
          .then(d => {
            if (d.city) {
              const loc = d.region ? (d.city + ", " + d.region.substring(0, 2).toUpperCase()) : d.city;
              sessionStorage.setItem("geo_city", d.city);
              sessionStorage.setItem("geo_location", loc);
              detectedLocation = loc;
            }
          })
          .catch(() => {
            fetch("https://ipapi.co/json/")
              .then(r => r.json())
              .then(d => {
                if (d.city) {
                  const loc = d.region_code ? (d.city + ", " + d.region_code) : d.city;
                  sessionStorage.setItem("geo_city", d.city);
                  sessionStorage.setItem("geo_location", loc);
                  detectedLocation = loc;
                }
              }).catch(() => {});
          });
      });
  }

  // Defer location lookup to idle time so initial load is instant
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(fetchLocation, { timeout: 3500 });
  } else {
    setTimeout(fetchLocation, 2500);
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
    const name = getNextName();
    let loc;
    if (isFirstNotification) {
      isFirstNotification = false;
      loc = detectedLocation || sessionStorage.getItem("geo_location") || sessionStorage.getItem("geo_city") || getNextCity();
    } else {
      loc = getNextCity();
    }

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

  // Initial trigger after 2 seconds
  setTimeout(() => {
    showNotification();
  }, 2000);
})();

const materialItems = [
  ["📚", "O QUE REALMENTE IMPORTA NA PROVA", "Revise os principais conteúdos da prova teórica sem se perder em assuntos desnecessários."],
  ["📅", "ROTEIRO DE ESTUDOS EM 7 DIAS", "Siga um cronograma simples para organizar sua preparação mesmo com pouco tempo disponível."],
  ["🎯", "RESUMOS RÁPIDOS E OBJETIVOS", "Encontre os pontos principais de cada conteúdo de forma direta e fácil de revisar."],
  ["🧠", "QUESTÕES COMENTADAS DO DETRAN", "Pratique com questões e entenda melhor o raciocínio por trás de cada resposta."],
  ["📝", "SIMULADO COMPLETO DA PROVA", "Teste seus conhecimentos e descubra quais pontos ainda precisam de mais atenção."],
  ["⏱️", "REVISÃO PARA A RETA FINAL", "Reforce os conteúdos mais importantes antes de chegar ao dia da prova."],
  ["✅", "PREPARAÇÃO ORGANIZADA ATÉ O EXAME", "Saiba o que estudar, revisar e praticar em cada etapa da sua preparação."],
];

function createMaterialSection() {
  const section = document.createElement("section");
  section.className = "material-section";
  section.setAttribute("aria-labelledby", "material-section-title");
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
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "https://pay.wiapy.com/Ejh7VyX6eSxN";
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
      text.includes("Dentro do plano") &&
      text.includes("TUDO ORGANIZADO.");
  });

  const problemSection = [...document.querySelectorAll("section")].find((section) => {
    const text = section.textContent || "";
    return text.includes("REPROVAR DE NOVO CUSTA") &&
      text.includes("Mais taxas do Detran");
  });

  if (!currentSection || !problemSection) return false;
  problemSection.replaceWith(createMaterialSection());
  currentSection.remove();
  enhancePlanSection();
  enhanceFaqSection();
  setupRevealAnimations();
  return true;
}

function optimizeImagesSmoothly() {
  const images = document.querySelectorAll("img");
  if (!images.length) return;

  const isHeroImage = (src) => src.includes("logo-novo") || src.includes("hero-photo") || src.includes("hero_aluna") || src.includes("logo-badge");

  images.forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (isHeroImage(src)) {
      img.setAttribute("fetchpriority", "high");
      img.removeAttribute("loading");
      img.onerror = function() {
        if (!this.getAttribute("data-fallback-tried")) {
          this.setAttribute("data-fallback-tried", "true");
          this.src = "/assets/hero-photo-aluna-2026.jpg";
        }
      };
    } else {
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    }
  });
}

const CHECKOUT_URL = "https://pay.wiapy.com/Ejh7VyX6eSxN";

// Global blocker: Never allow any script or browser call to scroll to oferta
if (typeof Element !== "undefined" && Element.prototype.scrollIntoView) {
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(options) {
    if (this && (this.id === "oferta" || (this.closest && this.closest("#oferta")))) {
      redirectToCheckout();
      return;
    }
    return originalScrollIntoView.apply(this, arguments);
  };
}

function redirectToCheckout(e) {
  if (e) {
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
  }

  try {
    if (window.top && window.top !== window) {
      window.top.location.href = CHECKOUT_URL;
      return;
    }
  } catch (err) {
    // Cross-origin iframe fallback
    try {
      window.open(CHECKOUT_URL, "_blank");
      return;
    } catch (e2) {}
  }

  window.location.href = CHECKOUT_URL;
}

function bindCheckoutButtons() {
  const elements = document.querySelectorAll("button, a, .material-section__cta-button");
  elements.forEach((el) => {
    // Skip FAQ accordion collapse/expand question headers
    if (el.closest(".space-y-2") && el.classList.contains("text-left")) {
      return;
    }
    // Skip video player triggers
    if (el.closest(".video-facade-card") || el.closest("#depoimento-video iframe")) {
      return;
    }
    // Skip toast notifications
    if (el.closest(".toast") || el.closest(".social-proof-toast")) {
      return;
    }

    // Attach direct handler
    el.setAttribute("data-direct-checkout", "true");
    el.onclick = (e) => {
      redirectToCheckout(e);
    };
  });
}

function setupCheckoutHandler() {
  document.addEventListener("click", (e) => {
    // Ignore video facade card or video player triggers
    if (e.target.closest(".video-facade-card") || e.target.closest("#depoimento-video iframe")) {
      return;
    }

    const btn = e.target.closest("button, a, .material-section__cta-button, [data-direct-checkout]");
    if (!btn) return;

    // Ignore FAQ accordion collapse/expand question headers
    if (btn.closest(".space-y-2") && btn.classList.contains("text-left")) {
      return;
    }

    // Ignore toast notification interactions if any
    if (btn.closest(".toast") || btn.closest(".social-proof-toast")) {
      return;
    }

    // Every other button/link on the page goes straight to checkout
    redirectToCheckout(e);
  }, true);
}

setupCheckoutHandler();

let materialReplaced = false;
let videoOptimized = false;

function runOptimizations() {
  optimizeImagesSmoothly();
  bindCheckoutButtons();
  if (!materialReplaced) {
    materialReplaced = replaceMaterialSection();
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

import("/assets/index-checkout-v4.js?v=hero_photo_aluna_2026");