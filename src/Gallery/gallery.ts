import "./gallery.css";

interface ILocaleData {
  galleryTitle: string;
}

export function renderGallerySection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean
) {
  const gallerySection = document.createElement("section");
  gallerySection.className = "gallery-section";
  gallerySection.setAttribute("dir", isRTL ? "rtl" : "ltr");

  const titleEl = document.createElement("h2");
  titleEl.className = "gallery-title";
  titleEl.textContent = locale.galleryTitle;

  const galleryWrapper = document.createElement("div");
  galleryWrapper.className = "gallery-wrapper";

  const images = [
    "/assets/images/img1.png",
    "/assets/images/img2.png",
    "/assets/images/img3.png",
    "/assets/images/img4.png",
    "/assets/images/img5.png",
    "/assets/images/img6.png",
    "/assets/images/img7.png",
    "/assets/images/img8.png",
    "/assets/images/img9.png",
    "/assets/images/img10.png",
  ];

  images.forEach(imgSrc => {
    const imgEl = document.createElement("img");
    Object.assign(imgEl, {
      src: imgSrc,
      alt: "Halloween memory",
      className: "gallery-img"
    });

    const div = document.createElement("div");
    div.className = "gallery-item";
    div.appendChild(imgEl);
    galleryWrapper.appendChild(div);
  });

  gallerySection.append(titleEl, galleryWrapper);
  container.appendChild(gallerySection);
}
