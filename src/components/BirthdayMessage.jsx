import ProfilePortrait from "./ProfilePortrait.jsx";

export default function BirthdayMessage({ config, onContinue }) {
  return (
    <section className="screen message-screen" aria-labelledby="birthday-title">
      <div className="message-layout">
        <ProfilePortrait config={config} size="message" image={config.messageImage} />
        <div className="message-copy">
          <p className="eyebrow">With Appreciation</p>
          <h1 id="birthday-title">Happy Birthday, {config.recipientName}!</h1>
          <p className="lead">{config.mainBirthdayMessage}</p>
          <button className="primary-button" type="button" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
