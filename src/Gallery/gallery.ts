import "./gallery.css";

interface ILocaleData {
  galleryTitle: string;
}

// Функция для рендеринга секции галереи
export function renderGallerySection(
  container: HTMLElement,
  locale: ILocaleData,
  isRTL: boolean    
) {
  const section = document.createElement('section');
  section.className = 'gallery';
  if (isRTL) section.setAttribute('dir', 'rtl');

  const title = document.createElement('h2');
  title.textContent = locale.galleryTitle;
  section.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  const images = [
    'img1.png', 'img2.png', 'img3.png', 'img4.png', 'img5.png',
    'img6.png', 'img7.png', 'img8.png', 'img9.png', 'img10.png'
  ];

  images.forEach(img => {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'gallery-item';

    const imgEl = document.createElement('img');
    imgEl.src = `/assets/images/${img}`;
    imgEl.alt = 'Halloween memory';

    imgWrapper.appendChild(imgEl);
    grid.appendChild(imgWrapper);
  });

  section.appendChild(grid);
  container.appendChild(section);
}
