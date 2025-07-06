import PanZoom from "panzoom";
import { tracks } from "./config";
import deburr from "lodash/deburr";

const jukebox = document.getElementById("jukebox")!;
const videoPlayer1 = document.getElementById(
  "video-player-1"
)! as HTMLVideoElement;
const videoPlayer2 = document.getElementById(
  "video-player-2"
)! as HTMLVideoElement;
const audioPlayer = document.getElementById(
  "audio-player"
)! as HTMLAudioElement;
const volumeControl = document.getElementById(
  "volume-control"
)! as HTMLInputElement;

// Track which video player is currently active
let currentPlayer: "player1" | "player2" = "player1";
// Track the currently playing track index
let currentTrackIndex: number = -1;

const block = (e: TouchEvent) => {
  if (jukebox.contains(e.target as Node)) e.preventDefault();
};

document.addEventListener("gesturestart", block as EventListener);
document.addEventListener("gesturechange", block as EventListener);

function switchVideoPlayer(newSrc: string) {
  const activePlayer =
    currentPlayer === "player1" ? videoPlayer1 : videoPlayer2;
  const nextPlayer = currentPlayer === "player1" ? videoPlayer2 : videoPlayer1;

  // Set the new source on the inactive player
  nextPlayer.src = `/static/${newSrc}`;

  // When the inactive player is ready, start the crossfade
  nextPlayer.addEventListener("canplay", function onCanPlay() {
    nextPlayer.removeEventListener("canplay", onCanPlay);

    // Start playing the new video
    nextPlayer.play();

    // Fade out current player and fade in new player
    activePlayer.classList.add("opacity-0");
    nextPlayer.classList.remove("opacity-0");
    nextPlayer.classList.add("opacity-100");
    // activePlayer.style.opacity = "0";
    // inactivePlayer.style.opacity = "1";

    // Switch the current player reference
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

    console.log("Current player", currentPlayer);

    // After transition completes, pause the now-hidden player
    setTimeout(() => {
      activePlayer.pause();
    }, 500); // Match the CSS transition duration
  });

  // Load the new video
  nextPlayer.load();
  nextPlayer.play();
}

function playTrack(trackIndex: number) {
  if (trackIndex < 0 || trackIndex >= tracks.length) return;

  const track = tracks[trackIndex];
  currentTrackIndex = trackIndex;

  // Remove active class from all tracks
  document.querySelectorAll(".track.active").forEach((t) => {
    t.classList.remove("active");
  });

  // Add active class to current track
  const trackElements = document.querySelectorAll(".track");
  if (trackElements[trackIndex]) {
    trackElements[trackIndex].classList.add("active");
  }

  // Update theme
  document.documentElement.classList.toggle("dark", !!track.dark);
  document.documentElement.classList.toggle("light", !!track.dark);

  // Switch video and audio
  switchVideoPlayer(track.clip);
  audioPlayer.setAttribute("src", `/static/${track.audio}`);
  audioPlayer.play();
}

function playNextTrack() {
  if (currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    playTrack(0);
  }
}

function render() {
  const [w, h] = [320, 32];
  const offsetY = 10;
  const offsetX = 5;
  for (const [index, track] of tracks.entries()) {
    const [x, y] = track.pos;
    const div = document.createElement("div");
    div.className = "track no-pan";
    div.style.top = `${y - offsetY}px`;
    div.style.left = `${x - offsetX}px`;
    div.style.width = `${w + offsetX}px`;
    div.style.height = `${h + offsetY}px`;
    div.innerHTML = `<div class="track__content"><div class="track__title">${deburr(
      track.title
    )}</div></div>`;
    div.title = track.title;
    div.addEventListener("click", (ev) => {
      playTrack(index);
    });
    jukebox?.appendChild(div);
  }

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = parseFloat(volumeControl.value);
  });

  // Add event listener for when a track ends
  audioPlayer.addEventListener("ended", playNextTrack);

  const panZoom = PanZoom(jukebox, {
    maxZoom: 2,
    minZoom: 0.2,
    autocenter: true,
    bounds: true,
    onTouch: (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      console.log(event.target.closest(".no-pan"));
      if (event.target.closest(".no-pan")) return false;
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});
