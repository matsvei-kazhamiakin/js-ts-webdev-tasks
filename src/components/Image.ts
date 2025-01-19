export interface ImageData {
  name: string;
  alt: string;
}

export class Image {
  private element: HTMLImageElement;

  constructor(imageData: ImageData) {
    this.element = document.createElement('img');
    this.render(imageData);
  }

  /**
   * Настраивает изображение
   * @param imageData - данные изображения
   */
  private render(imageData: ImageData): void {
    const imageUrl = new URL(`../assets/images/${imageData.name}`, import.meta.url);
    this.element.src = imageUrl.href;
    this.element.alt = imageData.alt;
    this.element.className = 'card-image';
  }

  public getElement(): HTMLImageElement {
    return this.element;
  }
}
