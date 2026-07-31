import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolvePublicAsset } from "../utils/mediaPaths.js";

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function MediaPlayer({
  id,
  type = "audio",
  title,
  person,
  src,
  startAt = 0,
  playAttentionSignal = 0,
  activeMedia,
  stopSignal,
  onRequestPlay,
  onStop,
  onMediaStart,
  onMediaEnd,
  onMediaClose,
}) {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [hasError, setHasError] = useState(false);
  const [shouldPromptPlay, setShouldPromptPlay] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const mediaId = `${type}-${id}`;
  const isActive = activeMedia?.id === mediaId;
  const startOffset = Math.max(0, Number(startAt) || 0);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    if (!isActive && !media.paused) {
      media.pause();
    }

    if (!isActive && type === "video") {
      setIsVideoOpen(false);
      setIsPlaying(false);
    }
  }, [isActive, type]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.pause();
    media.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setIsVideoOpen(false);
  }, [stopSignal]);

  useEffect(() => {
    if (!playAttentionSignal || type !== "audio") return undefined;

    setShouldPromptPlay(true);
    const timer = window.setTimeout(() => setShouldPromptPlay(false), 1800);

    return () => window.clearTimeout(timer);
  }, [playAttentionSignal, type]);

  useEffect(() => {
    if (!isVideoOpen) return;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        closeVideo();
      }
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isVideoOpen]);

  function syncDuration() {
    setDuration(mediaRef.current?.duration || 0);
  }

  function syncCurrentTime() {
    setCurrentTime(mediaRef.current?.currentTime || 0);
  }

  function handleEnded() {
    setIsPlaying(false);
    onMediaEnd?.();
    onStop(mediaId);
    if (type === "video") {
      setIsVideoOpen(false);
      setCurrentTime(0);
    }
  }

  async function playMedia() {
    const media = mediaRef.current;
    if (!media || hasError) return;

    onRequestPlay({ id: mediaId, type });
    media.volume = volume;
    if (startOffset > 0 && media.currentTime < startOffset) {
      media.currentTime = startOffset;
      setCurrentTime(startOffset);
    }

    try {
      await media.play();
      setHasError(false);
      setIsPlaying(true);
      onMediaStart?.();
    } catch {
      setHasError(true);
      setIsPlaying(false);
      onStop(mediaId);
    }
  }

  async function togglePlay() {
    const media = mediaRef.current;
    if (!media || hasError) return;

    if (!media.paused) {
      media.pause();
      setIsPlaying(false);
      onStop(mediaId);
      return;
    }

    playMedia();
  }

  function handleSeek(event) {
    const media = mediaRef.current;
    if (!media) return;

    const nextTime = Number(event.target.value);
    media.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleVolume(event) {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (mediaRef.current) {
      mediaRef.current.volume = nextVolume;
    }
  }

  function replay() {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = 0;
    if (startOffset > 0) {
      media.currentTime = startOffset;
      setCurrentTime(startOffset);
    } else {
      setCurrentTime(0);
    }
    if (isPlaying || type === "video") {
      media.play().catch(() => setHasError(true));
      setIsPlaying(true);
      onRequestPlay({ id: mediaId, type });
      onMediaStart?.();
    }
  }

  function fullscreen() {
    const media = mediaRef.current;
    if (media?.requestFullscreen) {
      media.requestFullscreen().catch(() => {});
    }
  }

  async function openVideo() {
    setIsVideoOpen(true);
    onRequestPlay({ id: mediaId, type });

    window.setTimeout(async () => {
      const video = mediaRef.current;
      if (!video) return;

      video.volume = volume;

      try {
        await video.play();
        setHasError(false);
        setIsPlaying(true);
        onMediaStart?.();
      } catch {
        setHasError(true);
        setIsPlaying(false);
        setIsVideoOpen(false);
        onStop(mediaId);
      }
    }, 0);
  }

  function closeVideo() {
    const media = mediaRef.current;
    if (media) {
      media.pause();
      media.currentTime = 0;
    }

    setCurrentTime(0);
    setIsPlaying(false);
    setIsVideoOpen(false);
    onStop(mediaId);
    onMediaClose?.();
  }

  const mediaProps = {
    ref: mediaRef,
    src: resolvePublicAsset(src),
    preload: "metadata",
    onLoadedMetadata: syncDuration,
    onTimeUpdate: syncCurrentTime,
    onPlay: () => onRequestPlay({ id: mediaId, type }),
    onPause: () => setIsPlaying(false),
    onEnded: handleEnded,
    onError: () => {
      setHasError(true);
      setIsPlaying(false);
    },
  };

  if (type === "video") {
    const modal = isVideoOpen
      ? createPortal(
          <div className="video-modal" role="dialog" aria-modal="true" aria-label={title}>
            <div className="video-modal-panel">
              <div className="video-modal-header">
                <div>
                  <span>{person}</span>
                  <h3>{title}</h3>
                </div>
                <button className="video-close-button" type="button" onClick={closeVideo} aria-label="Close video">
                  ×
                </button>
              </div>

              <div className="video-modal-frame">
                <video {...mediaProps} controls playsInline autoPlay>
                  Captions can be added later with a VTT track file.
                </video>
              </div>

              {isPlaying && <div className="gold-visualizer" aria-hidden="true"><span /><span /><span /><span /></div>}

              <div className="video-modal-actions">
                <button className="secondary-button compact-button" type="button" onClick={closeVideo}>
                  Close Video
                </button>
                <button className="secondary-button compact-button" type="button" onClick={replay}>
                  Replay
                </button>
                <button className="secondary-button compact-button" type="button" onClick={fullscreen}>
                  Fullscreen
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

    return (
      <>
        <div className="media-card video-card">
          <div className="media-heading">
            <span>{person}</span>
            <h3>{title}</h3>
          </div>

          <button className="primary-button video-launch-button" type="button" onClick={openVideo}>
            Watch Video
          </button>

          {hasError && (
            <p className="media-error" role="status">
              This dedication is being prepared. Please check again shortly.
            </p>
          )}
        </div>
        {modal}
      </>
    );
  }

  return (
    <div className="media-card">
      <div className="media-heading">
        <span>{person}</span>
        <h3>{title}</h3>
      </div>

      <audio {...mediaProps} />

      {isPlaying && <div className="gold-visualizer" aria-hidden="true"><span /><span /><span /><span /></div>}

      {hasError && (
        <p className="media-error" role="status">
          This dedication is being prepared. Please check again shortly.
        </p>
      )}

      <div className="media-controls" aria-label={`${title} controls`}>
        <button
          className={`secondary-button compact-button ${shouldPromptPlay ? "play-button-prompt" : ""}`}
          type="button"
          onClick={togglePlay}
        >
          {isPlaying ? "Pause" : "Play Song"}
        </button>

        <label className="range-label">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            aria-label={`${title} progress`}
          />
          <span>{formatTime(duration)}</span>
        </label>

        <label className="volume-label">
          <span>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolume}
            aria-label={`${title} volume`}
          />
        </label>

        <button className="secondary-button compact-button" type="button" onClick={replay}>
          Replay
        </button>
      </div>
    </div>
  );
}
