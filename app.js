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

    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            fetchAndDisplayMovies(keyword, 1);
        }
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filmsList.innerHTML = '';
        pagination.innerHTML = '';
    });

    pagination.addEventListener('click', (event) => {
        if (event.target.classList.contains('pagination-btn')) {
            if (event.target.dataset.page === 'next') {
                if (currentPage < totalPages) {
                    fetchAndDisplayMovies(searchInput.value.trim(), currentPage + 1);
                }
            } else if (event.target.dataset.page === 'prev') {
                if (currentPage > 1) {
                    fetchAndDisplayMovies(searchInput.value.trim(), currentPage - 1);
                }
            }
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    async function fetchMovies(keyword, page) {
        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${keyword}&page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error: ', error);
            alert('Failed to fetch movies. Please try again later.');
        }
    }

    async function fetchPopularMovies() {
        try {
            const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Fetch error: ', error);
            alert('Failed to fetch popular movies. Please try again later.');
        }
    }

    async function fetchAndDisplayMovies(keyword, page) {
        loadingSpinner.classList.add('show');
        try {
            
            const movies = await fetchMovies(keyword, page);
            totalPages = movies.total_pages;
            currentPage = page;
            displayMovies(movies.results);
            displayPagination(totalPages, currentPage);
        } finally {
            loadingSpinner.classList.remove('show');
        }
    }

    async function fetchAndDisplayRandomMovies() {
        loadingSpinner.classList.add('show');
        try {
            const movies = await fetchPopularMovies();
            const randomMovies = getRandomMovies(movies, 4);
            displayMovies(randomMovies);
        } finally {
            loadingSpinner.classList.remove('show');
        }
    }

    function getRandomMovies(movies, count) {
        const shuffled = movies.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
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

    function displayPagination(totalPages, currentPage) {
        pagination.innerHTML = `
            <button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Previous Page</button>
            <button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next Page</button>
        `;
    }

    // Fetch and display random movies when the page first loads
    fetchAndDisplayRandomMovies();
});
