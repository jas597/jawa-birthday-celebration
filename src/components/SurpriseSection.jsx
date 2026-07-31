import { useState } from "react";
import GiftBox from "./GiftBox.jsx";
import ProgressBar from "./ProgressBar.jsx";

export default function SurpriseSection({
  config,
  openedGiftIds,
  allGiftsOpened,
  activeMedia,
  stopSignal,
  onOpenGift,
  onRequestMediaPlay,
  onStopMedia,
  onOpenFinalSurprise,
}) {
  const [showFinalPrompt, setShowFinalPrompt] = useState(false);

  function confirmFinalSurprise() {
    setShowFinalPrompt(false);
    onOpenFinalSurprise();
  }

  return (
    <section className="screen surprise-screen" aria-labelledby="surprise-title">
      <p className="eyebrow">Team Dedications</p>
      <h1 id="surprise-title">Happy Birthday {config.recipientName}</h1>
      <ProgressBar opened={openedGiftIds.length} total={config.dedications.length} label="dedications" />

      <div className="gift-grid">
        {config.dedications.map((dedication) => (
          <GiftBox
            key={dedication.id}
            dedication={dedication}
            isOpen={openedGiftIds.includes(dedication.id)}
            activeMedia={activeMedia}
            stopSignal={stopSignal}
            onOpen={onOpenGift}
            onRequestMediaPlay={onRequestMediaPlay}
            onStopMedia={onStopMedia}
          />
        ))}
      </div>

      {allGiftsOpened && (
        <button className="final-unlock" type="button" onClick={() => setShowFinalPrompt(true)}>
          <span>One Final Surprise</span>
          <small>Open when you are ready</small>
        </button>
      )}

      {showFinalPrompt && (
        <div className="final-ready-modal" role="dialog" aria-modal="true" aria-labelledby="final-ready-title">
          <div className="final-ready-card">
            <p className="eyebrow">All Dedications Opened</p>
            <h2 id="final-ready-title">Are you ready for the final big one?</h2>
            <p>
              The last surprise is waiting for {config.recipientName}. Open it when the moment feels right.
            </p>
            <div className="final-ready-actions">
              <button className="primary-button" type="button" onClick={confirmFinalSurprise}>
                Yes, Open It
              </button>
              <button className="secondary-button" type="button" onClick={() => setShowFinalPrompt(false)}>
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
