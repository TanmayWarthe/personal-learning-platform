const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylistVideos(playlistId) {
  console.log("Fetching playlist videos for:", playlistId);
  console.log("YouTube API Key present:", !!YOUTUBE_API_KEY);
  
  const allVideos = [];
  let nextPageToken = null;

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    console.log("Fetching from YouTube API...");
    const response = await fetch(url);
    const data = await response.json();

    console.log("YouTube API response status:", response.status);
    
    if (!data.items) {
      console.error("YouTube API error:", data.error);
      throw new Error(
        data.error?.message || "Failed to fetch playlist videos"
      );
    }

    console.log(`Fetched ${data.items.length} videos from this page`);

    const videos = data.items.map((item) => ({
      title: item.snippet.title,
      youtube_video_id: item.snippet.resourceId.videoId,
      position: item.snippet.position + 1,
    }));

    allVideos.push(...videos);
    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);

  console.log(`Total videos fetched: ${allVideos.length}`);
  return allVideos;
}

module.exports = fetchPlaylistVideos;
