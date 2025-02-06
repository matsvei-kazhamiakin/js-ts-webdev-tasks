import { api } from '../../services/api';
import { Product } from '../../types';

interface CategoryPageState {
  products: Product[];
  filteredProducts: Product[];
  selectedBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortOrder: 'ascending' | 'descending' | null;
  isFilterPanelOpen: boolean;
}

export class CategoryPage {
  private element: HTMLElement;
  private state: CategoryPageState;
  private categoryName: string;

  constructor(categoryName: string) {
    this.element = document.createElement('main');
    this.element.classList.add('category-page');
    this.categoryName = categoryName;
    
    this.state = {
      products: [],
      filteredProducts: [],
      selectedBrands: [],
      priceRange: {
        min: 10,
        max: 2000
      },
      sortOrder: null,
      isFilterPanelOpen: false
    };

    this.render();
    this.loadProducts();
  }

  private getProductPrice(product: Product): number {
    return product.discountPercentage > 0 
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : product.price;
  }

  private async loadProducts(): Promise<void> {
    try {
      const response = await api.getProductsByCategory(this.categoryName);
      this.state.products = response.products;
      this.state.filteredProducts = [...this.state.products];
      this.render();
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  private getBrands(): string[] {
    return Array.from(new Set(this.state.products.map(product => product.brand)));
  }

  private renderProductCard(product: Product): string {
    const hasDiscount = product.discountPercentage > 0;
    const discountedPrice = hasDiscount 
      ? Math.round(product.price * (1 - product.discountPercentage / 100)) 
      : null;
    
    const isRealDiscount = hasDiscount && discountedPrice && discountedPrice < product.price;
    
    const rating = Math.round(product.rating * 2) / 2;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return `
      <a href="/product/${product.id}" class="product-card">
        <div class="product-card__image">
          <img src="${product.thumbnail}" alt="${product.title}">
        </div>
        <h3 class="product-card__title">${product.title}</h3>
        <div class="product-card__rating">
          <div class="rating-stars">
            ${Array(Math.ceil(rating)).fill(0).map((_, i) => {
              if (i < fullStars) {
                return `<img src="/assets/icons/fullstar.svg" alt="Full Star" class="star-icon">`;
              }
              if (i === fullStars && hasHalfStar) {
                return `<img src="/assets/icons/halfstar.svg" alt="Half Star" class="star-icon">`;
              }
              return '';
            }).join('')}
          </div>
          <span class="rating-value">${rating}/5</span>
        </div>
        <div class="product-card__price">
          <span class="current-price">$${isRealDiscount ? discountedPrice : product.price}</span>
          ${isRealDiscount ? `
            <span class="old-price">$${product.price}</span>
            <span class="product-card__discount">-${Math.round(product.discountPercentage)}%</span>
          ` : ''}
        </div>
      </a>
    `;
  }

  private formatCategoryName(name: string): string {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private applyFilters(): void {
    let filtered = [...this.state.products];

    if (this.state.selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        this.state.selectedBrands.includes(product.brand)
      );
    }

    filtered = filtered.filter(product => {
      const actualPrice = this.getProductPrice(product);
      return actualPrice >= this.state.priceRange.min && actualPrice <= this.state.priceRange.max;
    });

    if (this.state.sortOrder) {
      filtered.sort((a, b) => {
        const priceA = this.getProductPrice(a);
        const priceB = this.getProductPrice(b);
        return this.state.sortOrder === 'ascending' ? priceA - priceB : priceB - priceA;
      });
    }

    this.state.filteredProducts = filtered;
    this.updateProductList();
  }

  private updateProductList(): void {
    const productsContainer = this.element.querySelector('.category-page__products');
    if (productsContainer) {
      productsContainer.innerHTML = this.state.filteredProducts.map(product => 
        this.renderProductCard(product)
      ).join('');
    }
  }

  private async resetFilters(): Promise<void> {
    this.state.selectedBrands = [];
    this.state.priceRange = { min: 10, max: 2000 };
    this.state.sortOrder = null;
    
    this.state.filteredProducts = [...this.state.products];
    this.render();
  }

  private toggleFilterPanel(): void {
    this.state.isFilterPanelOpen = !this.state.isFilterPanelOpen;
    this.render();
  }

  private render(): void {
    const formattedCategoryName = this.formatCategoryName(this.categoryName);
    const brands = this.getBrands();

    this.element.innerHTML = `
      <div class="container">
        <div class="category-page__header">
          <div class="category-page__breadcrumbs">
            <a href="/" class="breadcrumb-link">Home</a>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">${formattedCategoryName}</span>
          </div>
          <button class="category-page__filter-toggle" aria-label="Toggle filters">
            <img src="assets/icons/filter.svg" alt="Filter">
          </button>
        </div>

        <div class="category-page__content">
          <aside class="category-page__sidebar ${this.state.isFilterPanelOpen ? 'is-open' : ''}">
            <div class="filters">
              <div class="filters__header">
                <h2 class="filters__title">Filters</h2>
                <button class="filters__close" aria-label="Close filters">
                  <img src="assets/icons/close.svg" alt="Close">
                </button>
              </div>

              <div class="filters__section">
                <h3 class="filters__section-title">Sort</h3>
                <div class="filters__sort">
                  <label class="filters__sort-option">
                    <input 
                      type="radio" 
                      name="sort" 
                      value="ascending"
                      ${this.state.sortOrder === 'ascending' ? 'checked' : ''}
                    >
                    <span>Ascending</span>
                  </label>
                  <label class="filters__sort-option">
                    <input 
                      type="radio" 
                      name="sort" 
                      value="descending"
                      ${this.state.sortOrder === 'descending' ? 'checked' : ''}
                    >
                    <span>Descending</span>
                  </label>
                </div>
              </div>

              <div class="filters__section">
                <h3 class="filters__section-title">Brands</h3>
                <div class="filters__brands">
                  ${brands.map(brand => `
                    <label class="filters__brand">
                      <input 
                        type="checkbox" 
                        value="${brand}"
                        ${this.state.selectedBrands.includes(brand) ? 'checked' : ''}
                      >
                      <span>${brand}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <div class="filters__section">
                <h3 class="filters__section-title">Price</h3>
                <div class="filters__price">
                  <div class="filters__price-range">
                    <div class="price-slider__track"></div>
                    <div class="price-slider__range"></div>
                    <input 
                      type="range" 
                      min="10" 
                      max="2000" 
                      value="${this.state.priceRange.min}"
                      class="price-slider price-slider--min"
                    >
                    <input 
                      type="range" 
                      min="10" 
                      max="2000" 
                      value="${this.state.priceRange.max}"
                      class="price-slider price-slider--max"
                    >
                    <div class="filters__price-values">
                      <span>$${this.state.priceRange.min}</span>
                      <span>$${this.state.priceRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="filters__actions">
                <button class="filters__apply">Apply Filter</button>
                <button class="filters__reset">Reset Filter</button>
              </div>
            </div>
          </aside>

          <div class="category-page__products">
            ${this.state.filteredProducts.map(product => 
              this.renderProductCard(product)
            ).join('')}
          </div>
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  private initEventListeners(): void {
    const filterToggle = this.element.querySelector('.category-page__filter-toggle');
    const filterClose = this.element.querySelector('.filters__close');
    
    filterToggle?.addEventListener('click', () => this.toggleFilterPanel());
    filterClose?.addEventListener('click', () => this.toggleFilterPanel());

    const brandCheckboxes = this.element.querySelectorAll('.filters__brand input');
    brandCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const brand = (e.target as HTMLInputElement).value;
        
        if ((e.target as HTMLInputElement).checked) {
          this.state.selectedBrands.push(brand);
        } else {
          this.state.selectedBrands = this.state.selectedBrands.filter(b => b !== brand);
        }
      });
    });

    const minSlider = this.element.querySelector('.price-slider--min') as HTMLInputElement;
    const maxSlider = this.element.querySelector('.price-slider--max') as HTMLInputElement;
    const range = this.element.querySelector('.price-slider__range') as HTMLElement;

    const updateSliderRange = () => {
      const min = parseInt(minSlider.value);
      const max = parseInt(maxSlider.value);
      
      const trackWidth = minSlider.offsetWidth - 20;
      
      const minPercent = ((min - 10) / (2000 - 10));
      const maxPercent = ((max - 10) / (2000 - 10));
      
      const minPos = minPercent * trackWidth;
      const maxPos = maxPercent * trackWidth;
      
      range.style.left = `${minPos + 10}px`;
      range.style.width = `${maxPos - minPos}px`;

      const minValue = this.element.querySelector('.filters__price-values span:first-child') as HTMLElement;
      const maxValue = this.element.querySelector('.filters__price-values span:last-child') as HTMLElement;
      
      if (minValue && maxValue) {
        minValue.textContent = `$${min}`;
        maxValue.textContent = `$${max}`;
      }

      this.state.priceRange.min = min;
      this.state.priceRange.max = max;
    };

    minSlider?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      const maxValue = parseInt(maxSlider.value);
      
      if (value > maxValue) {
        minSlider.value = maxValue.toString();
        return;
      }
      
      updateSliderRange();
    });

    maxSlider?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      const minValue = parseInt(minSlider.value);
      
      if (value < minValue) {
        maxSlider.value = minValue.toString();
        return;
      }
      
      updateSliderRange();
    });

    updateSliderRange();

    const sortInputs = this.element.querySelectorAll('.filters__sort-option input');
    sortInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const value = (e.target as HTMLInputElement).value as 'ascending' | 'descending';
        this.state.sortOrder = value;
      });
    });

    const applyButton = this.element.querySelector('.filters__apply');
    const resetButton = this.element.querySelector('.filters__reset');

    applyButton?.addEventListener('click', () => {
      this.applyFilters();
      if (window.innerWidth < 768) {
        this.toggleFilterPanel();
      }
    });

    resetButton?.addEventListener('click', async () => {
      await this.resetFilters();
      if (window.innerWidth < 768) {
        this.toggleFilterPanel();
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 