const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId) {
  const allVideos = [];
  let nextPageToken = null;

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    // 🛑 SAFETY CHECK
    if (!data.items) {
      throw new Error(
        data.error?.message || "Failed to fetch playlist videos"
      );
    }

    // Map items to video objects
    const videos = data.items.map((item) => ({
      title: item.snippet.title,
      youtube_video_id: item.snippet.resourceId.videoId,
      position: item.snippet.position + 1,
    }));

    allVideos.push(...videos);
    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);

  return allVideos;
}

module.exports = fetchPlaylistVideos;
