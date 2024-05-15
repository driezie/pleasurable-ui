// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'
// import checkIfLiked from './helpers/check-if-liked.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

// API naar Directus
const apiUrl = "https://fdnd-agency.directus.app/items";

// Array voor favourieten
const playlistsWithLikedStatus = [];

function checkIfLiked(playlist, array) {
  // Checks if the playlist is in the liked playlists array
  const isLiked = array.some(likedPlaylist => likedPlaylist.playlist === playlist.id);
  // Double check if the playlist is in the liked playlists array
  // console.log("isLiked for " + playlist.id + " is: " + isLiked);

  // Adds an `isLiked` attribute to the playlist object
  return {
      ...playlist,
      // Id of the isliked item
      isLikedId: isLiked ? array.find(likedPlaylist => likedPlaylist.playlist === playlist.id).id : null,
      isLiked: isLiked
  };
}


app.get('/', async (request, response) => {
  //? Hier moet ik de code aanpassen zodat de liked id 
  //? opgehaald wordt via de playlists als dat kan
  // Fetch alle playlists
  const playlistsAPI = `${apiUrl}/tm_playlist?fields=*.*.*.*`;
  const playlistsResponse = await fetch(playlistsAPI);
  const playlistsData = await playlistsResponse.json();
  const playlists = playlistsData.data;

  // Fetcht alle gelikede playlists van de gebruiker
  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const likedPlaylistsResponse = await fetch(likedAPI);
  const likedPlaylistsData = await likedPlaylistsResponse.json();
  const likedPlaylists = likedPlaylistsData.data;

  // Voeg de isLiked-status toe aan elke playlist
  const playlistsWithLikedStatus = playlists.map(playlist => {
      return checkIfLiked(playlist, likedPlaylists);
  });


  // Filter alleen de gelikede playlists
  const likedPlaylistsOnly = playlistsWithLikedStatus.filter(playlist => playlist.isLiked);

  // Render de homepagina met de data
  response.render('index', {
      apiUrl: apiUrl,
      playlists: playlistsWithLikedStatus || [],
      liked_playlists: likedPlaylistsOnly || [],
  });
});

// POST-functie voor het leuk vinden van een afspeellijst
app.post('/', async (req, res) => {
  // Ontvang het item id
  const itemId = req.body.itemId;
  const isLiked = req.body.isLiked;
  const isLikedId = req.body.isLikedId;

  console.log("Post request received with: " + itemId + " and " + isLiked + " and " + isLikedId);

  // Fetcht alle gelikede playlists van de gebruiker
  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const likedPlaylistsResponse = await fetch(likedAPI);
  const likedPlaylistsData = await likedPlaylistsResponse.json();
  const likedPlaylists = likedPlaylistsData.data;


  // Controleer of de afspeellijst al geliked is
  //? Dit is de code waar ik hulp nodig mee heb
  //? Error is no permissions, id is 2 maar hoort ongeveer 267 te zijn
  //? Hoe krijg ik dan de juiste "liked" id van de liked playlist?
  if (isLiked == true) {
    console.log("Remove playlist from favorites");
    // Als de afspeellijst al geliked is, verwijder deze dan
    const removeUrl = `${apiUrl}/tm_likes/${isLikedId}`;
    console.log("Remove url: ", removeUrl);
    const removeResponse = await fetch(removeUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });



    if (!removeResponse.ok) {
      //! Geef een error als het niet lukt om de afspeellijst te verwijderen
      throw new Error('Failed to remove playlist from favorites');
    } else {
      console.log("Playlist removed from favorites");
    }
  } else {
    console.log("Add playlist from favorites");
    // Als de afspeellijst niet geliked is, voeg deze dan toe
    const addUrl = `${apiUrl}/tm_likes`;
    const addResponse = await fetch(addUrl, {
      method: 'POST',
      body: JSON.stringify({ playlist: itemId, user: 4 }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!addResponse.ok) {
      //! Geef een error als het niet lukt om de afspeellijst toe te voegen aan de gelikede afspeellijsten
      throw new Error('Failed to add playlist to favorites');
    } else {
      console.log("Added playlist")
    }
  }

  // Haal alle 'normale' afspeellijsten op
  const playlistsAPI = `${apiUrl}/tm_playlist?fields=*.*.*.*`;
  const playlistsResponse = await fetch(playlistsAPI);
  const playlistsData = await playlistsResponse.json();
  const playlists = playlistsData.data;

  // Haal alle gelikede afspeellijsten op
  const updatedLikedPlaylistsResponse = await fetch(likedAPI);
  const updatedLikedPlaylistsData = await updatedLikedPlaylistsResponse.json();
  const updatedLikedPlaylists = updatedLikedPlaylistsData.data;

  // Voeg de isLiked-status toe aan elke afspeellijst
  const playlistsWithLikedStatus = playlists.map(playlist => {
      return checkIfLiked(playlist, updatedLikedPlaylists);
  });

  // Filter alleen de gelikede afspeellijsten
  const likedPlaylistsOnly = playlistsWithLikedStatus.filter(playlist => playlist.isLiked);

  // Rendert de homepagina met alleen de gelikede afspeellijsten
  res.render('index', {
      apiUrl: apiUrl,
      playlists: playlistsWithLikedStatus || [],
      liked_playlists: likedPlaylistsOnly || [],
  });
});

//? Tijdelijke code uitgezet
app.get('/playlists', async (request, response) => {

});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})