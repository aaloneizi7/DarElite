// Property Listings Data From Supabase ....
const supabaseClient = supabase.createClient(
  "https://dnifvlzjgpxzfsgymioj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuaWZ2bHpqZ3B4emZzZ3ltaW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMTgwNjQsImV4cCI6MjA3MTY5NDA2NH0.v6ZsGq-G1xCjnEzU8hagiF0Pr3-sK5PUHQHlXUi88Sk"
);

let currentLang = localStorage.getItem("lang") || "en";

async function loadProperties(lang) {
  const { data, error } = await supabaseClient
    .from("Property_Data")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  if (!data || data.length === 0) {
    const section = document.querySelector(".page3");
    if (section) section.style.display = "none";
    return;
  }

  const wrapper = document.querySelector(".page3 .mySwiper .swiper-wrapper");
  wrapper.innerHTML = ""; // Clear old slides

  data.forEach((item) => {
    const propName = item[`property_name_${lang}`] || "";
    const locName = item[`location_name_${lang}`] || "";
    const area = item[`area_in_sqm_${lang}`] || "";
    const status = item[`status_${lang}`] || "";
    const price = item[`price_in_sar_${lang}`] || "";
    const imageUrl = item.image_url || "";
    const locationUrl = item.location_url || "#";

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");
    slide.innerHTML = `
          <div class="profile">
            <img src="${imageUrl}" alt="${propName}" />
          </div>
          <div class="profile-content">
            <h3>${propName}</h3>
            <a href="${locationUrl}" target="_blank">
              <i class="ph ph-map-pin"></i> ${locName}
            </a>
            <span><i class="ph ph-squares-four"></i> ${area}</span>
             <h4 class="lang" 
              data-en="Status : ${item.status_en}" 
              data-ar="الحالة : ${item.status_ar}">
              ${
                lang === "ar"
                  ? `الحالة : ${item.status_ar}`
                  : `Status : ${item.status_en}`
              }
          </h4>
          <h3 class="lang" data-en="Price: ${item.price_in_sar_en}" 
              data-ar="السعر : ${item.price_in_sar_ar}">
              ${
                lang === "ar"
                  ? `السعر : ${item.price_in_sar_ar}`
                  : `Price : ${item.price_in_sar_en}`
              }
          </h3>
          </div>
        `;
    wrapper.appendChild(slide);
  });

  if (window.mySwiper) {
    window.mySwiper.destroy(true, true);
  }

  window.mySwiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    allowTouchMove: false,
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (idx, className) =>
        `<span class="${className}">${idx + 1}</span>`,
    },

    // 🔁 Responsive breakpoints
    breakpoints: {
      // ✅ Extra large desktops (≥ 1200px)
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        grid: {
          rows: 3,
          fill: "row",
        },
      },

      // ✅ Medium devices (tablets, 768px - 1199px)
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 3,
          fill: "row",
        },
      },

      // ✅ Small devices (phones, 481px - 767px)
      481: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        grid: {
          rows: 3,
          fill: "row",
        },
      },

      // ✅ Extra small phones (< 480px)
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        grid: {
          rows: 3,
          fill: "row",
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProperties(currentLang);
});

// Language switcher with dynamic data reload
document.addEventListener("DOMContentLoaded", function () {
  const langBtn = document.querySelector(".right button");
  const html = document.documentElement;

  let currentLang = localStorage.getItem("lang") || "en";
  html.setAttribute("lang", currentLang);
  html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  langBtn.textContent = currentLang.toUpperCase();

  // ✅ Update static content on page load
  updateStaticLangContent(currentLang);

  // ✅ Load dynamic properties on page load
  loadProperties(currentLang);

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";

    html.setAttribute("lang", currentLang);
    html.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
    langBtn.textContent = currentLang.toUpperCase();
    localStorage.setItem("lang", currentLang);

    updateStaticLangContent(currentLang);
    loadProperties(currentLang);
  });

  // ✅ Extracted reusable function for static translation
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
});

/// Achievement Card Grid
// 🏆 Load and render achievement cards (static - no language switching)
document.addEventListener("DOMContentLoaded", async function () {
  const { data: achievementRes, error: achievementErr } = await supabaseClient
    .from("Achievement_Data")
    .select("*");

  if (achievementErr) {
    console.error("Supabase error:", achievementErr);
    return;
  }

  const achievementWrapper = document.querySelector(
    ".achievement-section .card-grid"
  );

  if (!achievementRes || achievementRes.length === 0) {
    document.querySelector(".achievement-section").style.display = "none";
    return;
  }

  achievementWrapper.innerHTML = ""; // Clear previous if needed

  achievementRes.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = `url('${item.Card_BackgroundImage_url}')`;

    card.innerHTML = `
      <div class="overlay" style="background: ${item.Overlay_Color};"></div>
      <img src="${item.Logo_Over_Card_url}" alt="Logo" class="card-logo">
    `;

    achievementWrapper.appendChild(card);
  });
});
