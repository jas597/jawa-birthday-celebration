export default function MusicControl({ isMuted, audioReady, onToggleMute }) {
  return (
    <button
      className="music-control"
      type="button"
      onClick={onToggleMute}
      aria-pressed={!isMuted}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      title={isMuted ? "Unmute music" : "Mute music"}
    >
      <span aria-hidden="true">{isMuted || !audioReady ? "♪" : "♫"}</span>
    </button>
  );
}
