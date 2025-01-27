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
  languageToggle: string;
}

export function renderHeroSection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean
) {
  const heroHTML = `
    <section class="hero" ${isRTL ? 'dir="rtl"' : ''}>
      <header class="header">
        <nav class="nav">
          ${isRTL ? `
            <button class="reservation-btn">${locale.reservation}</button>
            <span id="changeLang">${locale.languageToggle}</span>
            <ul class="nav-list">
              <li><a href="#">${locale.home}</a></li>
              <li><a href="#">${locale.gallery}</a></li>
              <li><a href="#">${locale.aboutParty}</a></li>
              <li><a href="#">${locale.contacts}</a></li>
            </ul>
            <div class="logo">${locale.partyTime}</div>
          ` : `
            <div class="logo">${locale.partyTime}</div>
            <ul class="nav-list">
              <li><a href="#">${locale.home}</a></li>
              <li><a href="#">${locale.gallery}</a></li>
              <li><a href="#">${locale.aboutParty}</a></li>
              <li><a href="#">${locale.contacts}</a></li>
            </ul>
            <div class="nav-right">
              <span id="changeLang">${locale.languageToggle}</span>
              <button class="reservation-btn">${locale.reservation}</button>
            </div>
          `}
        </nav>
      </header>
      <div class="hero-content">
        <div class="date-badge">
          <img src="/assets/images/calendar.png" alt="Calendar">
          <span>${locale.reservationDate}</span>
        </div>
        <h1>${locale.halloweenPartyTitle}</h1>
      </div>
    </section>
  `;
  
  container.innerHTML += heroHTML;
}
