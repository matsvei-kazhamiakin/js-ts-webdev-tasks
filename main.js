const cardsData = [
    {
        title: 'Startup Framework',
        description: 'Startup is a powerful tool for quick and convenient proto-typing of your projects. It will fit most projects because it contains up-to-date and modern web elements.',
        background: '#EBEAED',
        textColor: '#1E0E62',
        buttonStyle: {
            background: '#FFFFFF',
            color: '#1E0E62',
            border: 'none'
        }
    },
    {
        title: 'Web Generator',
        description: 'Startup is a powerful tool for quick and convenient proto-typing of your projects. It will fit most projects because it contains up-to-date and modern web elements.',
        background: '#FFFFFF',
        border: '2px solid #EBEAED',
        titleColor: '#391484',
        buttonStyle: {
            background: '#25DAC5',
            color: '#FFFFFF',
            border: 'none'
        }
    },
    {
        title: 'Slides 4',
        description: 'All of these components are made in the same style, and can easily be integrated into projects, allowing you to create hundreds of solutions for your future projects.',
        background: '#482BE7',
        textColor: '#FFFFFF',
        buttonStyle: {
            background: '#FFFFFF',
            color: '#1E0E62',
            border: 'none'
        }
    },
    {
        title: 'Postcards',
        description: 'All frequently used elements are now in symbols, use them to create interfaces really fast. Easily change icons, colors and text. Add new symbols to customize your design.',
        background: '#FFFFFF',
        backgroundImage: 'assets/images/postcards-bg.jpg',
        textColor: '#FFFFFF',
        buttonStyle: {
            background: '#FFFFFF',
            color: '#1E0E62',
            border: 'none'
        }
    }
];

function createButton(props) {
    const button = document.createElement('button');
    button.className = 'explore-button';
    button.textContent = 'Explore';
    
    if (props) {
        Object.assign(button.style, {
            backgroundColor: props.background,
            color: props.color,
            border: props.border || 'none'
        });
    }
    
    return button;
}

function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = data.background;
    
    if (data.border) {
        card.style.border = data.border;
    }
    
    if (data.backgroundImage) {
        card.style.backgroundImage = `url(${data.backgroundImage})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    }
    
    if (data.textColor) {
        card.style.color = data.textColor;
    }

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = data.title;
    if (data.titleColor) {
        title.style.color = data.titleColor;
    }

    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = data.description;

    const button = createButton(data.buttonStyle);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);

    return card;
}

// Создаем заголовок
const header = document.createElement('div');
header.className = 'header';

const title = document.createElement('h1');
title.textContent = 'Last works';

const exploreShowcase = createButton({
    background: '#FFFFFF',
    color: '#1E0E62',
    border: '2px solid #EBEAED'
});
exploreShowcase.textContent = 'Explore Showcase';

header.appendChild(title);
header.appendChild(exploreShowcase);

// Добавляем элементы на страницу
const app = document.getElementById('app');
app.appendChild(header);

const cardContainer = document.createElement('div');
cardContainer.className = 'card-container';

cardsData.forEach(item => {
    const card = createCard(item);
    cardContainer.appendChild(card);
});

app.appendChild(cardContainer);
