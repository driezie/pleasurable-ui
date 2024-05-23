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
`z`
    } else {
        console.error('One or more elements are not found in the DOM.');
    }

    // active state 
   
// Function to toggle active state between buttons
function toggleActiveButton(clickedButton, otherButton) {
    // Check if the clicked button already has the active class
    if (!clickedButton.classList.contains('active')) {
        // Remove active state from the other button
        otherButton.classList.remove('active');
        
        // Add active class to the clicked button
        clickedButton.classList.add('active');
    }
}

// Event listener for the stories button
storiesButton.addEventListener('click', function() {
    toggleActiveButton(storiesButton, playlistsButton);
});

// Event listener for the playlists button
playlistsButton.addEventListener('click', function() {
    toggleActiveButton(playlistsButton, storiesButton);
}); 

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
