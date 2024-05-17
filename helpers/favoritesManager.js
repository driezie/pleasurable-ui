import { makeFetchRequest } from './fetchManager.js';

// Het toevogen van een favoriet aan de database [Directus]
export async function addFavorite(itemId, apiUrl) {
  const addUrl = `${apiUrl}/tm_likes`;
  await makeFetchRequest(addUrl, 'POST', { playlist: itemId, user: 4 });
}

// Het verwijderen van een favoriet uit de database [Directus]
export async function removeFavorite(isLikedId, apiUrl) {
  const removeUrl = `${apiUrl}/tm_likes/${isLikedId}`;
  await makeFetchRequest(removeUrl, 'DELETE');
}

// Helper functie om een favoriet toe te voegen of te verwijderen
export async function toggleFavorite(itemId, isLiked, isLikedId, apiUrl) {
  // Als deze playlist al geliked is, verwijder hem dan uit de favorieten
  if (isLiked) {
    // Functie om een favoriet te verwijderen
    await removeFavorite(isLikedId, apiUrl);
  } else {
    // Functie om een favoriet toe te voegen
    await addFavorite(itemId, apiUrl);
  }
}
