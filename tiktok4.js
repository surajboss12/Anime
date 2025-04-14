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

  console.log(`Fetching videos for keyword: ${keyword}`);

  try {
    const url = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(keyword)}`;
    console.log(`Request URL: ${url}`);

    const response = await fetch(url);
    const result = await response.json();

    console.log("API response received:");
    console.log(result);  // Log the full API response to inspect

    // Check if "data" exists and is an object
    if (!result.data || typeof result.data !== 'object') {
      console.error('"data" is not an object, it is:', typeof result.data);
      videoFeed.innerHTML = "<p class='loading'>No videos found or invalid response.</p>";
      return;
    }

    console.log('Data object received:', result.data);

    // Check if there's a property containing videos (e.g., result.data.videos)
    const videos = result.data.videos || [];
    console.log(`Found ${videos.length} videos.`);

    if (videos.length === 0) {
      videoFeed.innerHTML = "<p class='loading'>No videos found in the data.</p>";
      return;
    }

    videoFeed.innerHTML = ""; // Clear previous content

    videos.forEach((video, index) => {
      console.log(`Processing video ${index + 1}:`);
      console.log(video);

      if (!video.play) {
        console.warn('No video URL found for this video:', video);
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const videoElement = document.createElement("video");
      videoElement.src = video.play;  // Ensure the correct URL is used
      videoElement.controls = true;
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;

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

    console.log('All videos processed and added to the feed.');
  } catch (err) {
    videoFeed.innerHTML = `<p class='loading'>Error loading videos. Try again later.</p>`;
    console.error("Fetch error:", err);
  }
}

// Load videos on page load
fetchVideos();
