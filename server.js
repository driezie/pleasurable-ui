// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// // Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/"
const apiFamily = (apiUrl + 'oba_family')
const apiProfile = (apiUrl + 'oba_profile')
const apiItem = (apiUrl + 'oba_item?fields=*,afbeelding.id,afbeelding.height,afbeelding.width')

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

app.get('/', function (request, response) {
    fetchJson(apiFamily).then((apiFamily) => {
        response.render('index',{
            // apiUser: apiUser.data
        })
    })
})

app.get('/detail/:id', function(request, response){
    // console.log(request.params)
    const itemId = request.params.id;

     // Haal de details op van het item met het opgegeven ID
     fetchJson(apiUrl + '/oba_item/' + itemId).then((items) => {
        // Render de detailpagina en geef de nodige data mee
        response.render('detail', {
            items: items.data,
            id: itemId,
        });
    });
});

app.post('/detail/:id', function(request, response){

    const itemId = request.params.id;
  
    fetch(`${apiUrl}/oba_bookmarks/` , {
        method: 'POST',
        body: JSON.stringify({
          item: request.params.id
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then((postResponse) => {
        // Redirect naar de persoon pagina
        if (request.body.enhanced) {
            response.render('detail', {added:true});
          } else {
          response.redirect(303, '/detail/' + itemId + '?added=true')
      }
    })
  });

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8001)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})