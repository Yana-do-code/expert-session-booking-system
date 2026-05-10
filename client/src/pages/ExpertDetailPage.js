import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io as socketIoClient } from 'socket.io-client';
import TimeSlotGroup from '../components/TimeSlotGroup';
import BookingModal from '../components/BookingModal';
import BookingSuccess from '../components/BookingSuccess';
import {
  fetchExpertById,
  fetchSlotsByExpert,
} from '../services/expertService';

const SOCKET_URL = 'http://localhost:5000';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    padding: '32px 24px 64px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  container: {
    maxWidth: 1000,
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
  header: {
    background: '#ffffff',
    border: '1px solid #eef0f3',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    marginBottom: 24,
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#e5e7eb',
    flexShrink: 0,
  },
  initialsAvatar: {
    width: 88,
    height: 88,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 30,
    flexShrink: 0,
  },
  identityBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
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
  starRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  starWrap: {
    position: 'relative',
    display: 'inline-block',
    fontSize: 18,
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
    fontSize: 13,
    color: '#6b7280',
  },
  bio: {
    marginTop: 16,
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.6,
  },
  statsRow: {
    display: 'flex',
    gap: 32,
    marginTop: 18,
    flexWrap: 'wrap',
    paddingTop: 16,
    borderTop: '1px solid #f1f3f5',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
  },
  slotsSection: {
    background: '#ffffff',
    border: '1px solid #eef0f3',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 4px',
  },
  centerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    color: '#6b7280',
    fontSize: 14,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    borderRadius: '50%',
    animation: 'expertSpin 0.8s linear infinite',
  },
  emptySlots: {
    color: '#6b7280',
    fontSize: 14,
    padding: '12px 0',
  },
};

const spinnerKeyframes = `@keyframes expertSpin { to { transform: rotate(360deg); } }`;

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

function ExpertDetailPage({ expertId, onBack }) {
  const [expert, setExpert] = useState(null);
  const [slotGroups, setSlotGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  // bookingSlot holds the full slot object the user clicked "Book" on so
  // the modal has direct access to date/startTime/endTime without lookup.
  const [bookingSlot, setBookingSlot] = useState(null);
  // confirmedBooking is the response payload from POST /api/bookings;
  // when set, the success overlay is shown.
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Hold the socket in a ref so the cleanup effect can disconnect it
  // without triggering re-renders or stale-closure issues.
  const socketRef = useRef(null);

  const loadSlots = useCallback(async () => {
    try {
      const data = await fetchSlotsByExpert(expertId);
      setSlotGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      // Slot fetch failures shouldn't blank out the whole page — leave
      // the expert profile visible and surface via the page error state.
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load time slots.'
      );
    }
  }, [expertId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expertData, slotsData] = await Promise.all([
        fetchExpertById(expertId),
        fetchSlotsByExpert(expertId),
      ]);
      setExpert(expertData);
      setSlotGroups(Array.isArray(slotsData) ? slotsData : []);
      setImgFailed(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load expert details.'
      );
      setExpert(null);
      setSlotGroups([]);
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    if (!expertId) return undefined;
    loadAll();

    // Subscribe to slot:updated for live availability across all clients.
    const socket = socketIoClient(SOCKET_URL);
    socketRef.current = socket;
    socket.on('slot:updated', (data) => {
      if (data && data.expertId === expertId) {
        loadSlots();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [expertId, loadAll, loadSlots]);

  // Open the booking modal — actual API call now lives inside the modal.
  const handleBook = (slot) => {
    setBookingSlot(slot);
  };

  const handleBookingSuccess = async (booking) => {
    setConfirmedBooking(booking);
    setBookingSlot(null);
    // Refresh slots immediately so the booked slot flips to "Booked"
    // without waiting on the socket round-trip.
    await loadSlots();
  };

  const handleModalClose = () => {
    setBookingSlot(null);
  };

  const handleSuccessClose = () => {
    setConfirmedBooking(null);
  };

  const showImage = expert && expert.avatar && !imgFailed;

  return (
    <div style={styles.page}>
      <style>{spinnerKeyframes}</style>
      <div style={styles.container}>
        <button type="button" style={styles.backBtn} onClick={onBack}>
          ← Back to Experts
        </button>

        {loading && (
          <div style={styles.centerBox}>
            <div style={styles.spinner} aria-label="Loading" />
          </div>
        )}

        {!loading && error && <div style={styles.errorBox}>{error}</div>}

        {!loading && !error && expert && (
          <>
            <div style={styles.header}>
              <div style={styles.topRow}>
                {showImage ? (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    style={styles.avatar}
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div style={styles.initialsAvatar}>
                    {getInitials(expert.name)}
                  </div>
                )}
                <div style={styles.identityBlock}>
                  <h1 style={styles.name}>{expert.name}</h1>
                  <span style={styles.badge}>{expert.category}</span>
                  <StarRating value={expert.rating} />
                </div>
              </div>

              {expert.bio && <p style={styles.bio}>{expert.bio}</p>}

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Experience</span>
                  <span style={styles.statValue}>{expert.experience} yrs</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Rate</span>
                  <span style={styles.statValue}>₹{expert.hourlyRate}/hr</span>
                </div>
              </div>
            </div>

            <div style={styles.slotsSection}>
              <h2 style={styles.sectionHeading}>Available Time Slots</h2>
              <div style={{ height: 16 }} />

              {slotGroups.length === 0 ? (
                <div style={styles.emptySlots}>
                  No time slots available yet.
                </div>
              ) : (
                slotGroups.map((group) => (
                  <TimeSlotGroup
                    key={group.date}
                    date={group.date}
                    slots={group.slots}
                    onBook={handleBook}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {bookingSlot && expert && (
        <BookingModal
          expert={expert}
          slot={bookingSlot}
          onClose={handleModalClose}
          onSuccess={handleBookingSuccess}
        />
      )}

      {confirmedBooking && (
        <BookingSuccess
          booking={confirmedBooking}
          expert={expert}
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}

export default ExpertDetailPage;
