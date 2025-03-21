// Define AniList GraphQL API endpoint
const ANILIST_API = "https://graphql.anilist.co";

// GraphQL query for trending, popular this season, and upcoming next season
const query = `
query {
  trending: Page(page: 1, perPage: 10) {
    media(sort: TRENDING_DESC, type: ANIME) {
      id
      title {
        romaji
      }
      coverImage {
        large
      }
      seasonYear
      format
    }
  }
  
  popularThisSeason: Page(page: 1, perPage: 10) {
    media(season: SPRING, seasonYear: 2025, sort: POPULARITY_DESC, type: ANIME) {
      id
      title {
        romaji
      }
      coverImage {
        large
      }
    }
  }
  
  upcomingNextSeason: Page(page: 1, perPage: 10) {
    media(season: SUMMER, seasonYear: 2025, sort: POPULARITY_DESC, type: ANIME) {
      id
      title {
        romaji
      }
      coverImage {
        large
      }
    }
  }
}
`;

// Function to fetch data from AniList API
async function fetchAnimeData() {
    try {
        const response = await fetch(ANILIST_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        const { data } = await response.json();
        displayAnime(data.trending.media, ".recento"); // Trending
        displayAnime(data.popularThisSeason.media, ".popularg"); // Popular This Season
        displayAnime(data.upcomingNextSeason.media, ".upcoming"); // Upcoming Next Season
    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
}

// Function to display anime data in the given section
function displayAnime(animeList, sectionClass) {
    const section = document.querySelector(sectionClass);
    if (!section) return;

    section.innerHTML = ""; // Clear previous content

    animeList.forEach((anime) => {
        const animeCard = document.createElement("div");
        animeCard.className = "anime-card";
        animeCard.innerHTML = `
            <a href="https://anilist.co/anime/${anime.id}" target="_blank">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <p>${anime.title.romaji}</p>
            </a>
        `;
        section.appendChild(animeCard);
    });
}

// Run the function on page load
document.addEventListener("DOMContentLoaded", fetchAnimeData);
