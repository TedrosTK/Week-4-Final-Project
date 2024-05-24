const API_KEY = 'b983a74c07c22bb8662915dbde85e9b5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const RESULTS_PER_PAGE = 6;

async function fetchMovies(keyword, page) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${keyword}&page=${page}`);
    const data = await response.json();
    return data;
}

function displayMovies(movies) {
    const filmsList = document.getElementById('filmsList');
    filmsList.innerHTML = '';
    movies.results.forEach(movie => {
        const movieCard = `
            <div class="film">
                <a href="movie-details.html?id=${movie.id}">
                    <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}" class="film__img">
                </a>
                <h2 class="films__title">${movie.title}</h2>
                <p class="films__body">${movie.overview}</p>
            </div>
        `;
        filmsList.innerHTML += movieCard;
    });
}

function displayPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<button class="btn pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput.value.trim();
    if (keyword !== '') {
        fetchAndDisplayMovies(keyword, 1);
    }
}

async function fetchAndDisplayMovies(keyword, page) {
    const movies = await fetchMovies(keyword, page);
    const totalPages = movies.total_pages;
    displayMovies(movies);
    displayPagination(totalPages, page);
}

document.getElementById('searchBtn').addEventListener('click', handleSearch);

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('pagination-btn')) {
        const page = parseInt(event.target.dataset.page);
        const keyword = document.getElementById('searchInput').value.trim();
        fetchAndDisplayMovies(keyword, page);
    }
});

document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    const keyword = document.getElementById('searchInput').value.trim();
    fetchAndDisplayMovies(keyword, 1);
});
