import { tracks } from "./config";

const jukebox = document.getElementById("jukebox")!;
const videoPlayer = document.getElementById("video-player")!;
const audioPlayer = document.getElementById(
  "audio-player"
)! as HTMLAudioElement;
const volumeControl = document.getElementById(
  "volume-control"
)! as HTMLInputElement;

function render() {
  const [w, h] = [280, 32];
  const offsetY = 10;
  const offsetX = 5;
  for (const track of tracks) {
    const [x, y] = track.pos;
    const div = document.createElement("div");
    div.className = "track z-10  absolute mt-1 px-[5px] py-[10px]";
    div.style.top = `${y - offsetY}px`;
    div.style.left = `${x - offsetX}px`;
    div.style.width = `${w + offsetX}px`;
    div.style.height = `${h + offsetY}px`;
    div.innerHTML = `<span class="track-content hover:animate-marquee">${track.title}</span>`;
    div.title = track.title;
    div.addEventListener("click", (ev) => {
      div.querySelectorAll(".track").forEach((t) => {
        t.classList.remove("font-bold");
      });
      div.classList.toggle("font-bold", true);
      document.documentElement.classList.toggle("bg-black", !!track.dark);
      document.documentElement.classList.toggle("text-white", !!track.dark);
      videoPlayer.setAttribute("src", `/static/${track.clip}`);
      audioPlayer.setAttribute("src", `/static/${track.audio}`);
      audioPlayer.play();
    });
    jukebox?.appendChild(div);
  }

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = parseFloat(volumeControl.value);
  });
}

document.addEventListener("DOMContentLoaded", render);
