export class SubscribeBanner {
  private element: HTMLElement;
  private isSubscribed: boolean = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('subscribe');
    this.render();
    this.initEventListeners();
  }

  private render(): void {
    if (this.isSubscribed) {
      this.element.innerHTML = `
        <div class="subscribe__container">
          <h2 class="subscribe__title">Success! You've subscribed to our newsletter.</h2>
        </div>
      `;
      return;
    }

    this.element.innerHTML = `
      <div class="subscribe__container">
        <h2 class="subscribe__title">STAY UPTO DATE ABOUT<br>OUR LATEST OFFERS</h2>
        <form class="subscribe__form" novalidate>
          <div class="subscribe__input-wrapper">
            <input 
              type="email" 
              class="subscribe__input" 
              placeholder="Enter your email address"
              required
            >
            <span class="subscribe__error-message"></span>
          </div>
          <button type="submit" class="subscribe__button">
            <span class="subscribe__button-text">Subscribe to Newsletter</span>
            <span class="subscribe__button-loading" style="display: none;">
              Subscribing...
            </span>
          </button>
        </form>
      </div>
    `;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private async mockSubscribeRequest(email: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Subscribed:', email);
        resolve();
      }, 1500);
    });
  }

  private showError(message: string): void {
    const errorElement = this.element.querySelector('.subscribe__error-message');
    const input = this.element.querySelector('.subscribe__input') as HTMLInputElement;
    
    if (errorElement) {
      errorElement.textContent = message;
    }
    
    if (input) {
      if (message) {
        input.classList.add('subscribe__input--error');
      } else {
        input.classList.remove('subscribe__input--error');
      }
    }
  }

  private setLoading(isLoading: boolean): void {
    const button = this.element.querySelector('.subscribe__button') as HTMLButtonElement;
    const buttonText = this.element.querySelector('.subscribe__button-text') as HTMLElement;
    const loadingText = this.element.querySelector('.subscribe__button-loading') as HTMLElement;

    if (button && buttonText && loadingText) {
      button.disabled = isLoading;
      buttonText.style.display = isLoading ? 'none' : 'block';
      loadingText.style.display = isLoading ? 'block' : 'none';
    }
  }

  private initEventListeners(): void {
    const form = this.element.querySelector('.subscribe__form');
    const input = this.element.querySelector('.subscribe__input') as HTMLInputElement;

    input?.addEventListener('input', () => {
      this.showError('');
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = input?.value || '';
      
      if (!this.validateEmail(email)) {
        this.showError('Please enter a valid email address');
        return;
      }

      try {
        this.setLoading(true);
        await this.mockSubscribeRequest(email);
        this.isSubscribed = true;
        this.render();
      } catch (error) {
        this.showError('Something went wrong. Please try again.');
      } finally {
        this.setLoading(false);
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
} 