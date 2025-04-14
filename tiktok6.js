const videoFeed = document.getElementById("videoFeed");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const randomKeywords = [
  "funny", "dance", "cat", "dog", "viral", "life", "music", "food", "art", "gaming"
];

let isLoading = false;
let currentKeyword = getRandomKeyword();

function getRandomKeyword() {
  const index = Math.floor(Math.random() * randomKeywords.length);
  return randomKeywords[index];
}

async function fetchVideos(isSearch = false) {
  if (isLoading) return;
  isLoading = true;

  const keyword = currentKeyword;
  console.log(`Fetching videos for keyword: ${keyword}`);

  try {
    const response = await fetch(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(keyword)}`);
    const result = await response.json();
    const videos = result.data.videos || [];

    if (!Array.isArray(videos)) {
      console.error("Invalid video data:", result.data);
      return;
    }

    if (isSearch) {
      videoFeed.innerHTML = ""; // Clear feed on new search
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

    observeVideos(); // Refresh observers
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

// Infinite scroll observer
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

// Add a sentinel div at bottom for infinite scroll detection
const sentinel = document.createElement("div");
sentinel.id = "scroll-sentinel";
document.body.appendChild(sentinel);
scrollObserver.observe(sentinel);

// Search button handler
searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (keyword) {
    currentKeyword = keyword;
    fetchVideos(true); // true = this is a fresh search
  }
});

// Initial load
fetchVideos();
