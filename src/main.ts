import './style.css'
import { CardData } from './components/Card';
import { Card } from './components/Card';
import cardsData from './db/cards.json';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  if (!app) {
    console.error('Root element not found');
    return;
  }

  const container = document.createElement('div');
  container.className = 'container';

  const heading = document.createElement('h1');
  heading.textContent = 'Our Works';
  heading.className = 'main-heading';

  const description = document.createElement('p');
  description.textContent = 'The most important part of the Startup Framework is the samples. The samples form a set of 20 usable pages you can use as is or you can add new blocks from UI Kit.';
  description.className = 'main-description';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-grid';

  cardsData.forEach((cardData: CardData) => {
    const card = new Card(cardData);
    cardsContainer.appendChild(card.getElement());
  });

  container.appendChild(heading);
  container.appendChild(description);
  container.appendChild(cardsContainer);
  app.appendChild(container);
});
