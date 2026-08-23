/*
 * The imported project contains a compiled landing-page bundle rather than
 * editable component sources. This adapter replaces only the old
 * "Dentro do plano" section after the bundle renders.
 */

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
            <img class="material-section__book-image" src="/assets/apostila-cnh-2026.png" alt="Apostila Plano Aprovação CNH 2026">
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
  section.querySelector(".material-section__cta-button").addEventListener("click", () => {
    document.getElementById("oferta")?.scrollIntoView({ behavior: "smooth" });
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

const observer = new MutationObserver(() => {
  if (replaceMaterialSection()) observer.disconnect();
});

observer.observe(document.documentElement, { childList: true, subtree: true });
import("/assets/index-v2.js");