document.addEventListener("DOMContentLoaded", function () {
    // Function to extract anime ID from URL
    function getAnimeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id"); // Ensure the link has ?id=ANIME_ID
    }

    const animeId = getAnimeIdFromUrl();
    
    if (!animeId) {
        document.body.innerHTML = "<h2>Error: No Anime ID found in URL</h2>";
        return;
    }

    // Anilist GraphQL Query
    const query = `
    query ($id: Int) {
        Media(id: $id, type: ANIME) {
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
            characters(perPage: 10) {
                edges {
                    node {
                        name { full }
                        image { large }
                    }
                }
            }
            trailer { site id }
        }
    }`;

    // Fetch Anime Data
    fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: { id: parseInt(animeId) }
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            document.body.innerHTML = "<h2>Error: Anime not found</h2>";
            return;
        }

        const anime = data.data.Media;
        updateAnimePage(anime);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.body.innerHTML = "<h2>Error loading anime details</h2>";
    });

    // Function to Update the Page with Anime Details
    function updateAnimePage(anime) {
        document.title = anime.title.romaji || anime.title.english || "Anime Details";

        // Set banner image
        const bannerElement = document.getElementById("anime-banner");
        if (anime.bannerImage) {
            bannerElement.style.backgroundImage = `url(${anime.bannerImage})`;
            bannerElement.style.height = "200px";
            bannerElement.style.backgroundSize = "cover";
            bannerElement.style.backgroundPosition = "center";
        }

        // Set cover image
        document.getElementById("anime-cover").src = anime.coverImage.large;

        // Set titles
        document.getElementById("anime-title").textContent = anime.title.romaji || anime.title.english || anime.title.native;

        // Set metadata
        document.getElementById("anime-airing").innerHTML = anime.nextAiringEpisode
            ? `Ep ${anime.nextAiringEpisode.episode} airs in ${Math.floor(anime.nextAiringEpisode.timeUntilAiring / 3600)} hrs`
            : "No upcoming episodes";
        document.getElementById("anime-format").textContent = anime.format;
        document.getElementById("anime-episodes").textContent = anime.episodes || "Unknown";
        document.getElementById("anime-duration").textContent = anime.duration ? `${anime.duration} min` : "Unknown";
        document.getElementById("anime-status").textContent = anime.status;
        document.getElementById("anime-start-date").textContent = `${anime.startDate.year || "?"}-${anime.startDate.month || "?"}-${anime.startDate.day || "?"}`;
        document.getElementById("anime-season").textContent = `${anime.season} ${anime.seasonYear}`;
        document.getElementById("anime-source").textContent = anime.source || "Unknown";
        document.getElementById("anime-studios").textContent = anime.studios.nodes.map(s => s.name).join(", ") || "Unknown";
        document.getElementById("anime-producers").textContent = anime.producers.nodes.map(p => p.name).join(", ") || "Unknown";
        document.getElementById("anime-genres").textContent = anime.genres.join(", ");
        document.getElementById("anime-romanji").textContent = anime.title.romaji || "N/A";
        document.getElementById("anime-english").textContent = anime.title.english || "N/A";
        document.getElementById("anime-native").textContent = anime.title.native || "N/A";
        document.getElementById("anime-synonyms").textContent = anime.synonyms.join(", ") || "None";

        // Set description
        document.getElementById("anime-description").innerHTML = anime.description || "No description available.";

        // Characters
        let charactersHtml = "";
        anime.characters.edges.forEach(char => {
            charactersHtml += `
                <div class="character">
                    <img src="${char.node.image.large}" alt="${char.node.name.full}" />
                    <p>${char.node.name.full}</p>
                </div>
            `;
        });
        document.getElementById("anime-characters").innerHTML = charactersHtml;

        // Trailer
        if (anime.trailer) {
            let trailerUrl = anime.trailer.site === "youtube"
                ? `https://www.youtube.com/embed/${anime.trailer.id}`
                : `https://www.dailymotion.com/video/${anime.trailer.id}`;
            document.getElementById("anime-trailer").innerHTML = `<iframe src="${trailerUrl}" allowfullscreen></iframe>`;
        } else {
            document.getElementById("anime-trailer").innerHTML = "<p>No trailer available</p>";
        }
    }
});
