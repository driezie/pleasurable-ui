// Functie om te controleren of een afspeellijst leuk gevonden is
export function checkIfLiked(playlist, array) {
  
    // Controleer of de afspeellijst leuk gevonden is door te kijken of deze voorkomt in de array. Resultaat is een boolean
    const isLiked = array.some(likedPlaylist => likedPlaylist.playlist === playlist.id);
    console.log('isLiked: ', isLiked);
    // Zoek de id van de like in de array, of geef null terug als de afspeellijst niet leuk gevonden is

    const isLikedId = isLiked ? array.find(likedPlaylist => likedPlaylist.playlist === playlist.id).id : null;
    console.log('isLikedId: ', isLikedId);
    return {
      // Kopieer alle eigenschappen van de originele afspeellijst array
      ...playlist,
      
      // Voeg een nieuwe eigenschap toe die de id bevat van de like, of null als de afspeellijst niet leuk gevonden is
      isLikedId: isLikedId,
      
      // Voeg een nieuwe eigenschap toe die aangeeft of de afspeellijst leuk gevonden is  
      isLiked: isLiked,

      
    };

    console.log('isLikedId: ', isLikedId);
  }
  