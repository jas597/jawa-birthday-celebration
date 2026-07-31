import { resolvePublicAsset } from "../utils/mediaPaths.js";

export default function FinalCelebration({ config, onReplay, onViewSurprises }) {
  const prayerSignatures = ["Sasi", "Jas", "Kim"];

  return (
    <section className="screen final-screen" aria-labelledby="prayer-title">
      <section className="final-prayer-section" aria-labelledby="prayer-title">
        <div className="final-prayer-copy">
          <p className="eyebrow" id="prayer-title">{config.finalSurpriseTitle}</p>
          <p>
            Today, in celebration of your birthday, we provided breakfast to children and requested them to pray for you.
          </p>
          <p>
            Their heartfelt prayers and blessings are our small gift to express our gratitude for your leadership,
            kindness, and support.
          </p>
          <p>
            We hope these prayers bring you happiness, good health, peace, prosperity, and continued success throughout
            the coming year.
          </p>
        </div>

        {config.finalSurpriseVideo && (
          <div className="final-video-panel prayer-video-panel">
            <p className="person-name">🙏 A Prayer from the Children</p>
            <div className="video-frame prayer-video-frame">
              <video
                src={resolvePublicAsset(config.finalSurpriseVideo)}
                controls
                playsInline
                preload="metadata"
                poster={resolvePublicAsset(config.finalVideoPoster || config.profileImage)}
                aria-label="A Prayer from the Children"
              />
            </div>
          </div>
        )}

        <p className="final-blessing">
          May God bless you with happiness, good health, wisdom, peace, and continued success.
          <span>Happy Birthday, {config.recipientName} Sir.</span>
        </p>

        <div className="prayer-signature-block" aria-label="Prayer gift from Sasi, Jas, and Kim">
          <span>❤️ With Love</span>
          <div>
            {prayerSignatures.map((name) => (
              <strong key={name}>{name}</strong>
            ))}
          </div>
        </div>
      </section>

      <div className="button-row">
        <button className="primary-button" type="button" onClick={onReplay}>
          Replay the Celebration
        </button>
        <button className="secondary-button" type="button" onClick={onViewSurprises}>
          View the Surprises Again
        </button>
      </div>
    </section>
  );
}
