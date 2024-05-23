const API_KEY = 'b983a74c07c22bb8662915dbde85e9b5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const allMoviesGrid = document.getElementById('allMoviesGrid');
const sortSelect = document.getElementById('sort');
const pagination = document.getElementById('pagination');

let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    loadTrendingMovies();
    sortSelect.addEventListener('change', loadSortedMovies);
    searchInput.addEventListener('input', handleSearch);
});

async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    totalPages = data.total_pages;
    return data.results;
}

function renderMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
        `;
        container.appendChild(movieCard);
    });
}

async function loadTrendingMovies() {
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
    const movies = await fetchMovies(url);
    renderMovies(movies, moviesGrid);
}

async function handleSearch() {
    currentSearchQuery = searchInput.value;
    if (currentSearchQuery) {
        currentPage = 1;
        await loadSearchedMovies();
    } else {
        loadTrendingMovies();
    }
}

async function loadSearchedMovies() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${currentSearchQuery}&page=${currentPage}`;
    const movies = await fetchMovies(url);
    renderMovies(movies, moviesGrid);
    updatePagination();
}

async function loadSortedMovies() {
    const sortBy = sortSelect.value;
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}`;
    const movies = await fetchMovies(url);
    console.log(movies)
    renderMovies(movies, allMoviesGrid);
}

function updatePagination() {
    pagination.innerHTML = '';
    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            currentPage--;
            loadSearchedMovies();
        });
        pagination.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            loadSearchedMovies();
        });
        pagination.appendChild(nextButton);
    }
}
