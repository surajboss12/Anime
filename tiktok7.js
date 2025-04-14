const videoFeed = document.getElementById("videoFeed");
const searchInput = document.getElementById("searchInput");

const randomKeywords = [
  "funny", "dance", "cat", "dog", "viral", "life", "music", "food", "art", "gaming"
];

let isLoading = false;
let currentKeyword = getRandomKeyword();

function getRandomKeyword() {
  const index = Math.floor(Math.random() * randomKeywords.length);
  return randomKeywords[index];
}

function getSearchKeyword() {
  const input = searchInput.value.trim();
  return input !== "" ? input : getRandomKeyword();
}

async function fetchVideos(isSearch = false) {
  if (isLoading) return;
  isLoading = true;

  currentKeyword = getSearchKeyword();
  console.log(`Fetching videos for keyword: ${currentKeyword}`);

  try {
    const response = await fetch(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(currentKeyword)}`);
    const result = await response.json();
    const videos = result.data.videos || [];

    if (!Array.isArray(videos)) {
      console.error("Invalid video data:", result.data);
      return;
    }

    if (isSearch) {
      videoFeed.innerHTML = ""; // Clear on new search
    }

    videos.forEach(video => {
      if (!video.play) return;

      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const videoElement = document.createElement("video");
      videoElement.src = video.play;
      videoElement.controls = false;
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;
      videoElement.setAttribute("preload", "none");

      const overlay = document.createElement("div");
      overlay.className = "video-overlay";
      overlay.innerHTML = `
        <p><strong>@${video.author.nickname || "Unknown"}</strong></p>
        <p>${video.title || "No title"}</p>
        <p>Likes: ${video.digg_count || 0}</p>
      `;

      wrapper.appendChild(videoElement);
      wrapper.appendChild(overlay);
      videoFeed.appendChild(wrapper);
    });

    observeVideos();
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isLoading = false;
  }
}

function observeVideos() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.75,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector("video");
      if (!video) return;
      if (entry.isIntersecting) {
        video.play().catch(err => console.warn("Autoplay failed:", err));
      } else {
        video.pause();
      }
    });
  }, options);

  const wrappers = document.querySelectorAll(".video-wrapper");
  wrappers.forEach(wrapper => observer.observe(wrapper));
}

// Infinite scroll
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log("Bottom reached — loading more videos...");
      fetchVideos();
    }
  });
}, {
  root: null,
  rootMargin: "100px",
  threshold: 0,
});

const sentinel = document.createElement("div");
sentinel.id = "scroll-sentinel";
document.body.appendChild(sentinel);
scrollObserver.observe(sentinel);

// Listen for Enter key on the search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchVideos(true); // true = this is a fresh search
  }
});

// Initial load
fetchVideos();
