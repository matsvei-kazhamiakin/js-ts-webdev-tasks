import "./footer.css";

interface ILocaleData {
  phoneText: string;
}

interface ISocialLink {
  href: string;
  src: string;
  alt: string;
}

const SOCIAL_LINKS: ISocialLink[] = [
  { href: "https://www.behance.net", src: "assets/images/behance.png", alt: "Behance" },
  { href: "https://www.figma.com", src: "assets/images/figma.png", alt: "Figma" },
  { href: "https://www.linkedin.com", src: "assets/images/linkedin.png", alt: "Linkedin" },
  { href: "https://www.instagram.com", src: "assets/images/instagram.png", alt: "Instagram" },
  { href: "https://www.youtube.com", src: "assets/images/youtube.png", alt: "Youtube" },
];

const createSocialElement = (social: ISocialLink): HTMLElement => {
  const listItem = document.createElement('div');
  listItem.classList.add('footer-social-item');
  
  const link = document.createElement('a');
  link.href = social.href;
  link.setAttribute('aria-label', social.alt);
  
  const img = document.createElement('img');
  img.src = social.src;
  img.alt = social.alt;
  
  link.appendChild(img);
  listItem.appendChild(link);
  
  return listItem;
};

export function renderFooterSection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean
) {
  const templateEl = document.getElementById("footer-template") as HTMLTemplateElement;
  if (!templateEl) {
    console.error("Footer template not found!");
    return;
  }

  const clone = templateEl.content.cloneNode(true) as DocumentFragment;
  const elements = {
    phoneContent: clone.querySelector(".footer-phone-content"),
    footerRoot: clone.querySelector(".footer"),
    socialList: clone.querySelector<HTMLUListElement>('.footer-social-list')
  };

  if (elements.phoneContent) {
    elements.phoneContent.textContent = locale.phoneText;
  }

  if (elements.footerRoot) {
    elements.footerRoot.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }

  if (elements.socialList) {
    elements.socialList.setAttribute("dir", "ltr");
    SOCIAL_LINKS.forEach(social => {
      const listItem = createSocialElement(social);
      elements.socialList?.appendChild(listItem);
    });
  }

  container.appendChild(clone);
}
