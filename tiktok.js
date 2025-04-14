const videoFeed = document.getElementById("videoFeed");

const randomKeywords = [
  "funny", "dance", "cat", "dog", "viral", "life", "music", "food", "art", "gaming"
];

function getRandomKeyword() {
  const index = Math.floor(Math.random() * randomKeywords.length);
  return randomKeywords[index];
}

async function fetchVideos() {
  const keyword = getRandomKeyword();
  videoFeed.innerHTML = "<p class='loading'>Loading random videos...</p>";

  try {
    const url = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(keyword)}`;
    const response = await fetch(url);
    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      videoFeed.innerHTML = "<p class='loading'>No videos found.</p>";
      return;
    }

    videoFeed.innerHTML = ""; // Clear previous content

    result.data.forEach(video => {
      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const videoElement = document.createElement("video");
      videoElement.src = video.play;
      videoElement.controls = true;
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;

      const overlay = document.createElement("div");
      overlay.className = "video-overlay";
      overlay.innerHTML = `
        <p><strong>@${video.author.nickname}</strong></p>
        <p>${video.title || "No title"}</p>
        <p>Likes: ${video.digg_count || 0}</p>
      `;

      wrapper.appendChild(videoElement);
      wrapper.appendChild(overlay);
      videoFeed.appendChild(wrapper);
    });
  } catch (err) {
    videoFeed.innerHTML = `<p class='loading'>Error loading videos. Try again later.</p>`;
    console.error(err);
  }
}

// Load videos on page load
fetchVideos();
