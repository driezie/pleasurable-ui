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

  // Haal alle 'normale' afspeellijsten op
  const playlistsAPI = `${apiUrl}/tm_playlist?fields=*.*.*.*`;
  const playlistsResponse = await makeFetchRequest(playlistsAPI, 'GET');
  const playlistsData = await playlistsResponse.json();
  const playlists = playlistsData.data;

  // Haal alle gelikede afspeellijsten op
  const likedAPI = `${apiUrl}/tm_likes?filter={"user":"4"}`;
  const likedPlaylistsResponse = await makeFetchRequest(likedAPI, 'GET');
  const likedPlaylistsData = await likedPlaylistsResponse.json();
  const likedPlaylists = likedPlaylistsData.data;

  // Voeg de isLiked-status toe aan elke afspeellijst
  const playlistsWithLikedStatus = playlists.map(playlist => {
    return checkIfLiked(playlist, likedPlaylists);
  });

  // Filter alleen de gelikede afspeellijsten
  const likedPlaylistsOnly = playlistsWithLikedStatus.filter(playlist => playlist.isLiked);

  // Fetch likes data to sort playlists based on likes
  const likesAPI = `${apiUrl}/tm_likes`;
  const likesResponse = await makeFetchRequest(likesAPI, 'GET');
  const likesData = await likesResponse.json();
  const likes = likesData.data;

  // Organiseert alle playlisten op hoeveelheid likes
  const popularPlaylists = [...playlistsWithLikedStatus].sort((a, b) => {
    const aLikes = likes.filter(like => like.playlist === a.id).length;
    const bLikes = likes.filter(like => like.playlist === b.id).length;
    return bLikes - aLikes;
  });

  // Organiseert alle playlisten op hoeveelheid stories
  const mostStoriesPlaylists = playlistsWithLikedStatus.sort((a, b) => b.stories.length - a.stories.length)

  // Organiseert de normale playlist in order van de id
  const playlistsWithLikedStatusSorted = [...playlistsWithLikedStatus].sort((a, b) => a.id - b.id);


   // Haal alle stories  op
   const storiesAPI = `${apiUrl}/tm_story`;
   const storiesResponse = await makeFetchRequest(storiesAPI, 'GET');
   const storiesData = await storiesResponse.json();
   const stories = storiesData.data;
 

  // Rendert de homepagina met alleen de gelikede afspeellijsten
  response.render('index', {
    apiUrl: apiUrl,
    stories: stories || [],
    playlists: playlistsWithLikedStatusSorted || [],
    liked_playlists: likedPlaylistsOnly || [],
    popular_playlists: popularPlaylists || [],
    most_stories_playlists: mostStoriesPlaylists || [],
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
  

  response.render('index', {
    apiUrl: apiUrl,
    playlists: playlistsWithLikedStatus || [],
    liked_playlists: likedPlaylistsOnly || [],
    popular_playlists: popularPlaylistsSorted || [],
  });
});


/// Maak een GET route voor de stories
app.get('/stories', async function (request, response) {
  const storyAPI = `${apiUrl}/tm_story`;
  const storyResponse = await makeFetchRequest(storyAPI, 'GET');
  const storyData = await storyResponse.json();
  const stories = storyData.data;
  let filteredstories = null


  // Controleer als er een search query in de request is
  if (request.query.search) {
      const searchTerm = request.query.search.toLowerCase(); // verander search query naar lowercase
      filteredstories = stories.filter(story =>
          story.title.toLowerCase().includes(searchTerm) || // Search bij titel
          story.summary.toLowerCase().includes(searchTerm) // Search bij samenvatting
      );
      response.render('stories', { stories: filteredstories });
  } else {
    response.render('stories', { stories: stories });
  }
  // Render stories.ejs van de views map
  
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
