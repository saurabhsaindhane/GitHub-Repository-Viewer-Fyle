
let currentPage = 1;
const reposPerPage = 6;
let allRepos = [];

document.getElementById('searchButton').addEventListener('click', function() {
    const username = document.getElementById('usernameInput').value;
    if (username) {
        currentPage = 1; // Reset 
        fetchUserProfile(username);
        fetchRepositories(username);
    }
});

function fetchUserProfile(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(user => {
            displayUserProfile(user);
        })
        .catch(error => {
            console.error('Error:', error);
            displayUserNotFound(error.message);
        });
}

function displayUserProfile(user) {
    document.getElementById('userProfile').style.display = 'block';
    document.getElementById('profileImage').src = user.avatar_url;
    document.getElementById('username').textContent = user.login;
    document.getElementById('bio').textContent = user.bio;
    document.getElementById('location').textContent = user.location;
    document.getElementById('blog').href = user.blog;
    document.getElementById('blog').textContent = user.blog;
    document.getElementById('githubLink').href = user.html_url;
}
function displayUserNotFound(message) {
    // Clear previous 
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('repoList').innerHTML = '';

    //  not found message
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    errorMessage.style.textAlign = 'center';
    document.getElementById('repoList').appendChild(errorMessage);
}
function fetchRepositories(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            allRepos = repos; // Store 
            displayRepositories(); // Display 
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
        });
}

function displayRepositories() {
    const repoList = document.getElementById('repoList');
    repoList.innerHTML = ''; // Clear 

    // Calculate start and end index 
    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;

    // Display
    allRepos.slice(startIndex, endIndex).forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        repoCard.innerHTML = `
            <h3 class="repo-name">${repo.name}</h3>
            <p>${repo.description}</p>
            <p>Languages: ${repo.language}</p>
        `;
        repoList.appendChild(repoCard);
    });

    // Update 
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(allRepos.length / reposPerPage);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Clear

    // Create 
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayRepositories();
        });
        paginationDiv.appendChild(pageButton);
    }
}
