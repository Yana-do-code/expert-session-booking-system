import React, { useState } from 'react';
import {
  fetchBookingsByEmail,
  updateBookingStatus,
} from '../services/bookingService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_STYLES = {
  pending: { background: '#fef3c7', color: '#92400e' },
  confirmed: { background: '#d1fae5', color: '#065f46' },
  completed: { background: '#f3f4f6', color: '#374151' },
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    padding: '32px 24px 64px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 0,
    marginBottom: 24,
  },
  searchForm: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  emailInput: {
    flex: 1,
    minWidth: 240,
    padding: '10px 14px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    outline: 'none',
    background: '#fff',
    color: '#111827',
  },
  searchBtn: {
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  inlineError: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: -12,
    marginBottom: 16,
  },
  centerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    color: '#6b7280',
    fontSize: 15,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    borderRadius: '50%',
    animation: 'expertSpin 0.8s linear infinite',
  },
  emptyBox: {
    background: '#ffffff',
    border: '1px solid #eef0f3',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #eef0f3',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  expertBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
  },
  expertName: {
    fontSize: 17,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    padding: '2px 10px',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: 12,
    fontWeight: 500,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 24,
    paddingTop: 4,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTop: '1px solid #f1f3f5',
    flexWrap: 'wrap',
  },
  actionLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: 500,
  },
  select: {
    padding: '6px 10px',
    fontSize: 13,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    color: '#111827',
    cursor: 'pointer',
  },
  selectDisabled: {
    background: '#f3f4f6',
    cursor: 'not-allowed',
  },
  cardError: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 13,
  },
};

const spinnerKeyframes = `@keyframes expertSpin { to { transform: rotate(360deg); } }`;

// Parse 'YYYY-MM-DD' as local date so the formatted weekday matches
// the user's calendar (avoiding the UTC parse off-by-one bug).
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDate(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function MyBookingsPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Tracks which booking is mid-status-update so we can disable that
  // specific select without locking the whole page.
  const [updatingId, setUpdatingId] = useState(null);
  // Per-card transient error keyed by booking id.
  const [cardErrors, setCardErrors] = useState({});

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setValidationError('Email is required');
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setValidationError('Enter a valid email address');
      return;
    }

    setValidationError('');
    setLoading(true);
    setError('');
    setCardErrors({});

    try {
      const data = await fetchBookingsByEmail(trimmed);
      setBookings(Array.isArray(data) ? data : []);
      setSubmittedEmail(trimmed);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch bookings.'
      );
      setBookings([]);
      setSubmittedEmail(trimmed);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (booking, newStatus) => {
    const previousStatus = booking.status;
    if (newStatus === previousStatus) return;

    setUpdatingId(booking._id);
    setCardErrors((prev) => {
      const next = { ...prev };
      delete next[booking._id];
      return next;
    });

    try {
      const updated = await updateBookingStatus(booking._id, newStatus);
      // Patch only the changed booking in local state — no full re-fetch.
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: updated.status } : b
        )
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update status.';
      setCardErrors((prev) => ({ ...prev, [booking._id]: msg }));
      // Revert: ensure local state still reflects the old status. The select
      // is controlled by booking.status, so no extra work is needed since
      // we never mutated bookings on failure.
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: previousStatus } : b
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const showEmpty =
    !loading && !error && submittedEmail && bookings.length === 0;
  const showList =
    !loading && !error && submittedEmail && bookings.length > 0;

  return (
    <div style={styles.page}>
      <style>{spinnerKeyframes}</style>
      <div style={styles.container}>
        <button type="button" style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>

        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.subtitle}>
          Enter the email you used to book to view your sessions.
        </p>

        <form style={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.emailInput}
            aria-label="Email address"
          />
          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {validationError && (
          <div style={styles.inlineError}>{validationError}</div>
        )}

        {loading && (
          <div style={styles.centerBox}>
            <div style={styles.spinner} aria-label="Loading" />
          </div>
        )}

        {!loading && error && <div style={styles.errorBox}>{error}</div>}

        {showEmpty && (
          <div style={styles.emptyBox}>
            No bookings found for {submittedEmail}
          </div>
        )}

        {showList && (
          <div style={styles.list}>
            {bookings.map((booking) => {
              const expert = booking.expert || {};
              const statusKey = booking.status || 'pending';
              const statusStyle =
                STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
              const isUpdating = updatingId === booking._id;
              const cardError = cardErrors[booking._id];

              return (
                <div key={booking._id} style={styles.card}>
                  <div style={styles.cardTopRow}>
                    <div style={styles.expertBlock}>
                      <h2 style={styles.expertName}>
                        {expert.name || 'Expert'}
                      </h2>
                      {expert.category && (
                        <span style={styles.categoryBadge}>
                          {expert.category}
                        </span>
                      )}
                    </div>
                    <span style={{ ...styles.statusBadge, ...statusStyle }}>
                      {statusKey}
                    </span>
                  </div>

                  <div style={styles.metaRow}>
                    <div style={styles.meta}>
                      <span style={styles.metaLabel}>Date</span>
                      <span style={styles.metaValue}>
                        {formatDate(booking.date)}
                      </span>
                    </div>
                    <div style={styles.meta}>
                      <span style={styles.metaLabel}>Time</span>
                      <span style={styles.metaValue}>
                        {booking.startTime} – {booking.endTime}
                      </span>
                    </div>
                    {typeof expert.hourlyRate === 'number' && (
                      <div style={styles.meta}>
                        <span style={styles.metaLabel}>Rate</span>
                        <span style={styles.metaValue}>
                          ₹{expert.hourlyRate}/hr
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={styles.actionRow}>
                    <span style={styles.actionLabel}>
                      {isUpdating ? 'Updating…' : 'Change status:'}
                    </span>
                    <select
                      value={statusKey}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(booking, e.target.value)
                      }
                      style={
                        isUpdating
                          ? { ...styles.select, ...styles.selectDisabled }
                          : styles.select
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {cardError && (
                    <div style={styles.cardError}>{cardError}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
