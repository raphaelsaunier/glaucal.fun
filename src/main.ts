import PanZoom from "panzoom";
import { tracks } from "./config";

const jukebox = document.getElementById("jukebox")!;
const videoPlayer = document.getElementById("video-player")!;
const audioPlayer = document.getElementById(
  "audio-player"
)! as HTMLAudioElement;
const volumeControl = document.getElementById(
  "volume-control"
)! as HTMLInputElement;

const block = (e: TouchEvent) => {
  if (jukebox.contains(e.target as Node)) e.preventDefault();
};

document.addEventListener("gesturestart", block as EventListener);
document.addEventListener("gesturechange", block as EventListener);

function render() {
  const [w, h] = [280, 32];
  const offsetY = 10;
  const offsetX = 5;
  for (const track of tracks) {
    const [x, y] = track.pos;
    const div = document.createElement("div");
    div.className = "track z-10  absolute mt-2 px-[5px] py-[10px]";
    div.style.top = `${y - offsetY}px`;
    div.style.left = `${x - offsetX}px`;
    div.style.width = `${w + offsetX}px`;
    div.style.height = `${h + offsetY}px`;
    div.innerHTML = `<span class="track-content hover:animate-marquee">${track.title}</span>`;
    div.title = track.title;
    div.addEventListener("click", (ev) => {
      document.querySelectorAll(".track.active").forEach((t) => {
        t.classList.remove("active");
      });
      div.classList.add("active");
      document.documentElement.classList.toggle("dark", !!track.dark);
      document.documentElement.classList.toggle("light", !!track.dark);
      videoPlayer.setAttribute("src", `/static/${track.clip}`);
      audioPlayer.setAttribute("src", `/static/${track.audio}`);
      audioPlayer.play();
    });
    jukebox?.appendChild(div);
  }

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = parseFloat(volumeControl.value);
  });

  const panZoom = PanZoom(jukebox, {
    maxZoom: 2,
    minZoom: 0.2,
    // transformOrigin: { x: 0.5, y: 0.5 },
    bounds: true,
    boundsPadding: 0.1,
    onTouch: (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.classList.contains("track")
      )
        return false;
    },
  });

  const availableWidth = window.innerWidth;
  const availableHeight = window.innerHeight;

  // Calculate the scale to contain the video in middle of the available space
  const scale = Math.min(availableWidth / 2550, availableHeight / 1440);
  const x = (availableWidth - 2550 * scale) / 2;
  const y = (availableHeight - 1440 * scale) / 2;
  panZoom.zoomTo(x, y, scale);
  // panZoom.moveTo(x, y);
  console.log(x, y, scale);
}

document.addEventListener("DOMContentLoaded", render);
