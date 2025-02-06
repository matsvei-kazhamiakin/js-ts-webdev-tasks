import { store } from '../../store';

export class Header {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
    this.element.classList.add('header');
    this.element.setAttribute('role', 'banner');
    this.render();
    this.initEventListeners();
  }

  private render(): void {
    const cartState = store.getState().cart;
    const cartItemsCount = cartState.totalQuantity;

    this.element.innerHTML = `
      <div class="container header__container">
        <a href="/" 
           class="header__logo" 
           aria-label="SHOP.CO - Перейти на главную">SHOP.CO</a>
        <nav class="header__nav" role="navigation" aria-label="Основная навигация">
          <div class="header__actions">
            <a href="/cart" 
               class="header__cart" 
               aria-label="Корзина">
              <img src="/assets/icons/cart.svg" alt="" aria-hidden="true">
              ${cartItemsCount > 0 ? `<span class="header__cart-count">${cartItemsCount}</span>` : ''}
            </a>
            <a href="/account" 
               class="header__account" 
               aria-label="Личный кабинет">
              <img src="/assets/icons/account.svg" alt="" aria-hidden="true">
            </a>
          </div>
        </nav>
      </div>
    `;
  }

  private initEventListeners(): void {
    store.subscribe(() => {
      this.render();
    });

    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const cartLink = target.closest('.header__cart');
      
      if (cartLink) {
        e.preventDefault();
        const cartState = store.getState().cart;
        
        if (cartState.cartId) {
          window.history.pushState({}, '', `/cart/${cartState.cartId}`);
        } else {
          window.history.pushState({}, '', '/cart');
        }
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 