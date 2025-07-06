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
const volumeSlider = document.querySelector(
  "#volume-control input[type='range']"
)! as HTMLInputElement;
const volumeIndicator = document.querySelector(
  "#volume-control img"
)! as HTMLImageElement;
const muteButton = document.querySelector(
  "#volume-control button"
)! as HTMLButtonElement;

// Track which video player is currently active
let currentPlayer: "player1" | "player2" = "player1";
// Track the currently playing track index
let currentTrackIndex: number = -1;

// Store last non-zero volume to restore when unmuting
let previousVolume = 1;

const block = (e: TouchEvent) => {
  if (jukebox.contains(e.target as Node)) e.preventDefault();
};

document.addEventListener("gesturestart", block as EventListener);
document.addEventListener("gesturechange", block as EventListener);

function switchVideoPlayer(newSrc: string) {
  const activePlayer =
    currentPlayer === "player1" ? videoPlayer1 : videoPlayer2;
  const nextPlayer = currentPlayer === "player1" ? videoPlayer2 : videoPlayer1;

  // Make sure the next player starts fully hidden and the current stays visible
  nextPlayer.classList.add("opacity-0");
  nextPlayer.classList.remove("opacity-100");
  activePlayer.classList.remove("opacity-0");
  activePlayer.classList.add("opacity-100");

  // Set the new source on the inactive player
  nextPlayer.src = `/static/${newSrc}`;

  // When the inactive player is ready, start the cross-fade
  const onCanPlay = () => {
    // Start playing the new video (ignore promise for older browsers)
    void nextPlayer.play();

    // Fade out current player and fade in new player
    activePlayer.classList.add("opacity-0");
    activePlayer.classList.remove("opacity-100");
    nextPlayer.classList.remove("opacity-0");
    nextPlayer.classList.add("opacity-100");

    // Switch the current player reference
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

    console.log("Current player", currentPlayer);

    // After transition completes, pause the now-hidden player
    setTimeout(() => {
      activePlayer.pause();
    }, 500); // Match the CSS transition duration
  };

  nextPlayer.addEventListener("canplay", onCanPlay, { once: true });

  // Start loading the new video
  nextPlayer.load();
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

// Helper to update the volume icon according to current state
function updateVolumeIndicator() {
  const volume = audioPlayer.muted ? 0 : audioPlayer.volume;
  let level: "mute" | "low" | "medium" | "high";
  if (volume === 0) {
    level = "mute";
  } else if (volume <= 0.33) {
    level = "low";
  } else if (volume <= 0.66) {
    level = "medium";
  } else {
    level = "high";
  }
  volumeIndicator.src = `/static/volume-${level}.png`;
}

function render() {
  const [w, h] = [320, 32]; // Clickable box size
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
    div.innerHTML = `<div class="track__content">
      <div class="track__title">${deburr(track.title)}</div>
    </div>`;
    div.title = track.title;
    div.addEventListener("click", (ev) => {
      playTrack(index);
    });
    jukebox?.appendChild(div);
  }

  volumeSlider.addEventListener("input", () => {
    const value = parseFloat(volumeSlider.value);
    audioPlayer.volume = value;

    // Automatically toggle muted state depending on slider value
    if (value === 0) {
      audioPlayer.muted = true;
    } else {
      audioPlayer.muted = false;
      previousVolume = value;
    }

    updateVolumeIndicator();
  });

  // Toggle mute / unmute when clicking on the icon or button
  muteButton.addEventListener("click", () => {
    if (audioPlayer.muted || audioPlayer.volume === 0) {
      // Unmute and restore previous volume (or default to full volume)
      const restored = previousVolume || 1;
      audioPlayer.muted = false;
      audioPlayer.volume = restored;
      volumeSlider.value = restored.toString();
    } else {
      // Mute – remember current volume so we can restore it later
      previousVolume = audioPlayer.volume || 1;
      audioPlayer.muted = true;
      volumeSlider.value = "0";
    }

    updateVolumeIndicator();
  });

  // Initial icon state
  updateVolumeIndicator();

  // Add event listener for when a track ends
  audioPlayer.addEventListener("ended", playNextTrack);

  const panZoom = PanZoom(jukebox, {
    maxZoom: 2,
    minZoom: 0.2,
    autocenter: true,
    bounds: true,
    onTouch: (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest(".no-pan")) return false;
    },
    beforeMouseDown: (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.closest(".no-pan")) return false;
      return true;
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});
