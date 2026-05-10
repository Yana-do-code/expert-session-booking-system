import React, { useState } from 'react';

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    border: '1px solid #eef0f3',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#e5e7eb',
    flexShrink: 0,
  },
  initialsAvatar: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 20,
    flexShrink: 0,
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badge: {
    alignSelf: 'flex-start',
    padding: '2px 10px',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: 12,
    fontWeight: 500,
  },
  bio: {
    fontSize: 13,
    color: '#4b5563',
    margin: 0,
    lineHeight: 1.5,
    minHeight: 38,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    color: '#374151',
  },
  rate: {
    fontWeight: 600,
    color: '#111827',
  },
  exp: {
    color: '#6b7280',
  },
  starRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  starWrap: {
    position: 'relative',
    display: 'inline-block',
    fontSize: 16,
    lineHeight: 1,
    letterSpacing: 2,
  },
  starsEmpty: {
    color: '#d1d5db',
  },
  starsFilled: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#f59e0b',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  ratingNum: {
    fontSize: 12,
    color: '#6b7280',
  },
  detailsBtn: {
    marginTop: 4,
    background: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function StarRating({ value }) {
  const clamped = Math.max(0, Math.min(5, value || 0));
  const pct = (clamped / 5) * 100;
  return (
    <div style={styles.starRow}>
      <span style={styles.starWrap} aria-label={`Rating ${clamped} out of 5`}>
        <span style={styles.starsEmpty}>★★★★★</span>
        <span style={{ ...styles.starsFilled, width: `${pct}%` }}>★★★★★</span>
      </span>
      <span style={styles.ratingNum}>{clamped.toFixed(1)}</span>
    </div>
  );
}

function ExpertCard({ expert, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = expert.avatar && !imgFailed;

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        {showImage ? (
          <img
            src={expert.avatar}
            alt={expert.name}
            style={styles.avatar}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div style={styles.initialsAvatar}>{getInitials(expert.name)}</div>
        )}
        <div style={styles.nameBlock}>
          <h3 style={styles.name} title={expert.name}>{expert.name}</h3>
          <span style={styles.badge}>{expert.category}</span>
        </div>
      </div>

      {expert.bio ? <p style={styles.bio}>{expert.bio}</p> : <p style={styles.bio}>&nbsp;</p>}

      <StarRating value={expert.rating} />

      <div style={styles.metaRow}>
        <span style={styles.exp}>{expert.experience} yrs experience</span>
        <span style={styles.rate}>₹{expert.hourlyRate}/hr</span>
      </div>

      <button
        type="button"
        style={styles.detailsBtn}
        onClick={() => onSelect && onSelect(expert._id)}
      >
        View Details
      </button>
    </div>
  );
}

export default ExpertCard;
