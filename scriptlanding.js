// Random Videos 
// --- DYNAMIC RANDOM VIDEO INJECTOR ---

// 1. Define your complete pool of videos. 
// Just list all the video filenames you have inside the 'stock_videos' folder.
const availableVideos = [
    "video1.mp4",
    "video2.mp4",
    "video3.mp4",
    "video4.mp4",
    "video5.mp4",
    "video6.mp4",
    "video7.mp4",
    "video8.mp4",
    "video9.mp4",
    "video10.mp4",
    "video11.mp4",
    "video12.mp4",
    "video13.mp4",
    "video14.mp4",
    "video15.mp4"
];

// 2. Define the videos that have baked-in black bars (Portrait videos)
// Update these filenames based on your actual stock footage!
const videosWithBlackBars = [
    "video3.mp4", 
    "video9.mp4",
    "video10.mp4"
];

function shuffleArray(array) {
    let shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

document.addEventListener("DOMContentLoaded", () => {
    const videoElements = document.querySelectorAll(".video-panel video");
    const randomVideos = shuffleArray(availableVideos);

    videoElements.forEach((video, index) => {
        if (!randomVideos[index]) return;

        const videoFile = randomVideos[index];
        const sourceTag = video.querySelector("source");
        if (!sourceTag) return;

        // let debugLabel = document.createElement("div");
        // debugLabel.innerText = videoFile;
        // debugLabel.style.cssText = "position:absolute; top:20px; left:20px; background:#f4d03f; color:#000; font-weight:bold; font-size:12px; padding:6px 10px; border-radius:8px; z-index:999;";
        // video.parentElement.appendChild(debugLabel);
        
        // --- NEW CODE: Instantly flag the baked-in portrait videos ---
        if (videosWithBlackBars.includes(videoFile)) {
            video.parentElement.classList.add('is-portrait');
        }
        // -------------------------------------------------------------

        // 1. INSTANTLY assign the thumbnail poster
        const thumbnailFile = videoFile.replace(".mp4", ".webp");
        video.poster = `thumbnails/${thumbnailFile}`;

        // 2. STAGGER the heavy video loading (Wait 250ms per video)
        // This ensures thumbnails load instantly, and videos load sequentially in the background.
      // CENTER VIDEO LOADS IMMEDIATELY
if (index === 2) {

    sourceTag.src = `stock_videos/${videoFile}`;
    video.load();

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    video.addEventListener('canplay', () => {
        video.classList.add('is-loaded');
    });

    video.play().catch(() => {});

} else {

    // LOAD SIDE VIDEOS AFTER PAGE LOAD
    window.addEventListener('load', () => {

        sourceTag.src = `stock_videos/${videoFile}`;
        video.load();

        video.muted = true;
        video.playsInline = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');

        video.addEventListener('canplay', () => {
            video.classList.add('is-loaded');
        });

        video.play().catch(() => {});

    });

}// index 0 loads instantly, index 1 at 250ms, index 2 at 500ms, etc.
    });
});