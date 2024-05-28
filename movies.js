const API_KEY = 'b983a74c07c22bb8662915dbde85e9b5';
const BASE_URL = 'https://api.themoviedb.org/3';
const filmsList = document.getElementById('alphabeticalFilmsList');

document.addEventListener('DOMContentLoaded', fetchAndDisplayAlphabeticalMovies);

async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Fetch error: ', error);
        alert('Failed to fetch movies. Please try again later.');
    }
}

async function fetchAndDisplayAlphabeticalMovies() {
    const movies = await fetchMovies();
    if (movies) {
        const sortedMovies = movies.sort((a, b) => a.title.localeCompare(b.title));
        displayMovies(sortedMovies);
    }
}

function displayMovies(movies) {
    filmsList.innerHTML = movies.map(movie => `
        <div class="movie">
            <div class="movie__cover">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" loading="lazy">
            </div>
            <div class="movie__title">${movie.title}</div>
        </div>
    `).join('');
}
