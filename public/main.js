document.addEventListener('DOMContentLoaded', function() {
    // Variable creation
    const storiesButton = document.querySelector('.storiesButton');
    const playlistsButton = document.querySelector('.playlistsButton');
    const storiesContent = document.querySelector('.list-stories');
    const playlistsContent = document.querySelector('.list-playlists');

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
