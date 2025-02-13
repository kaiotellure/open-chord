
document.addEventListener("keydown", (event) => {
  if (event.key != "c") return;

  const video = document.querySelector("video");
  if (video) {
    navigator.clipboard.writeText(video.currentTime.toFixed(2));
    video.pause();
  }
});
