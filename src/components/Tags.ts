export interface Tag {
  slug: string;
  title: string;
}

export class Tags {
  private element: HTMLDivElement;

  constructor(tags: Tag[]) {
    this.element = document.createElement('div');
    this.element.className = 'tags';
    this.render(tags);
  }

  /**
   * Создает список тегов с разделителями
   * @param tags - массив тегов
   */
  private render(tags: Tag[]): void {
    tags.forEach((tag, index) => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag.title;
      
      if (index < tags.length - 1) {
        tagElement.textContent += ', ';
      }
      
      this.element.appendChild(tagElement);
    });
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }
}
