// Importeer het npm pakket express uit de node_modules map
import express from 'express';

// Importeer de zelfgemaakte functies uit de ./helpers map
import { addFavorite, removeFavorite, toggleFavorite } from './helpers/favoritesManager.js';
import { makeFetchRequest } from './helpers/fetchManager.js';
import { checkIfLiked } from './helpers/likeChecker.js';

// Maak een nieuwe express app aan
const app = express();

// API naar Directus
const apiUrl = "https://fdnd-agency.directus.app/items";

// Stel ejs in als template engine
// Stel de map met ejs templates in
// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
// Zorg dat werken met request data makkelijker wordt
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (request, response) => {
  const playlistsAPI = `${apiUrl}/tm_playlist?fields=*.*.*.*`;
  const playlistsResponse = await makeFetchRequest(playlistsAPI, 'GET');
  if (!playlistsResponse || typeof playlistsResponse.json !== 'function') {
    throw new Error('Invalid response object');
  }
  const playlistsData = await playlistsResponse.json();
  const playlists = playlistsData.data;

  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const likedPlaylistsResponse = await makeFetchRequest(likedAPI, 'GET');
  if (!likedPlaylistsResponse || typeof likedPlaylistsResponse.json !== 'function') {
    throw new Error('Invalid response object');
  }
  const likedPlaylistsData = await likedPlaylistsResponse.json();
  const likedPlaylists = likedPlaylistsData.data;

  const playlistsWithLikedStatus = playlists.map(playlist => {
    return checkIfLiked(playlist, likedPlaylists);
  });

  const likedPlaylistsOnly = playlistsWithLikedStatus.filter(playlist => playlist.isLiked);

  response.render('index', {
    apiUrl: apiUrl,
    playlists: playlistsWithLikedStatus || [],
    liked_playlists: likedPlaylistsOnly || [],
  });
});

app.post('/', async (req, res) => {
  // Ontvang het item id
  const itemId = req.body.itemId;
  const isLiked = req.body.isLiked === 'true'; // Convert to boolean
  const isLikedId = req.body.isLikedId;

  // Toggle the favorite status
  await toggleFavorite(itemId, isLiked, isLikedId, apiUrl);

  // Haal alle 'normale' afspeellijsten op
  const playlistsAPI = `${apiUrl}/tm_playlist?fields=*.*.*.*`;
  const playlistsResponse = await makeFetchRequest(playlistsAPI, 'GET');
  const playlistsData = await playlistsResponse.json();
  const playlists = playlistsData.data;

  // Haal alle gelikede afspeellijsten op
  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const updatedLikedPlaylistsResponse = await makeFetchRequest(likedAPI, 'GET');
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

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
