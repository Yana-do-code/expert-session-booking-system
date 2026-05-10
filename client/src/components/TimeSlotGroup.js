import React from 'react';

const styles = {
  group: {
    marginBottom: 28,
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 12,
  },
  slotCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '12px 14px',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  slotCardBooked: {
    background: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  slotTime: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
  },
  slotTimeBooked: {
    color: '#6b7280',
  },
  bookBtn: {
    background: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  bookBtnDisabled: {
    background: '#a5b4fc',
    cursor: 'not-allowed',
  },
  bookedLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    background: '#e5e7eb',
    borderRadius: 6,
    padding: '6px 10px',
    textAlign: 'center',
  },
};

// Parses 'YYYY-MM-DD' into a Date constructed in local time so the formatted
// weekday/day matches what the user sees on their calendar.
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDateHeader(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function TimeSlotGroup({ date, slots, onBook }) {
  return (
    <div style={styles.group}>
      <h3 style={styles.dateHeader}>{formatDateHeader(date)}</h3>
      <div style={styles.grid}>
        {slots.map((slot) => {
          const cardStyle = slot.isBooked
            ? { ...styles.slotCard, ...styles.slotCardBooked }
            : styles.slotCard;
          const timeStyle = slot.isBooked
            ? { ...styles.slotTime, ...styles.slotTimeBooked }
            : styles.slotTime;

          return (
            <div key={slot._id} style={cardStyle}>
              <span style={timeStyle}>
                {slot.startTime} – {slot.endTime}
              </span>
              {slot.isBooked ? (
                <span style={styles.bookedLabel}>Booked</span>
              ) : (
                <button
                  type="button"
                  style={styles.bookBtn}
                  onClick={() => onBook(slot)}
                >
                  Book
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimeSlotGroup;
