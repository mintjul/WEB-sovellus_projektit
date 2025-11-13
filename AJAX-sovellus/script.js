//API-avain OMDB api:lle
const API_KEY = 'd186bc5a';
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const resultsDiv = document.getElementById('results');

//Elokuvien tiedot
const movieDetailsDiv = document.getElementById('movie-details');
const movieInfoDiv = document.getElementById('movie-info');
//Takaisin nappi
const backBtn = document.getElementById('back-btn');

//Tapahtumakuuntelijat
searchBtn.addEventListener('click', searchMovies);
//Enter haku
movieInput.addEventListener('keypress', e => { if(e.key==='Enter') searchMovies(); });
//Takaisin nappi
backBtn.addEventListener('click', () => { movieDetailsDiv.style.display='none'; });

//Haku funktio
function searchMovies() {
  const query = movieInput.value.trim();
  resultsDiv.innerHTML = '';
  if(!query) return;

  //Elokuvien haku OMDB api:sta
  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`)
    .then(res => res.json()) //JSON vastaus
    .then(data => { 
      if(data.Response==='True') { 
        data.Search.forEach(movie => {
          const card = document.createElement('div'); //elokuva kortti
          card.className = 'movie-card';
          //Kortin sisältö
          card.innerHTML = `
            <img src="${movie.Poster!=='N/A'?movie.Poster:'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.Title}">
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Vuosi: ${movie.Year}</p>
              <p>Tyyppi: ${movie.Type}</p>
            </div>
          `;
          //klikkaus tapahtuma kortille
          card.addEventListener('click', () => showMovieDetails(movie.imdbID));
          resultsDiv.appendChild(card); //kortin lisäys
        });
      } else { //ei tuloksia
        resultsDiv.innerHTML = `<p>Elokuvaa ei löytynyt haulla: ${query}</p>`;
      }
    });
}

//Elokuvien tietojen näyttö
function showMovieDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      if(movie.Response==='True') { //tietotej näyttö
        movieInfoDiv.innerHTML = ` 
          <h2>${movie.Title} (${movie.Year})</h2>
          <img src="${movie.Poster!=='N/A'?movie.Poster:'https://via.placeholder.com/250x375?text=No+Image'}" alt="${movie.Title}">
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Ohjaaja:</strong> ${movie.Director}</p>
          <p><strong>Näyttelijät:</strong> ${movie.Actors}</p>
          <p><strong>Juoni:</strong> ${movie.Plot}</p>
          <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>
        `;
        movieDetailsDiv.style.display='flex'; 
      } 
    });
}

