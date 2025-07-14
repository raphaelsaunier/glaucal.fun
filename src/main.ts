import PanZoom from "panzoom";
import { tracks } from "./config";
import deburr from "lodash/deburr";
import debounce from "lodash/debounce";

const jukebox = document.getElementById("jukebox")!;
const pascal = document.getElementById("pascal")! as HTMLVideoElement;
const josue = document.getElementById("josue")! as HTMLVideoElement;
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

// We have two player instances on the page to support a smooth transition between the two videos
// Instead of video1 and video2, let's call them Pascal and Josué :D
let currentPlayer: "pascal" | "josue" = "pascal";

// Track the currently playing track index
let currentTrackIndex: number = -1;

// Store last non-zero volume to restore when unmuting
let previousVolume = 1;

// Store the PanZoom instance to be able to dispose and recreate it
let panZoomInstance: ReturnType<typeof PanZoom> | null = null;

const block = (e: TouchEvent) => {
  if (jukebox.contains(e.target as Node)) e.preventDefault();
};

document.addEventListener("gesturestart", block as EventListener);
document.addEventListener("gesturechange", block as EventListener);

function switchVideoPlayer(track: (typeof tracks)[0]) {
  const activePlayer = currentPlayer === "pascal" ? pascal : josue;
  const nextPlayer = currentPlayer === "pascal" ? josue : pascal;

  // Make sure the next player starts fully hidden and the current stays visible
  nextPlayer.classList.add("opacity-0");
  nextPlayer.classList.remove("opacity-100");
  activePlayer.classList.remove("opacity-0");
  activePlayer.classList.add("opacity-100");

  // Set the new source on the inactive player
  nextPlayer.src = `/static/${track.clip}`;

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

    // After transition completes, pause the now-hidden player
    setTimeout(() => {
      // Update theme when the new video starts playing
      document.documentElement.classList.toggle("dark", !!track.dark);
      document.documentElement.classList.toggle("light", !track.dark);
      activePlayer.pause();
    }, 100);
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

  // Update URL hash using the audio filename without extension
  const hashName = track.audio.replace(".mp3", "");
  history.replaceState(null, "", `#${hashName}`);

  // Update window title
  document.title = `${track.title} | Glaucal Cristal Session | Jukebox 🎶`;

  // Switch video and audio
  switchVideoPlayer(track);
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

function playPreviousTrack() {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  } else {
    playTrack(tracks.length - 1);
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

function initializePanZoom() {
  if (panZoomInstance) {
    panZoomInstance.dispose();
  }

  const dialog = document.getElementById("about-dialog") as HTMLDialogElement;

  /** @see https://github.com/anvaka/panzoom */
  panZoomInstance = PanZoom(jukebox, {
    maxZoom: 2,
    minZoom: 0.2,
    autocenter: true,
    bounds: true,
    onTouch: (event) => {
      // Prevent panning when dialog is open
      if (!(event.target instanceof HTMLElement)) return;
      if (dialog?.open || !event.target.closest(".no-pan")) {
        return false;
      }
    },
    beforeMouseDown: (event) => {
      // Prevent panning when dialog is open
      if (dialog?.open) return true;
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.closest(".no-pan")) return true;
    },
  });
}

function renderTracks() {
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
      <div class="track__title">
        <span>${deburr(track.title)}</span>
        <span>${deburr(track.title)}</span>
      </div>
    </div>`;
    div.title = track.title;
    div.addEventListener("click", (ev) => {
      playTrack(index);
    });
    jukebox?.appendChild(div);
  }
}

function initializeControls() {
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
}

// Debounced resize handler - only reinitialize PanZoom
const handleResize = debounce(() => {
  initializePanZoom();
}, 300) as () => void;

document.addEventListener("DOMContentLoaded", () => {
  renderTracks();
  initializeControls();
  initializePanZoom();

  // Setup the dialog element
  const dialog = document.getElementById("about-dialog") as HTMLDialogElement;
  const logo = document.getElementById("logo");
  const closeButton = dialog?.querySelector("button");

  if (dialog && logo) {
    // Add click handler to logo
    logo.addEventListener("click", () => {
      dialog.showModal();
    });

    // Close modal when clicking outside (on backdrop)
    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!isInDialog) {
        dialog.close();
      }
    });

    // Close modal when clicking close button
    closeButton?.addEventListener("click", () => {
      dialog.close();
    });

    // Close dialog on Escape key (built-in to dialog element)
  }

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Don't handle shortcuts when dialog is open
    if (dialog?.open) return;

    // F for fullscreen
    if (e.key === "f" || e.key === "F") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }

    // Left/Right for track navigation
    if (e.key === "ArrowLeft") {
      playPreviousTrack();
    } else if (e.key === "ArrowRight") {
      playNextTrack();
    }

    // Up/Down for volume
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newVolume = Math.min(1, audioPlayer.volume + 0.1);
      audioPlayer.volume = newVolume;
      volumeSlider.value = newVolume.toString();
      if (audioPlayer.muted && newVolume > 0) {
        audioPlayer.muted = false;
      }
      updateVolumeIndicator();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newVolume = Math.max(0, audioPlayer.volume - 0.1);
      audioPlayer.volume = newVolume;
      volumeSlider.value = newVolume.toString();
      if (newVolume === 0) {
        audioPlayer.muted = true;
      }
      updateVolumeIndicator();
    }
  });

  // Check URL hash on load
  const hash = window.location.hash.slice(1); // Remove the #
  if (hash) {
    // Find track by audio filename
    const trackIndex = tracks.findIndex(
      (track) => track.audio.replace(".mp3", "") === hash
    );
    if (trackIndex !== -1) {
      playTrack(trackIndex);
    }
  }

  // Handle resize and orientation change
  window.addEventListener("resize", () => handleResize());
  window.addEventListener("orientationchange", () => handleResize());
  document.addEventListener("fullscreenchange", () => handleResize());
});
