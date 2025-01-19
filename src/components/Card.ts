import { Tag } from './Tags';
import { ImageData } from './Image';
import { Image } from './Image';
import { Tags } from './Tags';

export interface CardData {
  heading: string;
  description: string;
  image: ImageData;
  tags: Tag[];
}

export class Card {
  private element: HTMLDivElement;

  constructor(cardData: CardData) {
    this.element = document.createElement('div');
    this.element.className = 'card';
    this.render(cardData);
  }

  /**
   * Создает DOM структуру карточки
   * @param cardData - данные для карточки
   */
  private render(cardData: CardData): void {
    // Создаем компоненты изображения и тегов
    const image = new Image(cardData.image);
    const tags = new Tags(cardData.tags);

    // Создаем контент карточки
    this.element.innerHTML = `
      <div class="card-content">
        <h3 class="card-heading">${cardData.heading}</h3>
        <p class="card-description">${cardData.description}</p>
      </div>
    `;

    // Добавляем изображение и теги в нужные места
    this.element.insertBefore(image.getElement(), this.element.firstChild);
    this.element.querySelector('.card-content')?.appendChild(tags.getElement());
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }
}
