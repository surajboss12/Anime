// Function to get anime ID from URL
function getAnimeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Ensure URL has ?id=ANIME_ID
}

// Function to fetch anime details
async function fetchAnimeDetails() {
    const animeId = getAnimeId();
    if (!animeId) {
        console.error("Anime ID not found in URL.");
        document.getElementById("anime-title").textContent = "Anime Not Found!";
        return;
    }

    console.log(`Fetching details for Anime ID: ${animeId}`);

    const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
        bannerImage
        description
        episodes
        duration
        format
        status
        season
        seasonYear
        startDate { year month day }
        source
        studios { nodes { name } }
        producers { nodes { name } }
        genres
        synonyms
        nextAiringEpisode { episode timeUntilAiring }
        characters (perPage: 10) {
          edges { node { name { full } image { large } } }
        }
        trailer { site id }
      }
    }`;

    try {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables: { id: parseInt(animeId) } }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const { data } = await response.json();
        if (!data || !data.Media) {
            throw new Error("No data found for this anime.");
        }

        console.log("Anime data received:", data.Media);
        displayAnimeDetails(data.Media);
    } catch (error) {
        console.error("Error fetching anime details:", error);
        document.getElementById("anime-title").textContent = "Error Loading Anime!";
    }
}

// Function to display anime details
function displayAnimeDetails(anime) {
    document.getElementById("anime-banner").style.backgroundImage = anime.bannerImage
        ? `url('${anime.bannerImage}')`
        : "none";
    
    document.getElementById("anime-cover").src = anime.coverImage.large || "/default-cover.jpg";
    document.getElementById("anime-title").textContent = anime.title.english || anime.title.romaji || anime.title.native;

    document.getElementById("anime-airing").textContent = anime.nextAiringEpisode
        ? `Ep ${anime.nextAiringEpisode.episode} in ${Math.floor(anime.nextAiringEpisode.timeUntilAiring / 86400)} days`
        : "Completed";
    document.getElementById("anime-format").textContent = anime.format || "N/A";
    document.getElementById("anime-episodes").textContent = anime.episodes || "Unknown";
    document.getElementById("anime-duration").textContent = anime.duration ? `${anime.duration} min` : "Unknown";
    document.getElementById("anime-status").textContent = anime.status || "Unknown";
    document.getElementById("anime-start-date").textContent = anime.startDate.year
        ? `${anime.startDate.day || "?"}/${anime.startDate.month || "?"}/${anime.startDate.year}`
        : "Unknown";
    document.getElementById("anime-season").textContent = anime.season ? `${anime.season} ${anime.seasonYear}` : "Unknown";
    document.getElementById("anime-studios").textContent = anime.studios.nodes.map(s => s.name).join(", ") || "Unknown";
    document.getElementById("anime-producers").textContent = anime.producers.nodes.map(p => p.name).join(", ") || "Unknown";
    document.getElementById("anime-source").textContent = anime.source || "Unknown";
    document.getElementById("anime-genres").textContent = anime.genres.join(", ") || "Unknown";
    document.getElementById("anime-romanji").textContent = anime.title.romaji || "Unknown";
    document.getElementById("anime-english").textContent = anime.title.english || "Unknown";
    document.getElementById("anime-native").textContent = anime.title.native || "Unknown";
    document.getElementById("anime-synonyms").textContent = anime.synonyms.length > 0 ? anime.synonyms.join(", ") : "None";

    document.getElementById("anime-description").innerHTML = anime.description || "No description available.";

    const charactersContainer = document.getElementById("anime-characters");
    charactersContainer.innerHTML = "";
    anime.characters.edges.forEach(character => {
        const charCard = document.createElement("div");
        charCard.classList.add("character-card");
        charCard.innerHTML = `
            <img src="${character.node.image.large}" alt="${character.node.name.full}">
            <p>${character.node.name.full}</p>
        `;
        charactersContainer.appendChild(charCard);
    });

    const trailerContainer = document.getElementById("anime-trailer");
    trailerContainer.innerHTML = "";
    if (anime.trailer && anime.trailer.site === "youtube") {
        trailerContainer.innerHTML = `
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${anime.trailer.id}" frameborder="0" allowfullscreen></iframe>
        `;
    } else {
        trailerContainer.innerHTML = "<p>No trailer available.</p>";
    }
}

// Run function on page load
document.addEventListener("DOMContentLoaded", fetchAnimeDetails);
