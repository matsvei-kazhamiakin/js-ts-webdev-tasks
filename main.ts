import { renderHeroSection } from "./src/Hero/hero";
import { renderGallerySection } from "./src/Gallery/gallery";
import { renderFooterSection } from "./src/Footer/footer";

import LOCALES from "./src/locales.json";

type LocaleKey = keyof typeof LOCALES;

type ILocaleData = typeof LOCALES.en;

const LOADING_TEXT = "Loading...";
const LANG_TOGGLE_ID = "changeLang";

function mockFetchLocale(lang: LocaleKey): Promise<ILocaleData> {
  return new Promise(resolve => 
    setTimeout(() => resolve(LOCALES[lang]), 300)
  );
}

let currentLang: LocaleKey = "en";

async function initPage(lang: LocaleKey) {
  const app = document.getElementById("app");
  if (!app) {
    console.error("App container not found");
    return;
  }

  try {
    app.innerHTML = LOADING_TEXT;
    const localeData = await mockFetchLocale(lang);
    
    app.innerHTML = "";
    const isRTL = lang === "ar";

    renderHeroSection(app, localeData, isRTL);
    renderGallerySection(app, localeData, isRTL);
    renderFooterSection(app, localeData, isRTL);

    setupLanguageToggle(lang);
  } catch (error) {
    console.error("Failed to initialize page:", error);
    app.innerHTML = "Error loading page content";
  }
}

function setupLanguageToggle(currentLang: LocaleKey) {
  const langBtn = document.getElementById(LANG_TOGGLE_ID);
  if (!langBtn) return;

  langBtn.addEventListener("click", () => {
    const newLang: LocaleKey = currentLang === "en" ? "ar" : "en";
    initPage(newLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPage(currentLang);
});
