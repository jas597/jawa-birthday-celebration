import { useState } from "react";
import ProfilePortrait from "./ProfilePortrait.jsx";

export default function WelcomeScreen({ config, onStart }) {
  const [isLeaving, setIsLeaving] = useState(false);

  function startWithPortraitTransition() {
    setIsLeaving(true);
    window.setTimeout(onStart, 360);
  }

  return (
    <section className={`screen welcome-screen hero-welcome ${isLeaving ? "is-leaving" : ""}`} aria-labelledby="welcome-title">
      <p className="eyebrow">Happy Birthday</p>
      <h1 id="welcome-title">{config.recipientName}</h1>
      <p className="hero-subtitle">Celebrating an Inspiring Leader</p>
      <ProfilePortrait config={config} size="hero" />
      {config.companyName && <p className="company-line">{config.companyName}</p>}
      <button className="primary-button" type="button" onClick={startWithPortraitTransition}>
        Start the Celebration
      </button>
    </section>
  );
}
