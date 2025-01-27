import "./hero.css";

interface ILocaleData {
  partyTime: string;
  home: string;
  gallery: string;
  aboutParty: string;
  reservation: string;
  contacts: string;
  halloweenPartyTitle: string;
  reservationDate: string;
  phoneText: string;
  languageToggle: string;
}

export function renderHeroSection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean
) {
  const direction = isRTL ? 'dir="rtl"' : "";

  
  const heroHTML = `
    <header class="header" ${direction}>
      <div class="header-container">
        <div class="header-logo" data-i18n="partyTime">${locale.partyTime}</div>
        <nav class="header-nav nav">
          <ul class="nav-list">
            <li class="nav-item"><a href="#" data-i18n="home">${locale.home}</a></li>
            <li class="nav-item"><a href="#" data-i18n="gallery">${locale.gallery}</a></li>
            <li class="nav-item"><a href="#" data-i18n="aboutParty">${locale.aboutParty}</a></li>
            <li class="nav-item"><a href="#" data-i18n="reservation">${locale.reservation}</a></li>
            <li class="nav-item"><a href="#" data-i18n="contacts">${locale.contacts}</a></li>
            <li class="nav-item"><a href="#" id="changeLang" data-i18n="languageToggle">${locale.languageToggle}</a></li>
          </ul>
        </nav>
        <div class="header-button">
          <a href="#" class="button-reservation" data-i18n="reservation">${locale.reservation}</a>
        </div>
      </div>
    </header>

    <main class="hero" ${direction}>
      <section class="party">
        <div class="party-date">
          <div class="party-date-text">
            <img src="/assets/images/calendar.png" class="calendar" alt="Calendar">
            <span data-i18n="reservationDate">${locale.reservationDate}</span>
          </div>
          <h2 class="party-title" data-i18n="halloweenPartyTitle">${locale.halloweenPartyTitle}</h2>
        </div>
        <div class="arrow-down">
          <img src="/assets/images/arrow-down.png" alt="Arrow down" />
        </div>
      </section>
    </main>
  `;

  container.innerHTML += heroHTML;
}
