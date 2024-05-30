// personal page load animations
gsap.from('h1', {duration: 0.6, y: '100%', delay: 0.7, ease: 'ease-out'});
// timeline for the carousel animation
const carouselTimeline = gsap.timeline({defaults: { duration: 1 }});

carouselTimeline
    .from('.for-you', {duration: 0.5, x: '-200%', delay: 0.7, ease: 'ease-in'})
    .from('.favourites', {duration: 0.5, x: '200%', ease: 'ease-in'})
    .from('.borrowed', {duration: 0.5, x: '-200%', ease: 'ease-in'});

// timeline for for you
const forYouTimeline = gsap.timeline({defaults: { duration: 1 }});

// forYouTimeline
// .from('.for-you-details', {duration: 0.7, y: '100%', ease: 'ease-in', delay: 0.1});


// detail active buttons
const forYouDetailsButton = document.getElementById('forYoudetailsButton');
const favoritesDetailsButton = document.getElementById('favoritesButton');
const borrowedBooksDetailsButton = document.getElementById('borrowedBooksButton');

// detail deactive buttons
const forYouDetailsCloseButton = document.getElementById('forYouDetailsCloseButton');
const favoritesDetailsCloseButton = document.getElementById('favoritesCloseButton');
const borrowedBooksDetailsCloseButton = document.getElementById('borrowedBooksCloseButton');

// elementen voor de detail functie
const forYouDetails = document.querySelector('.for-you-details');
const favoritesDetails = document.querySelector('.favorites-details');
const borrowedBooksDetails = document.querySelector('.borrowed-books-details');
const contentWrapperActive = document.querySelector('.content-wrapper');
const pageText = document.querySelector('.page');

// click events

// voor details active

// for you
forYouDetailsButton.addEventListener('click', () => {
    // Zorg ervoor dat de animaties in de timeline 3x zo snel gaan
    carouselTimeline.timeScale(2);

    // Reverse de animatie op de timeline met .reverse
    carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
        detailsForYouActive();
        activeContentWrapper();
    });
});

// favorites
favoritesDetailsButton.addEventListener('click', () => {
    // Zorg ervoor dat de animaties in de timeline 3x zo snel gaan
    carouselTimeline.timeScale(2);

    // Reverse de animatie op de timeline met .reverse
    carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
        detailsFavoritesActive();
        activeContentWrapper();
    });
});

// borrowed books
borrowedBooksDetailsButton.addEventListener('click', () => {
    // Zorg ervoor dat de animaties in de timeline 3x zo snel gaan
    carouselTimeline.timeScale(2);

    // Reverse de animatie op de timeline met .reverse
    carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
        detailsBorrowedBooksActive();
        activeContentWrapper();
    });
});

// voor details deactive

// for you
forYouDetailsCloseButton.addEventListener('click', () => {
    // Zorg ervoor dat de animaties in de timeline 3x zo snel gaan
    console.log('ik ben geklikt')
        detailsForYouDeactive();
        activeContentWrapperDeactive();
});

// favorites
favoritesDetailsCloseButton.addEventListener('click', () => {
        detailsFavoritesDeactive();
        activeContentWrapperDeactive();
});

// borrowed books
borrowedBooksDetailsCloseButton.addEventListener('click', () => {
        detailsBorrowedBooksDeactive();
        activeContentWrapperDeactive();
});



// details active functions

// for you
function detailsForYouActive(){
    forYouDetails.classList.add('for-you-details-active');
    pageText.innerHTML = 'Voor Jou'
}

//favorites
function detailsFavoritesActive(){
    favoritesDetails.classList.add('favorites-details-active');
    pageText.innerHTML = 'Favorieten';
}

// borrowed books
function detailsBorrowedBooksActive(){
    borrowedBooksDetails.classList.add('borrowed-books-details-active');
    pageText.innerHTML = 'Geleende Boeken';
}

// content wrapper
function activeContentWrapper(){
    contentWrapperActive.classList.add('content-wrapper-active');
    console.log('wrapper');
}

// details deactive functions

// for you
// for you
function detailsForYouDeactive(){
    forYouDetails.classList.remove('for-you-details-active');
    pageText.innerHTML = 'Gebruikers Pagina';
    carouselTimeline.play(); // Speel de timeline-animatie opnieuw af zonder omkeren
    activeContentWrapperDeactive(); // Roep de functie aan om de content wrapper ook te deactiveren
}


//favorites
function detailsFavoritesDeactive(){
    favoritesDetails.classList.remove('favorites-details-active');
    pageText.innerHTML = 'Gebruikers Pagina'
    carouselTimeline.play(); // Speel de timeline-animatie opnieuw af zonder omkeren
    activeContentWrapperDeactive(); // Roep de functie aan om de content wrapper ook te deactiveren
}

// borrowed books
function detailsBorrowedBooksDeactive(){
    borrowedBooksDetails.classList.remove('borrowed-books-details-active');
    pageText.innerHTML = 'Gebruikers Pagina'
    carouselTimeline.play(); // Speel de timeline-animatie opnieuw af zonder omkeren
    activeContentWrapperDeactive(); // Roep de functie aan om de content wrapper ook te deactiveren
}

// content wrapper
function activeContentWrapperDeactive(){
    contentWrapperActive.classList.remove('content-wrapper-active');
    console.log('wrapper');
}

