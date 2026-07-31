import { useState } from "react";
import { resolvePublicAsset } from "../utils/mediaPaths.js";

export default function ProfilePortrait({ config, size = "hero", className = "", image }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = image || config.profileImage ? resolvePublicAsset(image || config.profileImage) : "";
  const initials = (config.recipientName || "J").slice(0, 1).toUpperCase();

  return (
    <div className={`portrait-shell portrait-${size} ${className}`} aria-label={`${config.recipientName} portrait`}>
      <div className="portrait-spotlight" aria-hidden="true" />
      <div className="portrait-frame">
        {!imageFailed && imageSrc ? (
          <img
            src={imageSrc}
            alt={`${config.recipientName} smiling portrait`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="portrait-placeholder" aria-hidden="true">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}
