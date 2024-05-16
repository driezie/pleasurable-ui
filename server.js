// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine
app.set('view engine', 'ejs');

// Stel de map met ejs templates in
app.set('views', './views');

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'));

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}));

// API naar Directus
const apiUrl = "https://fdnd-agency.directus.app/items";

// Array voor favourieten
const playlistsWithLikedStatus = [];

function checkIfLiked(playlist, array) {
  // Checks if the playlist is in the liked playlists array
  const isLiked = array.some(likedPlaylist => likedPlaylist.playlist === playlist.id);
  // Adds an `isLiked` attribute to the playlist object
  return {
      ...playlist,
      // Id of the isliked item
      isLikedId: isLiked ? array.find(likedPlaylist => likedPlaylist.playlist === playlist.id).id : null,
      isLiked: isLiked
  };
}

app.get('/', async (request, response) => {
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
  const isLiked = req.body.isLiked === 'true'; // Ensure the value is boolean
  const isLikedId = req.body.isLikedId;

  console.log("Post request received with:", itemId, isLiked, isLikedId);

  // Fetcht alle gelikede playlists van de gebruiker
  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const likedPlaylistsResponse = await fetch(likedAPI);
  const likedPlaylistsData = await likedPlaylistsResponse.json();
  const likedPlaylists = likedPlaylistsData.data;

  // Controleer of de afspeellijst al geliked is
  if (isLiked) {
    console.log("Remove playlist from favorites");
    if (isLikedId) {
      const removeUrl = `${apiUrl}/tm_likes/${isLikedId}`;
      console.log("Remove url:", removeUrl);
      const removeResponse = await fetch(removeUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!removeResponse.ok) {
        console.error('Failed to remove playlist from favorites');
        return res.status(500).send('Failed to remove playlist from favorites');
      }
    } else {
      console.error('isLikedId is missing');
      return res.status(400).send('isLikedId is missing');
    }
  } else {
    console.log("Add playlist to favorites");
    const addUrl = `${apiUrl}/tm_likes`;
    const addResponse = await fetch(addUrl, {
      method: 'POST',
      body: JSON.stringify({ playlist: itemId, user: 4 }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!addResponse.ok) {
      console.error('Failed to add playlist to favorites');
      return res.status(500).send('Failed to add playlist to favorites');
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
app.get('/playlists', async (request, response) => {});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
