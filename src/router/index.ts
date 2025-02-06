import Navigo, { Match } from 'navigo';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Homepage } from '../pages/Homepage/Homepage';
import { CategoryPage } from '../pages/CategoryPage/CategoryPage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { CartPage } from '../pages/CartPage/CartPage';

const router = new Navigo('/');

export const initRouter = (): void => {
  console.log('Initializing router');
  
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
    console.error('App element not found');
    return;
  }

  const header = new Header();
  app.appendChild(header.getElement());

  const main = document.createElement('div');
  main.id = 'main-content';
  app.appendChild(main);

  const footer = new Footer();
  app.appendChild(footer.getElement());

  router
    .on({
      '/': () => {
        console.log('Route: Homepage');
        main.innerHTML = '';
        const homepage = new Homepage();
        main.appendChild(homepage.getElement());
      },
      '/category/:categoryName': (match: Match) => {
        console.log('Route: Category', match?.data);
        main.innerHTML = '';
        const categoryName = match?.data?.categoryName || '';
        const categoryPage = new CategoryPage(categoryName);
        main.appendChild(categoryPage.getElement());
      },
      '/product/:productId': (match: Match) => {
        console.log('Route: Product', match?.data);
        main.innerHTML = '';
        const productId = match?.data?.productId || '';
        const productPage = new ProductPage(productId);
        main.appendChild(productPage.getElement());
      },
      '/cart/:cartId?': {
        as: 'cart',
        uses: (match: Match) => {
          console.log('Route: Cart', match?.data);
          main.innerHTML = '';
          const cartId = match?.data?.cartId;
          const cartPage = new CartPage({ cartId });
          main.appendChild(cartPage.getElement());
        }
      }
    })
    .notFound(() => {
      console.log('Route: Not Found');
      main.innerHTML = `
        <div class="container">
          <div class="error-page">
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" class="error-page__button">Go to Homepage</a>
          </div>
        </div>
      `;
    });

  console.log('Starting router resolution');
  router.resolve();
}; 