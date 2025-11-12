const API_KEY = 'd186bc5a';
const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const resultsDiv = document.getElementById('results');

const movieDetailsDiv = document.getElementById('movie-details');
const movieInfoDiv = document.getElementById('movie-info');
const backBtn = document.getElementById('back-btn');

searchBtn.addEventListener('click', searchMovies);
movieInput.addEventListener('keypress', e => { if(e.key==='Enter') searchMovies(); });
backBtn.addEventListener('click', () => { movieDetailsDiv.style.display='none'; });

function searchMovies() {
  const query = movieInput.value.trim();
  resultsDiv.innerHTML = '';
  if(!query) return;

  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if(data.Response==='True') {
        data.Search.forEach(movie => {
          const card = document.createElement('div');
          card.className = 'movie-card';
          card.innerHTML = `
            <img src="${movie.Poster!=='N/A'?movie.Poster:'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.Title}">
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Vuosi: ${movie.Year}</p>
              <p>Tyyppi: ${movie.Type}</p>
            </div>
          `;
          card.addEventListener('click', () => showMovieDetails(movie.imdbID));
          resultsDiv.appendChild(card);
        });
      } else {
        resultsDiv.innerHTML = `<p>Elokuvaa ei löytynyt haulla: ${query}</p>`;
      }
    });
}

function showMovieDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
      if(movie.Response==='True') {
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
