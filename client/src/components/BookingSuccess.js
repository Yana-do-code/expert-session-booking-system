import React from 'react';

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 60,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  card: {
    background: '#ffffff',
    width: '100%',
    maxWidth: 440,
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    textAlign: 'center',
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#10b981',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 700,
    margin: '0 auto 16px',
    lineHeight: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 18px',
  },
  detailsBox: {
    background: '#f9fafb',
    border: '1px solid #eef0f3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 13,
  },
  detailLabel: {
    color: '#6b7280',
    fontWeight: 500,
    flexShrink: 0,
  },
  detailValue: {
    color: '#111827',
    fontWeight: 600,
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  doneBtn: {
    width: '100%',
    background: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

function parseDateString(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatLongDate(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return dateStr || '';
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function BookingSuccess({ booking, expert, onClose }) {
  if (!booking) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const expertName = expert?.name || '';
  const dateLabel = formatLongDate(booking.date);
  const timeLabel = `${booking.startTime} – ${booking.endTime}`;

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.card} role="dialog" aria-modal="true">
        <div style={styles.checkCircle} aria-hidden="true">
          ✓
        </div>
        <h2 style={styles.heading}>Booking Confirmed!</h2>

        <div style={styles.detailsBox}>
          {expertName && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Expert</span>
              <span style={styles.detailValue}>{expertName}</span>
            </div>
          )}
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date</span>
            <span style={styles.detailValue}>{dateLabel}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Time</span>
            <span style={styles.detailValue}>{timeLabel}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Name</span>
            <span style={styles.detailValue}>{booking.name}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Email</span>
            <span style={styles.detailValue}>{booking.email}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Phone</span>
            <span style={styles.detailValue}>{booking.phone}</span>
          </div>
        </div>

        <button type="button" style={styles.doneBtn} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

export default BookingSuccess;
