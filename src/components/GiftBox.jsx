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
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [imageMediaStopSignal, setImageMediaStopSignal] = useState(0);
  const [playAttentionSignal, setPlayAttentionSignal] = useState(0);
  const wasOpenRef = useRef(false);
  const audioId = `audio-${dedication.id}`;
  const videoId = `video-${dedication.id}`;
  const dedicationImageSrc = dedication.image ? resolvePublicAsset(dedication.image) : "";
  const isExpanded = isOpen && !isCollapsed && showGiftModal;

  function closeGiftModal({ stopMedia = true } = {}) {
    setShowGiftModal(false);
    setIsCollapsed(true);
    setIsImageOpen(false);

    if (stopMedia) {
      onStopMedia(audioId);
      onStopMedia(videoId);
      setImageMediaStopSignal((signal) => signal + 1);
    }
  }

  useEffect(() => {
    if (!isImageOpen && !isExpanded) {
      return undefined;
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        if (isImageOpen) {
          closeImage({ stopSong: true });
          return;
        }

        closeGiftModal();
      }
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isExpanded, isImageOpen]);

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
      setIsCollapsed(false);
      setShowGiftModal(true);
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
    setShowGiftModal(false);
    setIsCollapsed(true);

    if (stopSong) {
      onStopMedia(audioId);
      setImageMediaStopSignal((signal) => signal + 1);
    }
  }

  function collapseAfterSong() {
    setIsImageOpen(false);
    if (dedication.video) {
      setActiveTab("video");
      setShowGiftModal(true);
      setIsCollapsed(false);
      return;
    }

    setShowGiftModal(false);
    setIsCollapsed(true);
  }

  function handleGiftClick() {
    if (isOpen) {
      setIsCollapsed(false);
      setShowGiftModal(true);
      setActiveTab("song");
      setPlayAttentionSignal((signal) => signal + 1);
      return;
    }

    onOpen(dedication.id);
  }

  return (
    <article className={`gift-card ${isExpanded ? "is-open" : ""} ${isOpen ? "was-opened" : ""}`}>
      <button
        className="gift-trigger"
        type="button"
        onClick={handleGiftClick}
        aria-expanded={isExpanded}
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

      {isExpanded &&
        createPortal(
          <div
            className="gift-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`gift-title-${dedication.id}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeGiftModal();
              }
            }}
          >
            <div className="gift-modal-panel">
              <div className="gift-modal-header">
                <div>
                  <span>{dedication.person}</span>
                  <h2 id={`gift-title-${dedication.id}`}>{dedication.title}</h2>
                </div>
                <button
                  className="gift-close-button"
                  type="button"
                  onClick={() => closeGiftModal()}
                  aria-label="Close dedication"
                >
                  X
                </button>
              </div>

              <div className="gift-details">
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
                    onMediaEnd={dedication.image || dedication.video ? collapseAfterSong : undefined}
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
                    onMediaEnd={() => closeGiftModal({ stopMedia: false })}
                    onMediaClose={() => closeGiftModal({ stopMedia: false })}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
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
