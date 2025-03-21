document.addEventListener("DOMContentLoaded", () => {
    console.log("Search.js Loaded!");

    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");

    if (!searchQuery) {
        document.getElementById("latest").innerText = "No Search Query Provided!";
        return;
    }

    document.getElementById("latest").innerText = `Search Results: ${searchQuery}`;
    
    // Show loading image
    document.getElementById("load").style.display = "block";

    // Define GraphQL query for searching anime
    const query = `
        query ($search: String) {
            Page (perPage: 20) {
                media (search: $search, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        large
                    }
                    bannerImage
                }
            }
        }
    `;

    // Fetch data from Anilist API
    fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query,
            variables: { search: searchQuery }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Search Results:", data);
        
        // Hide loading image
        document.getElementById("load").style.display = "none";
        
        // Show results container
        const resultsContainer = document.getElementById("latest2");
        resultsContainer.style.display = "flex";
        resultsContainer.innerHTML = ""; // Clear previous results
        
        // If no results
        if (!data.data || !data.data.Page.media.length) {
            resultsContainer.innerHTML = "<p>No results found!</p>";
            return;
        }

        // Generate anime cards
        data.data.Page.media.forEach(anime => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-card");
            animeCard.innerHTML = `
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-image"/>
                <p class="anime-title">${anime.title.romaji}</p>
            `;

            // Redirect to anime.html with ID
            animeCard.addEventListener("click", () => {
                window.location.href = `/p/anime.html?id=${anime.id}`;
            });

            resultsContainer.appendChild(animeCard);
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("error-page").style.display = "block";
        document.getElementById("error-desc").innerText = error.message;
    });
});
