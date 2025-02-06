import { api } from '../../services/api';

export class Homepage {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('main');
    this.render();
    this.initEventListeners();
    this.loadCategories();
  }

  private render(): void {
    this.element.innerHTML = `
      <section class="hero">
        <div class="container hero__container">
          <div class="hero__content">
            <h1 class="hero__title">
              FIND ANYTHING
              <span>THAT MATCHES</span>
              <span>YOUR STYLE</span>
            </h1>
            <p class="hero__description">Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
            <button class="hero__button" id="shopNow">Shop Now</button>
            <div class="hero__stats">
              <div class="hero__stat">
                <span class="hero__stat-number">200+</span>
                <span class="hero__stat-text">International Brands</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">2,000+</span>
                <span class="hero__stat-text">High-Quality Products</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">30,000+</span>
                <span class="hero__stat-text">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="brands">
        <div class="container brands__container">
          <div class="brands__list">
            <img src="assets/brands/versace.svg" alt="Versace" class="brands__logo">
            <img src="assets/brands/zara.svg" alt="Zara" class="brands__logo">
            <img src="assets/brands/gucci.svg" alt="Gucci" class="brands__logo">
            <img src="assets/brands/prada.svg" alt="Prada" class="brands__logo">
            <img src="assets/brands/calvin-klein.svg" alt="Calvin Klein" class="brands__logo">
          </div>
        </div>
      </section>

      <section class="categories" id="categories">
        <div class="container categories__container">
          <h2 class="categories__title">Categories</h2>
          <div class="categories__grid">
          </div>
        </div>
      </section>
    `;
  }

  private async loadCategories(): Promise<void> {
    const categoriesGrid = this.element.querySelector('.categories__grid');
    if (!categoriesGrid) return;

    try {
      const categories = await api.getCategories();
      const limitedCategories = categories.slice(0, 12);
      
      categoriesGrid.innerHTML = limitedCategories.map(category => `
        <a href="/category/${category.slug}" class="categories__item" data-category="${category.slug}">
          <h3 class="categories__item-title">${this.formatCategoryName(category.name)}</h3>
        </a>
      `).join('');

      this.initCategoryLinks();
    } catch (error) {
      console.error('Failed to load categories:', error);
      categoriesGrid.innerHTML = `
        <div class="categories__error">
          Failed to load categories. 
          <button class="categories__retry-btn" id="retryLoadCategories">Try again</button>
        </div>
      `;

      const retryButton = this.element.querySelector('#retryLoadCategories');
      retryButton?.addEventListener('click', () => {
        categoriesGrid.innerHTML = '<div class="categories__loading">Loading categories...</div>';
        this.loadCategories();
      });
    }
  }

  private initCategoryLinks(): void {
    const categoryLinks = this.element.querySelectorAll('.categories__item');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = (link as HTMLElement).dataset.category;
        if (category) {
          window.location.href = `/category/${category}`;
        }
      });
    });
  }

  private formatCategoryName(category: string): string {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private initEventListeners(): void {
    const shopNowButton = this.element.querySelector('#shopNow');
    shopNowButton?.addEventListener('click', (e) => {
      e.preventDefault();
      const categoriesSection = document.querySelector('#categories');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 