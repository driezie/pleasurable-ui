
// // variable maken
// const storiesButton= document.querySelector('.storiesButton');
// const playlistButton = document.querySelector('playlistsButton');
// const storiesContent = document.querySelector('.list-stories');
// const playlistsContent = document.querySelector('.list-playlists');

// // als de knop word gelikt moet de bijbehorende content worden weergegeven

// storiesButton.addEventListener('click', showContent);


// function showContent(){
//    playlistsContent.classList.add('hidden')
document.addEventListener('DOMContentLoaded', function() {
    // Variable creation
    const storiesButton = document.querySelector('.storiesButton');
    const playlistsButton = document.querySelector('.playlistsButton');
    const storiesContent = document.querySelector('.list-stories');
    const playlistsContent = document.querySelector('.list-playlists');

    // Check if elements exist before adding event listeners
    if (storiesButton && playlistsButton && storiesContent && playlistsContent) {
        storiesButton.addEventListener('click', showStories);
        playlistsButton.addEventListener('click', showPlaylists);
    } else {
        console.error('One or more elements are not found in the DOM.');
    }

    function showStories() {
        storiesContent.classList.remove('hidden');
        playlistsContent.classList.add('hidden');
    }

    function showPlaylists() {
        playlistsContent.classList.remove('hidden');
        storiesContent.classList.add('hidden');
    }
});
