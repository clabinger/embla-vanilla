const images = [
    {
        src: 'media/media-1.jpeg',
        title: 'Blue eyed cat',
        color: 'gray',
    },
    {
        src: 'media/media-2.jpeg',
        title: '3 sideways kitties',
        color: 'brown',
    },
    {
        src: 'media/media-3.jpeg',
        title: 'One cute kitty',
        color: 'white',
    },
    {
        src: 'media/media-4.jpeg',
        title: 'Sleepy cat',
        color: 'white',
    },
    {
        src: 'media/media-5.jpeg',
        title: 'Holding up',
        color: 'tan',
    },
];

let embla = null;

function openFullscreen() {
    const elem = document.querySelector('.embla');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

function toggleInfo() {
    const elem = document.querySelector('.embla__info');
    elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
    embla.reInit();
}

function scrolledToImage() {
    loadInfo();
    const index = embla.selectedScrollSnap();
    preloadByIndex(index, 3);
}

function loadInfo() {
    const index = embla.selectedScrollSnap();
    const elem = document.querySelector('.embla__info');

    const newAttributes = [];

    for (key in images[index]) {
        const clone = document.getElementById('image-attribute').content.cloneNode(true);

        clone.querySelector('.image-attribute-title').innerHTML = key; 
        clone.querySelector('.image-attribute-value').innerHTML = images[index][key];
        newAttributes.push(clone);
    }

    elem.replaceChildren(...newAttributes);
}

function preloadByIndex(index, reach = 1) {
    const slides = document.querySelector('.embla__container').children;
    
    for (let i = index - reach; i <= index + reach; i++) {
        const useIndex = (i + images.length) % images.length;
        if (!images[useIndex].loaded) {
            slides[useIndex].querySelector('img').src = images[useIndex].src;
            images[useIndex].loaded = true;
        }
    }
}

// Initial DOM is rendered with all images, using blade templte (no src attributes)
// src attribute for images -1, 0, 1 are loaded
// When user navigates from 0 to 1, "right" is recognized and the src attributes for the next 3 right images are loaded (2, 3, 4)

function initialize() {
    preloadByIndex(0);

    const viewPort = document.querySelector(".embla").querySelector(".embla__viewport");

    const wheelGestures = EmblaCarouselWheelGestures();
    embla = EmblaCarousel(viewPort, { loop: true }, [wheelGestures]);

    loadInfo();

    document.querySelector(".embla__button--prev").addEventListener('click', () => embla.scrollPrev(true));
    document.querySelector(".embla__button--next").addEventListener('click', () => embla.scrollNext(true));

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            embla.scrollPrev(true);
        } else if (event.key === 'ArrowRight') {
            embla.scrollNext(true);
        }
    });
}

initialize();

embla.on("select", scrolledToImage);
