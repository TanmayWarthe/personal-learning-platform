const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  // 🔴 DEBUG LINE (VERY IMPORTANT)
  // console.log("YOUTUBE API RESPONSE:", data);

  // 🛑 SAFETY CHECK
  if (!data.items) {
    throw new Error(
      data.error?.message || "Failed to fetch playlist videos"
    );
  }

  return data.items.map((item) => ({
    title: item.snippet.title,
    youtube_video_id: item.snippet.resourceId.videoId,
    position: item.snippet.position + 1,
  }));
}

module.exports = fetchPlaylistVideos;
