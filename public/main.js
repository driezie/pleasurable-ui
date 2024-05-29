document.addEventListener('DOMContentLoaded', function() {
    // Variable creation
    const storiesButton = document.querySelector('.storiesButton');
    const playlistsButton = document.querySelector('.playlistsButton');
    const storiesContent = document.querySelector('.list-stories');
    const playlistsContent = document.querySelector('.list-playlists');

    const hamburgerButton = document.querySelector('.menu-button');
    const menu = document.querySelector('.menu-container');
    const closeIcon = document.querySelector('.menu-close-button');

    // Check of ze bestaan
    if (storiesButton && playlistsButton && storiesContent && playlistsContent) {
        storiesButton.addEventListener('click', showStories);
        playlistsButton.addEventListener('click', showPlaylists);
        storiesButton.addEventListener('click', function() {

    });

    } else {
        console.error('One or more elements are not found in the DOM.');
    }
        storiesButton.addEventListener('click', function() {
            toggleActiveButton(storiesButton, playlistsButton);
        });

        playlistsButton.addEventListener('click', function() {
            toggleActiveButton(playlistsButton, storiesButton);
        }); 

     // menu 

    // hamburgerButton.addEventListener("click", toggleMenu);
    // closeIcon.addEventListener("click", toggleMenu);

        
    // function toggleMenu() {
    //     console.log("toggle check");
    //     // Toggle de klasse 'show-menu'
    //     menu.classList.toggle("show-menu");
    
    //     // Check of 'show-menu' class er is 
    //     if (menu.classList.contains("show-menu")) {
    //         // als 'showMenu' class er is:  display block
    //         menu.style.display = "block";
    //     } else {
    //          // als 'showMenu' class er niet is:  display none
    //         menu.style.display = "none";
    //     }
    // }


//  // active state 
    // function toggleActiveButton(clickedButton, otherButton) {
    //     //checken of er al een active state is 
    //     if (!clickedButton.classList.contains('active')) {
    //         // active state weghalen 
    //         otherButton.classList.remove('active');
            
    //         // Active state toevoegen
    //         clickedButton.classList.add('active');
    //     }

    // stories laten zien 
    function showStories() {
        storiesContent.classList.remove('hidden');
        playlistsContent.classList.add('hidden');
    }

    function showPlaylists() {
        playlistsContent.classList.remove('hidden');
        storiesContent.classList.add('hidden');
    }
});
