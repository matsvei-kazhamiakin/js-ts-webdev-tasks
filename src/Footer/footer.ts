import "./footer.css";

interface ILocaleData {
  phoneText: string;
}

interface ISocialLink {
  href: string;
  icon: string;
  alt: string;
}

const SOCIAL_LINKS: ISocialLink[] = [
  { href: "https://www.behance.net", icon: "assets/images/behance.png", alt: "Behance" },
  { href: "https://www.figma.com", icon: "assets/images/figma.png", alt: "Figma" },
  { href: "https://www.linkedin.com", icon: "assets/images/linkedin.png", alt: "Linkedin" },
  { href: "https://www.instagram.com", icon: "assets/images/instagram.png", alt: "Instagram" },
  { href: "https://www.youtube.com", icon: "assets/images/youtube.png", alt: "Youtube" },
];

export function renderFooterSection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean
) {
  const template = document.getElementById('footer-template') as HTMLTemplateElement;
  if (!template) {
    console.error('Footer template not found!');
    return;
  }

  const footerNode = template.content.cloneNode(true) as DocumentFragment;
  const footer = footerNode.querySelector('.footer') as HTMLElement;
  
  if (isRTL) {
    footer.setAttribute('dir', 'rtl');
  }

  const phoneEl = footer.querySelector('.footer-phone');
  if (phoneEl) {
    phoneEl.textContent = locale.phoneText;
  }

  const socialList = footer.querySelector('.social-list');
  if (socialList) {
    SOCIAL_LINKS.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const img = document.createElement('img');
      
      a.href = link.href;
      img.src = link.icon;
      img.alt = link.alt;
      
      a.appendChild(img);
      li.appendChild(a);
      socialList.appendChild(li);
    });
  }

  container.appendChild(footerNode);
}
