document.addEventListener("DOMContentLoaded", async function () {
    console.log("anime.js Loaded!"); // Debugging log

    function getAnimeIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        return id ? parseInt(id, 10) : null;
    }

    const animeId = getAnimeIdFromUrl();
    console.log("Anime ID:", animeId); // Debugging log

    if (!animeId) {
        document.body.innerHTML = "<h2>Error: No Anime ID found in URL</h2>";
        return;
    }

    const query = `
    query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id
            title {
                romaji
                english
                native
            }
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
            studios {
                nodes {
                    name
                    isAnimationStudio
                }
            }
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

    try {
        console.log("Fetching data from Anilist API..."); // Debugging log
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ query, variables: { id: animeId } })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        if (data.errors) {
            document.body.innerHTML = `<h2>Error: ${data.errors[0].message}</h2>`;
            return;
        }

        updateAnimePage(data.data.Media);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.body.innerHTML = `<h2>Error loading anime details: ${error.message}</h2>`;
    }

    function updateAnimePage(anime) {
        console.log("Updating page with anime data:", anime); // Debugging log

        document.title = anime.title.romaji || anime.title.english || "Anime Details";

        const bannerElement = document.getElementById("anime-banner");
        if (anime.bannerImage) {
            bannerElement.style.backgroundImage = `url(${anime.bannerImage})`;
            bannerElement.style.height = "200px";
            bannerElement.style.backgroundSize = "cover";
            bannerElement.style.backgroundPosition = "center";
        }

        document.getElementById("anime-cover").src = anime.coverImage.large;
        document.getElementById("anime-title").textContent = anime.title.romaji || anime.title.english || anime.title.native;

        if (anime.nextAiringEpisode) {
            const time = anime.nextAiringEpisode.timeUntilAiring;
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            const paddedEp = String(anime.nextAiringEpisode.episode).padStart(3, "0");

            document.getElementById("anime-airing").textContent =
                `EP ${paddedEp} airs in (${hours} hrs) (${minutes} min) (${seconds} sec)`;
        } else {
            document.getElementById("anime-airing").textContent = "No upcoming episodes";
        }

        document.getElementById("anime-format").textContent = anime.format || "N/A";
        document.getElementById("anime-episodes").textContent = anime.episodes || "Unknown";
        document.getElementById("anime-duration").textContent = anime.duration ? `${anime.duration} min` : "Unknown";
        document.getElementById("anime-status").textContent = anime.status || "Unknown";
        document.getElementById("anime-start-date").textContent = `${anime.startDate.year || "?"}-${anime.startDate.month || "?"}-${anime.startDate.day || "?"}`;
        document.getElementById("anime-season").textContent = `${anime.season || "?"} ${anime.seasonYear || "?"}`;
        document.getElementById("anime-source").textContent = anime.source || "Unknown";

        const studios = anime.studios.nodes.filter(studio => studio.isAnimationStudio).map(s => s.name).join(", ");
        const producers = anime.studios.nodes.filter(studio => !studio.isAnimationStudio).map(s => s.name).join(", ");

        document.getElementById("anime-studios").textContent = studios || "Unknown";
        document.getElementById("anime-producers").textContent = producers || "Unknown";
        document.getElementById("anime-genres").textContent = anime.genres.join(", ") || "Unknown";
        document.getElementById("anime-romanji").textContent = anime.title.romaji || "N/A";
        document.getElementById("anime-english").textContent = anime.title.english || "N/A";
        document.getElementById("anime-native").textContent = anime.title.native || "N/A";
        document.getElementById("anime-synonyms").textContent = anime.synonyms.length ? anime.synonyms.join(", ") : "None";

        document.getElementById("anime-description").innerHTML = anime.description || "<p>No description available.</p>";

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

        if (anime.trailer) {
            let trailerUrl = anime.trailer.site === "youtube"
                ? `https://www.youtube.com/embed/${anime.trailer.id}`
                : `https://www.dailymotion.com/video/${anime.trailer.id}`;
            document.getElementById("anime-trailer").innerHTML = `<iframe width="100%" height="300" src="${trailerUrl}" allowfullscreen></iframe>`;
        } else {
            document.getElementById("anime-trailer").innerHTML = "<p>No trailer available.</p>";
        }
    }
});
