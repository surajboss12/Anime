const videoFeed = document.getElementById("videoFeed");
const randomKeywords = [
  "funny", "dance", "cat", "dog", "viral", "life", "music", "food", "art", "gaming"
];
let isLoading = false;

function getRandomKeyword() {
  const index = Math.floor(Math.random() * randomKeywords.length);
  return randomKeywords[index];
}

async function fetchVideos() {
  if (isLoading) return;
  isLoading = true;
  const keyword = getRandomKeyword();
  console.log(`Fetching videos for keyword: ${keyword}`);

  try {
    const response = await fetch(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(keyword)}`);
    const result = await response.json();
    const videos = result.data.videos || [];

    if (!Array.isArray(videos)) {
      console.error("Invalid video data:", result.data);
      return;
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

// Infinite scroll when reaching near the bottom
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    fetchVideos();
  }
});

// Initial load
fetchVideos();
