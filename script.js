// ✅ Property Listings Data From Supabase
const supabaseClient = supabase.createClient(
  "https://dijnbwlvcvdiirzcuzdn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpam5id2x2Y3ZkaWlyemN1emRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDAyNDgsImV4cCI6MjA3MTc3NjI0OH0._R49cw-ypAN0KeaG112VkzK2VZQler-lP6BFJ0GRB0o"
);

let currentLang = localStorage.getItem("lang") || "en";

// ✅ DOM Ready Hook
document.addEventListener("DOMContentLoaded", () => {
  initializeLanguageSwitcher();
  loadProperties(currentLang);
  loadProjects();
  loadAchievements();
});

window.addEventListener("load", () => {
  setTimeout(() => {
    scrollToSectionFromHash();
  }, 300);
});

// ✅ Listen to hash changes (back/forward browser)
window.addEventListener("popstate", scrollToSectionFromHash);

// ✅ Setup Intersection Observer for cards
setupCardAnimations();

async function loadProperties(lang) {
  const { data, error } = await supabaseClient
    .from("Property_Data")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const wrapper = document.querySelector(".page3 .mySwiper .swiper-wrapper");

  if (!data || data.length === 0 || !wrapper) {
    document.querySelector(".page3")?.style.setProperty("display", "none");
    return;
  }

  wrapper.innerHTML = "";

  data.forEach((item) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
      <div class="profile">
        <img src="${item.image_url || ""}" alt="${
      item[`property_name_${lang}`] || ""
    }" />
      </div>
      <div class="profile-content">
        <h3>${item[`property_name_${lang}`] || ""}</h3>
        <a href="${item.location_url || "#"}" target="_blank">
          <i class="ph ph-map-pin"></i> ${item[`location_name_${lang}`] || ""}
        </a>
        <span><i class="ph ph-squares-four"></i> ${
          item[`area_in_sqm_${lang}`] || ""
        }</span>
        <h4 class="lang" 
          data-en="Status : ${item.status_en}" 
          data-ar="الحالة : ${item.status_ar}">
          ${
            lang === "ar"
              ? `الحالة : ${item.status_ar}`
              : `Status : ${item.status_en}`
          }
        </h4>
        <h3 class="lang" 
          data-en="Price: ${item.price_in_sar_en}" 
          data-ar="السعر : ${item.price_in_sar_ar}">
          ${
            lang === "ar"
              ? `السعر : ${item.price_in_sar_ar}`
              : `Price: ${item.price_in_sar_en}`
          }
        </h3>
      </div>
    `;
    wrapper.appendChild(slide);
  });

  if (window.mySwiper) window.mySwiper.destroy(true, true);

  window.mySwiper = new Swiper(".mySwiper", {
    touchStartPreventDefault: false, // disable preventDefault
    passiveListeners: true, // allow passive
    spaceBetween: 30,
    allowTouchMove: false,
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (index, className) =>
        `<span class="${className}">${index + 1}</span>`,
    },
    breakpoints: {
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: { rows: 3, fill: "row" },
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: { rows: 3, fill: "row" },
      },
      481: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: { rows: 3, fill: "row" },
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        grid: { rows: 3, fill: "row" },
      },
    },
  });
}

function initializeLanguageSwitcher() {
  const langBtn = document.querySelector(".right button");
  const html = document.documentElement;

  currentLang = localStorage.getItem("lang") || "en";
  langBtn.textContent = currentLang === "ar" ? "العربية" : "EN";
  html.setAttribute("lang", currentLang);
  html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

  updateStaticLangContent(currentLang);

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";

    localStorage.setItem("lang", currentLang);

    langBtn.textContent = currentLang === "ar" ? "العربية" : "EN";
    html.setAttribute("lang", currentLang);
    html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

    updateStaticLangContent(currentLang);
    loadProperties(currentLang);

    setWhatsappButtonPosition();
  });
}

// Function to set the WhatsApp button position based on current language
function setWhatsappButtonPosition() {
  const lang = document.documentElement.lang || "en"; // Default to "en" if no lang attribute
  const whatsappButton = document.querySelector(".whatsappButton");

  if (lang === "ar") {
    whatsappButton.style.left = "20px";
    whatsappButton.style.right = "auto";
  } else {
    whatsappButton.style.right = "20px";
    whatsappButton.style.left = "auto";
  }
}

// Update content in the selected language
function updateStaticLangContent(lang) {
  document.querySelectorAll(".lang").forEach((el) => {
    const value = el.getAttribute(`data-${lang}`);
    if (!value) return;

    if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
      el.placeholder = value;
    } else {
      el.textContent = value;
    }
  });
}

async function loadAchievements() {
  const { data, error } = await supabaseClient
    .from("Achievement_Data")
    .select("*");

  const section = document.querySelector(".achievement-section");
  const wrapper = section?.querySelector(".card-grid");

  if (error || !data || data.length === 0 || !wrapper) {
    section?.style.setProperty("display", "none");
    return;
  }

  wrapper.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url('${item.Card_BackgroundImage_url}')`;
    card.innerHTML = `
      <div class="overlay" style="background: ${item.Overlay_Color};"></div>
      <img src="${item.Logo_Over_Card_url}" alt="Logo" class="card-logo">
    `;
    wrapper.appendChild(card);
  });
}

async function loadProjects() {
  const { data, error } = await supabaseClient
    .from("Project_Data")
    .select("*")
    .order("created_at", { ascending: false });

  const section = document.querySelector(".project-section");
  const wrapper = section?.querySelector(".projects-list");

  if (error || !data || data.length === 0 || !wrapper) {
    section?.style.setProperty("display", "none");
    return;
  }

  wrapper.innerHTML = "";

  const lang = document.documentElement.lang || "en";

  data.forEach((item) => {
    const projectContainer = document.createElement("div");
    projectContainer.className = "project-item";

    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url('${item.Card_BackgroundImage_url}')`;

    card.innerHTML = `
      <div class="overlay" style="background: ${item.Overlay_Color};"></div>
      <img src="${item.Logo_Over_Card_url}" alt="Logo" class="card-logo">
      <div class="card-content">
        <h3 class="card-title">${item.Title || ""}</h3>
        <p class="card-description">${item.Description || ""}</p>
      </div>
    `;

    const button = document.createElement("button");
    button.className = "card-button lang";
    button.setAttribute("data-en", "View Details");
    button.setAttribute("data-ar", "عرض التفاصيل");
    button.textContent = lang === "ar" ? "عرض التفاصيل" : "View Details";
    button.onclick = () => window.open(item.PDF_File_url, "_blank");

    projectContainer.appendChild(card);
    projectContainer.appendChild(button);

    wrapper.appendChild(projectContainer);
  });
}

// 🚀 Scroll functionality
function decodeUrlSegment(segment) {
  return decodeURIComponent(segment).replace(/-/g, " ").toLowerCase();
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "smooth" });
}

function findTargetIdBySlug(slug, lang) {
  const links = document.querySelectorAll("a[data-en][data-ar]");
  slug = slug.toLowerCase();

  for (const link of links) {
    const label = link
      .getAttribute(`data-${lang}`)
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (label === slug) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) return href.substring(1);
    }
  }
  return null;
}

function scrollToSectionFromHash() {
  const hash = window.location.hash;

  if (hash.startsWith("#/")) {
    const slug = hash.slice(2);
    const sectionId = findTargetIdBySlug(slug, currentLang);
    if (sectionId) scrollToSection(sectionId);
  } else {
    scrollToSection("page1");
  }
}

// 🚀 Handle anchor link clicks with language-aware slugs
document.querySelectorAll("a[data-en][data-ar]").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    // 🔒 Only handle internal hash links (e.g., #page1, #page5)
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const langLabel = link.getAttribute(`data-${currentLang}`);
    if (!langLabel) return;

    const slug = encodeURIComponent(
      langLabel.trim().toLowerCase().replace(/\s+/g, "-")
    );
    const newUrl = `${window.location.pathname}#/${slug}`;
    history.pushState(null, "", newUrl);

    const sectionId = link.getAttribute("href").substring(1);
    scrollToSection(sectionId);
  });
});

// Page2 Card Animations using Intersection Observer
function setupCardAnimations() {
  const card_A = document.querySelectorAll(".infocard");
  const card_B = document.querySelectorAll(".service-card");
  const cards = [...card_A, ...card_B];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach((card) => observer.observe(card));
}
// Adjust Whatsapp Button Position According to Lang
window.addEventListener("DOMContentLoaded", (event) => {
  const lang = document.documentElement.lang || "en";

  const whatsappButton = document.querySelector(".whatsappButton");

  if (lang === "ar") {
    whatsappButton.style.left = "1.5%";
    whatsappButton.style.right = "auto";
  } else {
    whatsappButton.style.right = "1.5%";
    whatsappButton.style.left = "auto";
  }
});

//Call Us
// Show the contact card
// function showContactCard() {
//   document.getElementById("call-overlay").style.display = "block";
//   document.getElementById("contact-card").style.display = "flex";
// }

// Close the contact card
// function closeContactCard() {
//   document.getElementById("call-overlay").style.display = "none";
//   document.getElementById("contact-card").style.display = "none";

//   // Clear error if visible
//   const errorMessage = document.getElementById("call-error");
//   errorMessage.style.display = "none";
//   errorMessage.textContent = "";
// }

// Attempt to make the call
// function makeCall() {
//   const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
//   const errorMessage = document.getElementById("call-error");

//   const lang = document.documentElement.lang || "en";

//   if (isMobile) {
//     errorMessage.style.display = "none";
//     window.location.href = "tel:+966597900000";
//   } else {
//     if (lang === "ar") {
//       errorMessage.innerHTML =
//         "هذا الجهاز لا يدعم المكالمات. يمكنك التواصل معنا عبر الهاتف المحمول، من خلال موقعنا الإلكتروني، أو الاتصال بنا على الرقم <strong style='color: #1b1b32; font-size: 1.2em;' dir='ltr'>+966 59 790 0000</strong>.";
//     } else {
//       errorMessage.innerHTML =
//         "This device does not support calling. You may contact us via mobile, through our website, or by calling us on <strong style='color: #1b1b32; font-size: 1.2em;'>+966 59 790 0000</strong>.";
//     }
//     errorMessage.style.display = "block";
//   }
// }
