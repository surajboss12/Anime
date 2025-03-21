// Get anime ID from URL
function getAnimeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// Fetch anime details from AniList API
async function fetchAnimeDetails() {
    const animeId = getAnimeId();
    if (!animeId) return;

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

        const { data } = await response.json();
        displayAnimeDetails(data.Media);
    } catch (error) {
        console.error("Error fetching anime details:", error);
    }
}

// Display anime details
function displayAnimeDetails(anime) {
    document.getElementById("anime-banner").style.backgroundImage = `url('${anime.bannerImage}')`;
    document.getElementById("anime-cover").src = anime.coverImage.large;
    document.getElementById("anime-title").textContent = anime.title.english || anime.title.romaji;

    document.getElementById("anime-airing").textContent = anime.nextAiringEpisode
        ? `Ep ${anime.nextAiringEpisode.episode} in ${anime.nextAiringEpisode.timeUntilAiring} secs`
        : "Completed";
    document.getElementById("anime-format").textContent = anime.format;
    document.getElementById("anime-episodes").textContent = anime.episodes || "Unknown";
    document.getElementById("anime-duration").textContent = anime.duration + " min";
    document.getElementById("anime-status").textContent = anime.status;
    document.getElementById("anime-start-date").textContent = `${anime.startDate.day}/${anime.startDate.month}/${anime.startDate.year}`;
    document.getElementById("anime-season").textContent = anime.season;
    document.getElementById("anime-studios").textContent = anime.studios.nodes.map(studio => studio.name).join(", ");
    document.getElementById("anime-producers").textContent = anime.producers.nodes.map(prod => prod.name).join(", ");
    document.getElementById("anime-source").textContent = anime.source;
    document.getElementById("anime-genres").textContent = anime.genres.join(", ");
    document.getElementById("anime-description").innerHTML = anime.description;

    // Trailer
    if (anime.trailer) {
        document.getElementById("anime-trailer").innerHTML = `<iframe src="https://www.youtube.com/embed/${anime.trailer.id}" allowfullscreen></iframe>`;
    }
}

document.addEventListener("DOMContentLoaded", fetchAnimeDetails);
