import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MediaPlayer from "./MediaPlayer.jsx";
import { resolvePublicAsset } from "../utils/mediaPaths.js";

export default function GiftBox({
  dedication,
  isOpen,
  activeMedia,
  stopSignal,
  onOpen,
  onRequestMediaPlay,
  onStopMedia,
}) {
  const [activeTab, setActiveTab] = useState("song");
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageMediaStopSignal, setImageMediaStopSignal] = useState(0);
  const [playAttentionSignal, setPlayAttentionSignal] = useState(0);
  const wasOpenRef = useRef(false);
  const audioId = `audio-${dedication.id}`;
  const videoId = `video-${dedication.id}`;
  const dedicationImageSrc = dedication.image ? resolvePublicAsset(dedication.image) : "";

  useEffect(() => {
    if (!isImageOpen) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        closeImage({ stopSong: true });
      }
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isImageOpen]);

  useEffect(() => {
    if (dedication.image && isImageOpen && activeMedia && activeMedia.id !== audioId) {
      setIsImageOpen(false);
    }
  }, [activeMedia, audioId, dedication.image, isImageOpen]);

  useEffect(() => {
    if (dedication.image) {
      setIsImageOpen(false);
    }
  }, [dedication.image, stopSignal]);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setActiveTab("song");
      setPlayAttentionSignal((signal) => signal + 1);
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  function selectTab(tab) {
    onStopMedia(tab === "song" ? videoId : audioId);
    setActiveTab(tab);
  }

  function closeImage({ stopSong = false } = {}) {
    setIsImageOpen(false);

    if (stopSong) {
      onStopMedia(audioId);
      setImageMediaStopSignal((signal) => signal + 1);
    }
  }

  return (
    <article className={`gift-card ${isOpen ? "is-open" : ""}`}>
      <button
        className="gift-trigger"
        type="button"
        onClick={() => onOpen(dedication.id)}
        aria-expanded={isOpen}
      >
        <span className="gift-status" aria-hidden="true">
          {isOpen ? "✓" : dedication.id}
        </span>
        <span className="gift-visual" aria-hidden="true">
          <span className="gift-lid" />
          <span className="gift-ribbon-vertical" />
          <span className="gift-ribbon-horizontal" />
          <span className="gift-box-base" />
        </span>
        <span className="gift-label">{dedication.label}</span>
      </button>

      {isOpen && (
        <div className="gift-details">
          <p className="person-name">{dedication.person}</p>
          <h2>{dedication.title}</h2>
          <p>{dedication.message}</p>

          {dedication.video && (
            <div className="media-tabs" role="tablist" aria-label={`${dedication.person} media options`}>
              <button
                className={activeTab === "song" ? "is-selected" : ""}
                type="button"
                role="tab"
                aria-selected={activeTab === "song"}
                onClick={() => selectTab("song")}
              >
                Song Dedication
              </button>
              <button
                className={activeTab === "video" ? "is-selected" : ""}
                type="button"
                role="tab"
                aria-selected={activeTab === "video"}
                onClick={() => selectTab("video")}
              >
                Video Message
              </button>
            </div>
          )}

          {activeTab === "song" && (
            <MediaPlayer
              id={dedication.id}
              type="audio"
              title={dedication.video ? `Play ${dedication.person}'s Song` : dedication.title}
              person={dedication.person}
              src={dedication.audio}
              startAt={dedication.audioStartAt}
              playAttentionSignal={playAttentionSignal}
              activeMedia={activeMedia}
              stopSignal={stopSignal + imageMediaStopSignal}
              onRequestPlay={onRequestMediaPlay}
              onStop={onStopMedia}
              onMediaStart={dedication.image ? () => setIsImageOpen(true) : undefined}
              onMediaEnd={dedication.image ? () => setIsImageOpen(false) : undefined}
            />
          )}

          {dedication.video && activeTab === "video" && (
            <MediaPlayer
              id={dedication.id}
              type="video"
              title={`Watch ${dedication.person}'s Birthday Video`}
              person={dedication.person}
              src={dedication.video}
              activeMedia={activeMedia}
              stopSignal={stopSignal}
              onRequestPlay={onRequestMediaPlay}
              onStop={onStopMedia}
            />
          )}
        </div>
      )}

      {isImageOpen &&
        createPortal(
          <div
            className="image-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${dedication.person}'s dedication photo`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeImage({ stopSong: true });
              }
            }}
          >
            <div className="image-modal-panel">
              <div className="image-modal-header">
                <div>
                  <span>{dedication.person}</span>
                  <h3>{dedication.title}</h3>
                </div>
                <button
                  className="image-close-button"
                  type="button"
                  onClick={() => closeImage({ stopSong: true })}
                  aria-label="Close photo"
                >
                  X
                </button>
              </div>
              <div className="image-modal-frame">
                <img
                  src={dedicationImageSrc}
                  alt={`${dedication.person}'s dedication memory with Jawa`}
                />
              </div>
              <button
                className="secondary-button compact-button"
                type="button"
                onClick={() => closeImage({ stopSong: true })}
              >
                Close Photo
              </button>
            </div>
          </div>,
          document.body,
        )}
    </article>
  );
}
