// Functie om een HTTP-verzoek te doen met behulp van de Fetch API
export async function makeFetchRequest(url, method, body = null) {
  // Opties object om het fetch verzoek te configureren
  const options = {
    method, // HTTP-methode (GET, POST, DELETE, PATCH, etc.)
    headers: {
      'Content-Type': 'application/json' // Geef aan dat de request body JSON is
    }
  };

  // Als er een body is, voeg deze dan toe aan het opties object na het "stringiferen"
  if (body) {
    options.body = JSON.stringify(body);
  }

  // Doe het fetch verzoek met de opgegeven URL en opties
  const response = await fetch(url, options);

  // Controleer of de response niet OK is
  if (!response.ok) {
    // Gooi een fout met een bericht dat de methode en URL aangeeft die mislukt is
    throw new Error(`Failed to ${method} at ${url}`);
  } else {
    // Log dat het verzoek succesvol was
    console.log(`Successfully used ${method} request at ${url}`);
  }
  return response;
}
