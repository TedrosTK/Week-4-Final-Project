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

    // Add event listener for search button click
    searchBtn.addEventListener('click', searchHandler);

    // Add event listener for Enter key press in the search input field
    searchInput.addEventListener('keyup', searchHandler);

    // searchBtn.addEventListener('click', () => {
    //     const keyword = searchInput.value.trim();
    //     if (keyword) {
    //         fetchAndDisplayMovies(keyword, 1);
    //     }
    // });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        // filmsList.innerHTML = '';
        pagination.innerHTML = '';
        clearSearchResultsText();
        fetchAndDisplayRandomMovies();
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
            console.log(data)
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
            const moviesData = await fetchMovies(keyword, page);
            const movies = moviesData.results;
            totalPages = Math.ceil(movies.length / 6);
            currentPage = page;
            const start = (currentPage - 1) * 6;
            const end = start + 6;
            const paginatedMovies = movies.slice(start, end);
            displayMovies(paginatedMovies);
            displayPagination(totalPages, currentPage);
            updateFilmsListClass(paginatedMovies.length);
            if (keyword) {
                displaySearchResultsText();
            }
            
            // const movies = await fetchMovies(keyword, page);
            // totalPages = movies.total_pages;
            // currentPage = page;
            // displayMovies(movies.results);
            // displayPagination(totalPages, currentPage);
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


    function initiateSearch() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            fetchAndDisplayMovies(keyword, 1);
        }
    }

    // Event listener for both click and Enter key press
    function searchHandler(event) {
        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
            event.preventDefault(); // Prevent the default action (form submission) for Enter key press
            initiateSearch(); // Call the search function
        }
    }


    function getRandomMovies(movies, count) {
        const shuffled = movies.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayMovies(movies) {
        const placeholderImage = 'https://placeholder.pics/svg/500x750/DAD7DA/0C0C0C-F9FFF6/No%20Image%20available'; // Placeholder image UR
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
        // pagination.innerHTML = `
        //     <button class="pagination-btn" data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>Previous Page</button>
        //     <button class="pagination-btn" data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>Next Page</button>
        // `;
    }
    function updateFilmsListClass(numberOfMovies) {
        if (numberOfMovies <= 6) {
            filmsList.classList.remove('filmsList--many');
            filmsList.classList.add('filmsList--few');
        } else {
            filmsList.classList.remove('filmsList--few');
            filmsList.classList.add('filmsList--many');
        }
    }

    function displaySearchResultsText() {
        const moviesContainer = document.getElementById('searchResults');
        const searchResultsText = document.createElement('div');
        searchResultsText.textContent = 'Search Results...';
        searchResultsText.classList.add('search-results-text'); // Add a class for styling
        
        // Check if search results text already exists, if not, append it
        if (!document.querySelector('.search-results-text')) {
            moviesContainer.insertAdjacentElement('afterbegin', searchResultsText);
        }
    }
    
    function clearSearchResultsText() {
        const searchResultsText = document.querySelector('.search-results-text');
        if (searchResultsText) {
            searchResultsText.remove();
        }
    }

    function extractYear(releaseDate) {
        return releaseDate.split('-')[0];
    }


    

    

    // Fetch and display random movies when the page first loads
    fetchAndDisplayRandomMovies();
});
