const API_KEY = 'b983a74c07c22bb8662915dbde85e9b5';
const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const filmsList = document.getElementById('filmsList');
    const pagination = document.getElementById('pagination');
    const backToTopButton = document.getElementById('backToTop');
    const loadingSpinner = document.getElementById('loadingSpinner');

    let currentPage = 1;
    let totalPages = 1;

    searchBtn.addEventListener('click', searchHandler);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchHandler(event);
        }
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        pagination.innerHTML = '';
        clearSearchResultsText();
        fetchAndDisplayRandomMovies();
    });

    pagination.addEventListener('click', (event) => {
        if (event.target.classList.contains('pagination-btn')) {
            const targetPage = event.target.dataset.page === 'next' ? currentPage + 1 : currentPage - 1;
            if (targetPage > 0 && targetPage <= totalPages) {
                fetchAndDisplayMovies(searchInput.value.trim(), targetPage);
            }
        }
    });

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 200);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    async function fetchMovies(keyword, page) {
        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${keyword}&page=${page}`);
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        } catch (error) {
            console.error('Fetch error: ', error);
            alert('Failed to fetch movies. Please try again later.');
        }
    }

    async function fetchPopularMovies() {
        try {
            const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        } catch (error) {
            console.error('Fetch error: ', error);
            alert('Failed to fetch popular movies. Please try again later.');
        }
    }

    async function fetchAndDisplayMovies(keyword, page) {
        loadingSpinner.classList.add('show');
        try {
            const moviesData = await fetchMovies(keyword, page);
            if (!moviesData || !moviesData.results.length) {
                displayNoResults();
                return;
            }
            const movies = moviesData.results.slice(0, 6); // Limit to 6 movies per page
            totalPages = moviesData.total_pages;
            currentPage = page;
            displayMovies(movies);
            displayPagination(totalPages, currentPage);
            updateFilmsListClass(movies.length);
            if (keyword) displaySearchResultsText();
        } finally {
            loadingSpinner.classList.remove('show');
        }
    }

    async function fetchAndDisplayRandomMovies() {
        loadingSpinner.classList.add('show');
        try {
            const moviesData = await fetchPopularMovies();
            const randomMovies = getRandomMovies(moviesData.results, 4);
            displayMovies(randomMovies);
        } finally {
            loadingSpinner.classList.remove('show');
        }
    }

    function initiateSearch() {
        const keyword = searchInput.value.trim();
        if (keyword) fetchAndDisplayMovies(keyword, 1);
    }

    function searchHandler(event) {
        event.preventDefault();
        initiateSearch();
    }

    function getRandomMovies(movies, count) {
        const shuffled = movies.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayMovies(movies) {
        const placeholderImage = 'https://placeholder.pics/svg/500x750/DAD7DA/0C0C0C-F9FFF6/No%20Image%20available';
        filmsList.innerHTML = movies.map(movie => `
            <div class="movie">
                <div class="movie__cover">
                    <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : placeholderImage}" alt="${movie.title}" loading="lazy">
                </div>
                <div class="movie__title">${movie.title} (${extractYear(movie.release_date)})</div>
            </div>
        `).join('');
    }

    function displayPagination(totalPages, currentPage) {
        pagination.innerHTML = `
            <button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Previous Page</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next Page</button>
        `;
    }

    function updateFilmsListClass(numberOfMovies) {
        filmsList.classList.toggle('filmsList--few', numberOfMovies <= 6);
        filmsList.classList.toggle('filmsList--many', numberOfMovies > 6);
    }

    function displaySearchResultsText() {
        const moviesContainer = document.getElementById('searchResults');
        if (!document.querySelector('.search-results-text')) {
            const searchResultsText = document.createElement('div');
            searchResultsText.textContent = 'Search Results...';
            searchResultsText.classList.add('search-results-text');
            moviesContainer.insertAdjacentElement('afterbegin', searchResultsText);
        }
    }

    function clearSearchResultsText() {
        const searchResultsText = document.querySelector('.search-results-text');
        if (searchResultsText) searchResultsText.remove();
    }

    function displayNoResults() {
        filmsList.innerHTML = '<p>No movies found. Please try a different search.</p>';
    }

    function extractYear(releaseDate) {
        return releaseDate ? releaseDate.split('-')[0] : 'Unknown';
    }

    fetchAndDisplayRandomMovies();
});
