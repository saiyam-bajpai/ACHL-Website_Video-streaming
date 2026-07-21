import { useState } from 'react';
import './ImageSlot.css';

/**
 * Drop your real files into /public/images/ using the same filename
 * referenced by `src` and they'll replace this placeholder automatically —
 * no code changes needed.
 */
export default function ImageSlot({ src, alt = '', label, className = '', ratio }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-slot ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M21 16L15.5 11.5C15.09 11.17 14.5 11.19 14.11 11.55L6 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>{label || alt || 'Image placeholder'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={ratio ? { aspectRatio: ratio } : undefined}
      onError={() => setFailed(true)}
    />
  );
}
