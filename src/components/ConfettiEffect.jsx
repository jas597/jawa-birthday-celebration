import { useEffect, useState } from "react";

const colors = ["#fff6c7", "#f8d66d", "#d9a441", "#ffffff", "#b88a2a"];

export default function ConfettiEffect({ triggerKey }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;

    const nextPieces = Array.from({ length: 90 }, (_, index) => ({
      id: `${triggerKey}-${index}`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.35}s`,
      duration: `${2.4 + Math.random() * 1.8}s`,
      rotate: `${Math.random() * 360}deg`,
      color: colors[index % colors.length],
    }));

    setPieces(nextPieces);
    const timer = window.setTimeout(() => setPieces([]), 4600);
    return () => window.clearTimeout(timer);
  }, [triggerKey]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            background: piece.color,
            transform: `rotate(${piece.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
