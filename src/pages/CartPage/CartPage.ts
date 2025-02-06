import { store } from '../../store';
import { api } from '../../services/api';
import { removeItem, updateItemQuantity, clearCart, setCartId, addItem } from '../../store/slices/cartSlice';
import { CartProduct } from '../../types';

export class CartPage {
  private element: HTMLElement;

  constructor(params?: { cartId?: string }) {
    this.element = document.createElement('main');
    this.element.classList.add('cart-page');
    
    const cartState = store.getState().cart;
    
    if (params?.cartId && params.cartId !== cartState.cartId) {
      this.loadCart(params.cartId);
    } else if (!params?.cartId && cartState.cartId) {
      window.history.replaceState({}, '', `/cart/${cartState.cartId}`);
      this.render();
    } else if (!cartState.cartId) {
      this.renderEmptyCart();
    } else {
      this.render();
    }
    
    this.initEventListeners();
  }

  private async loadCart(cartId: string): Promise<void> {
    try {
      const cart = await api.getCart(cartId);
      
      store.dispatch(clearCart());
      
      store.dispatch(setCartId(cartId));
      cart.products.forEach(product => {
        store.dispatch(addItem(product));
      });
      
      this.render();
    } catch (error) {
      console.error('Failed to load cart:', error);
      this.renderEmptyCart();
      window.history.replaceState({}, '', '/cart');
    }
  }

  private calculateOrderSummary(items: CartProduct[]) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce((sum, item) => {
      const itemDiscount = (item.price * item.quantity * item.discountPercentage) / 100;
      return sum + itemDiscount;
    }, 0);
    const total = subtotal - discount;
    const discountPercentage = Math.round((discount / subtotal) * 100);

    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      total: Math.round(total),
      discountPercentage
    };
  }

  private async handleRemoveItem(productId: number): Promise<void> {
    const cartState = store.getState().cart;
    if (!cartState.cartId) return;

    try {
      const cartItem = this.element.querySelector(`[data-product-id="${productId}"]`) as HTMLElement;
      if (cartItem) {
        cartItem.style.transition = 'opacity 0.3s ease';
        cartItem.style.opacity = '0';
        
        setTimeout(() => {
          cartItem.remove();
          
          store.dispatch(removeItem(productId));
          const updatedCartState = store.getState().cart;

          if (updatedCartState.items.length === 0) {
            this.renderEmptyCart();
            if (cartState.cartId) {
              api.deleteCart(cartState.cartId).then(() => {
                store.dispatch(clearCart());
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              });
            }
          } else {
            const { subtotal, discount, total, discountPercentage } = this.calculateOrderSummary(updatedCartState.items);
            
            const orderSummary = this.element.querySelector('.order-summary');
            if (orderSummary && cartState.cartId) {
              orderSummary.innerHTML = `
                <h2 class="order-summary__title">Order Summary</h2>
                <div class="order-summary__row">
                  <span>Subtotal</span>
                  <span>$${subtotal}</span>
                </div>
                <div class="order-summary__row">
                  <span>Discount (-${discountPercentage}%)</span>
                  <span class="discount">-$${discount}</span>
                </div>
                <div class="order-summary__row total">
                  <span>Total</span>
                  <span>$${total}</span>
                </div>
                <button class="order-summary__checkout">Go to Checkout</button>
              `;

              api.updateCart(cartState.cartId, {
                products: updatedCartState.items
              });
            }
          }
        }, 300);
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  }

  private async handleQuantityChange(productId: number, newQuantity: number): Promise<void> {
    const cartState = store.getState().cart;
    if (!cartState.cartId) return;

    try {
      if (newQuantity === 0) {
        await this.handleRemoveItem(productId);
        return;
      }

      store.dispatch(updateItemQuantity({ id: productId, quantity: newQuantity }));
      const updatedCartState = store.getState().cart;
      
      await api.updateCart(cartState.cartId, {
        products: updatedCartState.items
      });

      this.render();
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  }

  private handleCheckout(): void {
    const cartState = store.getState().cart;
    if (cartState.cartId) {
      window.history.pushState({}, '', `/checkout/${cartState.cartId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  private renderEmptyCart(): void {
    this.element.innerHTML = `
      <div class="container">
        <div class="cart-page__breadcrumbs">
          <a href="/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Cart</span>
        </div>

        <div class="cart-page__empty">
          <h2 class="cart-page__empty-title">Your cart is empty</h2>
          <p class="cart-page__empty-text">Looks like you haven't added any items to your cart yet</p>
          <a href="/" class="cart-page__empty-button">Continue Shopping</a>
        </div>
      </div>
    `;
  }

  private render(): void {
    const cartState = store.getState().cart;

    if (!cartState.items.length) {
      this.renderEmptyCart();
      return;
    }

    const { subtotal, discount, total, discountPercentage } = this.calculateOrderSummary(cartState.items);

    this.element.innerHTML = `
      <div class="container">
        <div class="cart-page__breadcrumbs">
          <a href="/" class="breadcrumb-link">Home</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Cart</span>
        </div>

        <h1 class="cart-page__title">Your cart</h1>

        <div class="cart-page__content">
          <div class="cart-items">
            ${cartState.items.map(item => `
              <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item__image">
                  <img src="${item.thumbnail}" alt="${item.title}" 
                    onerror="this.onerror=null; this.src='/assets/icons/no-image.svg';">
                </div>
                <div class="cart-item__info">
                  <h3 class="cart-item__title">${item.title}</h3>
                  <div class="cart-item__price">
                    <span class="current-price">$${item.discountedPrice}</span>
                    ${item.discountPercentage > 0 ? `<span class="cart-item__discount">-${Math.round(item.discountPercentage)}%</span>` : ''}
                  </div>
                </div>
                <div class="cart-item__actions">
                  <button class="cart-item__remove">Remove</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="order-summary">
            <h2 class="order-summary__title">Order Summary</h2>
            <div class="order-summary__row">
              <span>Subtotal</span>
              <span>$${subtotal}</span>
            </div>
            <div class="order-summary__row">
              <span>Discount (-${discountPercentage}%)</span>
              <span class="discount">-$${discount}</span>
            </div>
            <div class="order-summary__row total">
              <span>Total</span>
              <span>$${total}</span>
            </div>
            <button class="order-summary__checkout">Go to Checkout</button>
          </div>
        </div>
      </div>
    `;
  }

  private initEventListeners(): void {
    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      const quantityButton = target.closest('.product-quantity__button');
      if (quantityButton) {
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = parseInt(cartItem.getAttribute('data-product-id') || '0');
        const quantityElement = cartItem.querySelector('.product-quantity__value');
        if (!quantityElement) return;

        const currentQuantity = parseInt(quantityElement.textContent || '0');
        const action = quantityButton.getAttribute('data-action');
        
        const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
        if (newQuantity >= 0) {
          this.handleQuantityChange(productId, newQuantity);
        }
      }

      const removeButton = target.closest('.cart-item__remove');
      if (removeButton) {
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = parseInt(cartItem.getAttribute('data-product-id') || '0');
        this.handleRemoveItem(productId);
      }

      const checkoutButton = target.closest('.order-summary__checkout');
      if (checkoutButton) {
        this.handleCheckout();
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

export default CartPage; 