import { SubscribeBanner } from '../SubscribeBanner/SubscribeBanner';

export class Footer {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('footer');
    this.element.classList.add('footer');
    this.render();
  }

  private render(): void {
    const subscribeBanner = new SubscribeBanner();
    
    this.element.innerHTML = `
      <div class="container">
        <div class="footer__main">
          <div class="footer__brand">
            <a href="/" class="footer__logo">SHOP.CO</a>
            <p class="footer__description">We have clothes that suits your style and which you're proud to wear. From women to men.</p>
            <div class="footer__socials">
              <a href="#" class="footer__social-link">
                <img src="../assets/icons/facebook.svg" alt="Facebook">
              </a>
              <a href="#" class="footer__social-link">
                <img src="../assets/icons/twitter.svg" alt="Twitter">
              </a>
              <a href="#" class="footer__social-link">
                <img src="../assets/icons/instagram.svg" alt="Instagram">
              </a>
              <a href="#" class="footer__social-link">
                <img src="../assets/icons/github.svg" alt="GitHub">
              </a>
            </div>
          </div>
          <div class="footer__links">
            <div class="footer__column">
              <h3 class="footer__column-title">COMPANY</h3>
              <ul class="footer__list">
                <li><a href="#">About</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Works</a></li>
                <li><a href="#">Career</a></li>
              </ul>
            </div>
            <div class="footer__column">
              <h3 class="footer__column-title">HELP</h3>
              <ul class="footer__list">
                <li><a href="#">Customer Support</a></li>
                <li><a href="#">Delivery Details</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div class="footer__column">
              <h3 class="footer__column-title">FAQ</h3>
              <ul class="footer__list">
                <li><a href="#">Account</a></li>
                <li><a href="#">Manage Deliveries</a></li>
                <li><a href="#">Orders</a></li>
                <li><a href="#">Payments</a></li>
              </ul>
            </div>
            <div class="footer__column">
              <h3 class="footer__column-title">RESOURCES</h3>
              <ul class="footer__list">
                <li><a href="#">Free eBooks</a></li>
                <li><a href="#">Development Tutorial</a></li>
                <li><a href="#">How to - Blog</a></li>
                <li><a href="#">Youtube Playlist</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copyright">Shop.co © 2000-2023, All Rights Reserved</p>
          <div class="footer__payments">
            <img src="../assets/icons/visa.svg" alt="Visa">
            <img src="../assets/icons/mastercard.svg" alt="Mastercard">
            <img src="../assets/icons/paypal.svg" alt="PayPal">
            <img src="../assets/icons/applepay.svg" alt="Apple Pay">
            <img src="../assets/icons/googlepay.svg" alt="Google Pay">
          </div>
        </div>
      </div>
    `;

    this.element.querySelector('.container')?.insertBefore(
      subscribeBanner.getElement(),
      this.element.querySelector('.footer__main')
    );
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 