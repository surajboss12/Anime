// Get anime ID from URL
function getAnimeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// Fetch anime details from AniList API
async function fetchAnimeDetails() {
    const animeId = getAnimeId();
    if (!animeId) {
        document.getElementById("anime-details").innerHTML = "<p>Anime not found.</p>";
        return;
    }

    const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        format
        status
        genres
        averageScore
      }
    }`;

    try {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ query, variables: { id: parseInt(animeId) } }),
        });

        const { data } = await response.json();
        displayAnimeDetails(data.Media);
    } catch (error) {
        console.error("Error fetching anime details:", error);
    }
}

// Display anime details on the page
function displayAnimeDetails(anime) {
    const animeDetailsDiv = document.getElementById("anime-details");
    
    animeDetailsDiv.innerHTML = `
        <div class="anime-banner" style="background-image: url('${anime.bannerImage}')"></div>
        <div class="anime-container">
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}" class="anime-cover">
            <div class="anime-info">
                <h1>${anime.title.english || anime.title.romaji}</h1>
                <p><strong>Episodes:</strong> ${anime.episodes || "Unknown"}</p>
                <p><strong>Format:</strong> ${anime.format}</p>
                <p><strong>Status:</strong> ${anime.status}</p>
                <p><strong>Genres:</strong> ${anime.genres.join(", ")}</p>
                <p><strong>Score:</strong> ${anime.averageScore}/100</p>
                <p>${anime.description}</p>
            </div>
        </div>
    `;
}

// Load anime details on page load
document.addEventListener("DOMContentLoaded", fetchAnimeDetails);
