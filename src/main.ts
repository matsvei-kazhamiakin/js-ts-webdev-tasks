import './style.css';
import { initRouter } from './router';
import { store } from './store';

const savedState = localStorage.getItem('reduxState');
if (savedState) {
  const { user, cart } = JSON.parse(savedState);
  if (user?.userId) {
    store.dispatch({ type: 'user/setUserId', payload: user.userId });
  }
  if (cart?.cartId) {
    store.dispatch({ type: 'cart/setCartId', payload: cart.cartId });
    cart.items.forEach((item: any) => {
      store.dispatch({ type: 'cart/addItem', payload: item });
    });
  }
}

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('reduxState', JSON.stringify(state));
});

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
