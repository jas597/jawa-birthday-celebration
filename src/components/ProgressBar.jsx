export default function ProgressBar({ opened, total, label = "surprises" }) {
  const percentage = total > 0 ? (opened / total) * 100 : 0;

  return (
    <div className="progress-card" aria-live="polite">
      <div className="progress-label">
        <span>{opened} of {total} {label} opened</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax={total} aria-valuenow={opened}>
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
