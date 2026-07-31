import ProfilePortrait from "./ProfilePortrait.jsx";

export default function CakeScreen({ config, candlesBlown, onBlowCandles, onOpenSurprises }) {
  return (
    <section className="screen cake-screen" aria-labelledby="cake-title">
      <ProfilePortrait config={config} size="small" />
      <p className="eyebrow">Birthday Wish</p>
      <h1 id="cake-title">Make a wish and blow out the candles!</h1>

      <div className={`cake-stage ${candlesBlown ? "is-blown" : ""}`} aria-label="Birthday cake with candles">
        <div className="candle-row" aria-hidden="true">
          {[1, 2, 3].map((candle) => (
            <div className="candle" key={candle}>
              <span className="flame" />
              <span className="smoke" />
            </div>
          ))}
        </div>
        <div className="cake-top" />
        <div className="cake-body">
          <span />
          <span />
          <span />
        </div>
        <div className="cake-plate" />
      </div>

      {!candlesBlown ? (
        <button className="primary-button" type="button" onClick={onBlowCandles}>
          Blow the Candles
        </button>
      ) : (
        <div className="wish-panel" role="status">
          <p>Your wish has been sent to the universe!</p>
          <button className="primary-button" type="button" onClick={onOpenSurprises}>
            Open Your Surprises
          </button>
        </div>
      )}
    </section>
  );
}
