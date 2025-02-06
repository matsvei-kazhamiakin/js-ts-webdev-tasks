import { api } from '../../services/api';
import { Product } from '../../types';
import { store } from '../../store';
import { addItem, setCartId } from '../../store/slices/cartSlice';

export class ProductPage {
  private element: HTMLElement;
  private product: Product | null = null;
  private selectedImageIndex: number = 0;
  private quantity: number = 1;
  private stockQuantity: number = 0;

  constructor(productId: string) {
    this.element = document.createElement('main');
    this.element.classList.add('product-page');
    this.loadProduct(productId);
  }

  private async loadProduct(productId: string): Promise<void> {
    try {
      this.product = await api.getProduct(productId);
      this.stockQuantity = await api.getProductStock(productId);
      this.render();
    } catch (error) {
      console.error('Failed to load product:', error);
      this.renderError();
    }
  }

  private async handleAddToCart(): Promise<void> {
    if (!this.product) return;

    if (this.quantity > this.stockQuantity) {
      this.showNotification('Not enough items in stock', true);
      return;
    }

    const cartState = store.getState().cart;
    const productToAdd = {
      id: this.product.id,
      title: this.product.title,
      price: this.product.price,
      quantity: this.quantity,
      total: this.product.price * this.quantity,
      discountPercentage: this.product.discountPercentage,
      discountedPrice: Math.round(this.product.price * (1 - this.product.discountPercentage / 100)),
      thumbnail: this.product.thumbnail
    };

    try {
      if (!cartState.cartId) {
        const newCart = await api.createCart({
          userId: 1,
          products: [productToAdd]
        });
        
        if (!newCart || !newCart.id) {
          throw new Error('Failed to create cart');
        }

        store.dispatch(setCartId(newCart.id.toString()));
        store.dispatch(addItem(productToAdd));
        
        this.showNotification('Product added to cart');
      } else {
        store.dispatch(addItem(productToAdd));
        this.showNotification('Product added to cart');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      this.showNotification('Failed to add product to cart', true);
    }
  }

  private showNotification(message: string, isError: boolean = false): void {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'notification--error' : 'notification--success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  private handleQuantityChange(increment: boolean): void {
    if (increment) {
      this.quantity += 1;
    } else if (this.quantity > 1) {
      this.quantity -= 1;
    }
    this.updateQuantityDisplay();
  }

  private updateQuantityDisplay(): void {
    const quantityElement = this.element.querySelector('.product-quantity__value');
    if (quantityElement) {
      quantityElement.textContent = this.quantity.toString();
    }
  }

  private handleImageClick(index: number): void {
    if (this.selectedImageIndex === index) return;
    this.selectedImageIndex = index;
    this.updateMainImage();
  }

  private updateMainImage(): void {
    if (!this.product) return;
    const mainImage = this.element.querySelector('.product-gallery__main img') as HTMLImageElement;
    if (mainImage) {
      mainImage.src = this.product.images[this.selectedImageIndex];
    }
  }

  private getDiscountedPrice(): number | null {
    if (!this.product) return null;
    return this.product.discountPercentage > 0
      ? Math.round(this.product.price * (1 - this.product.discountPercentage / 100))
      : null;
  }

  private formatCategoryName(name: string): string {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private renderError(): void {
    this.element.innerHTML = `
      <div class="container">
        <div class="product-page__error">
          <h2>Failed to load product</h2>
          <p>Please try again later</p>
          <a href="/" class="product-page__error-button">Return to Homepage</a>
        </div>
      </div>
    `;
  }

  private render(): void {
    if (!this.product) return;
    
    const product = this.product as Product;

    const discountedPrice = this.getDiscountedPrice();
    const hasDiscount = product.discountPercentage > 0 && discountedPrice && discountedPrice < product.price;
    const formattedCategory = this.formatCategoryName(product.category);

    this.element.innerHTML = `
      <div class="container">
        <div class="product-page__breadcrumbs">
          <a href="/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <a href="/category/${product.category}" class="breadcrumb-link">${formattedCategory}</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">${product.title}</span>
        </div>

        <div class="product-page__content">
          <div class="product-gallery">
            <div class="product-gallery__thumbnails">
              ${product.images.map((image, index) => `
                <div class="product-gallery__thumbnail ${index === this.selectedImageIndex ? 'active' : ''}" data-index="${index}">
                  <img src="${image}" alt="${product.title}">
                </div>
              `).join('')}
            </div>
            <div class="product-gallery__main">
              <img src="${product.images[this.selectedImageIndex]}" alt="${product.title}">
            </div>
          </div>

          <div class="product-info">
            <h1 class="product-info__title">${product.title}</h1>
            <div class="product-info__rating">
              <div class="rating-stars">
                ${Array(Math.ceil(product.rating)).fill(0).map((_, i) => {
                  if (i < Math.floor(product.rating)) {
                    return `<img src="/assets/icons/fullstar.svg" alt="Full Star" class="star-icon">`;
                  }
                  if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
                    return `<img src="/assets/icons/halfstar.svg" alt="Half Star" class="star-icon">`;
                  }
                  return '';
                }).join('')}
              </div>
              <span class="rating-value">${product.rating}/5</span>
            </div>

            <div class="product-info__price">
              <span class="current-price">$${discountedPrice || product.price}</span>
              ${hasDiscount ? `
                <span class="old-price">$${product.price}</span>
                <span class="product-info__discount">-${Math.round(product.discountPercentage)}%</span>
              ` : ''}
            </div>

            <p class="product-info__description">${product.description}</p>

            <div class="product-info__brand">
              <span class="product-info__label">Brand</span>
              <span class="product-info__value">${product.brand}</span>
            </div>

            <div class="product-info__stock">
              <span class="product-info__label">In Stock</span>
              <div class="product-info__stock-wrapper">
                <span class="product-info__stock-status">${this.stockQuantity} items</span>
              </div>
            </div>

            <div class="product-info__actions">
              <div class="product-quantity">
                <button class="product-quantity__button" data-action="decrease">-</button>
                <span class="product-quantity__value">${this.quantity}</span>
                <button class="product-quantity__button" data-action="increase">+</button>
              </div>

              <button class="product-info__add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initEventListeners();
  }

  private initEventListeners(): void {
    const thumbnails = this.element.querySelectorAll('.product-gallery__thumbnail');
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => {
        const index = parseInt(thumbnail.getAttribute('data-index') || '0');
        this.handleImageClick(index);
        
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
      });
    });

    const decreaseButton = this.element.querySelector('[data-action="decrease"]');
    const increaseButton = this.element.querySelector('[data-action="increase"]');
    
    decreaseButton?.addEventListener('click', () => this.handleQuantityChange(false));
    increaseButton?.addEventListener('click', () => this.handleQuantityChange(true));

    const addToCartButton = this.element.querySelector('.product-info__add-to-cart');
    addToCartButton?.addEventListener('click', () => this.handleAddToCart());
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 