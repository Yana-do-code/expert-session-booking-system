import React, { useState } from 'react';
import { createBooking } from '../services/bookingService';

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 50,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  card: {
    background: '#ffffff',
    width: '100%',
    maxWidth: 480,
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: 22,
    lineHeight: 1,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 6,
  },
  infoBox: {
    background: '#f9fafb',
    border: '1px solid #eef0f3',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoExpert: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
  },
  infoMeta: {
    fontSize: 13,
    color: '#4b5563',
  },
  infoRate: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4f46e5',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    outline: 'none',
    fontFamily: 'inherit',
    background: '#ffffff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  readonly: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: '#f3f4f6',
    color: '#374151',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    outline: 'none',
    fontFamily: 'inherit',
    background: '#ffffff',
    color: '#111827',
    resize: 'vertical',
    minHeight: 70,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
  },
  errorBanner: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 14,
  },
  submitBtn: {
    width: '100%',
    background: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 6,
  },
  submitBtnDisabled: {
    background: '#a5b4fc',
    cursor: 'not-allowed',
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

function formatShortMeta(dateStr, startTime, endTime) {
  const d = parseDateString(dateStr);
  if (!d) return `${startTime} – ${endTime}`;
  const datePart = d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  return `Date: ${datePart} · ${startTime} – ${endTime}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

// Pure validator: returns the same error messages whether triggered by
// blur, change-while-touched, or submit, so the UX is consistent.
function validateField(field, value) {
  if (field === 'name') {
    if (!value || !value.trim()) return 'Name is required';
    return '';
  }
  if (field === 'email') {
    if (!value || !value.trim()) return 'Email is required';
    if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address';
    return '';
  }
  if (field === 'phone') {
    if (!value || !value.trim()) return 'Phone is required';
    const stripped = value.replace(/\s+/g, '');
    if (!PHONE_RE.test(stripped)) return 'Phone must be exactly 10 digits';
    return '';
  }
  return '';
}

function BookingModal({ expert, slot, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // If the user has already seen errors for this field, keep them in
    // sync with the live value rather than waiting for another blur.
    if ((touched[field] || submitAttempted) && field !== 'notes') {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateField(field, form[field]),
    }));
  };

  // Show a per-field error only if the field has been touched OR a submit
  // has been attempted — matches the spec's "after blur OR after submit".
  const visibleError = (field) => {
    if (!touched[field] && !submitAttempted) return '';
    return fieldErrors[field] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setGeneralError('');

    const errs = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
    };
    setFieldErrors(errs);
    if (errs.name || errs.email || errs.phone) {
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        expertId: expert._id,
        slotId: slot._id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\s+/g, ''),
        notes: form.notes.trim(),
      });
      onSuccess(booking);
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 409) {
        // Surface the conflict on the time slot field — that's the field
        // whose value is now stale.
        setFieldErrors((prev) => ({
          ...prev,
          timeSlot: 'This slot was just booked by someone else',
        }));
      } else if (status === 400 && data && data.errors) {
        // Server-side validation errors override our local state so the
        // user sees exactly what the API rejected.
        setFieldErrors((prev) => ({ ...prev, ...data.errors }));
      } else {
        setGeneralError(
          (data && data.message) ||
            err?.message ||
            'Failed to create booking. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const dateLabel = formatLongDate(slot?.date);
  const timeSlotLabel = `${slot?.startTime} – ${slot?.endTime}`;
  const metaLabel = formatShortMeta(slot?.date, slot?.startTime, slot?.endTime);

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.card} role="dialog" aria-modal="true">
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Book a Session</h2>
          <button
            type="button"
            style={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div style={styles.infoBox}>
          <span style={styles.infoExpert}>{expert?.name}</span>
          <span style={styles.infoMeta}>{metaLabel}</span>
          <span style={styles.infoRate}>₹{expert?.hourlyRate}/hr</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="booking-name">
              Name
            </label>
            <input
              id="booking-name"
              type="text"
              style={{
                ...styles.input,
                ...(visibleError('name') ? styles.inputError : {}),
              }}
              value={form.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Your full name"
              autoComplete="name"
            />
            {visibleError('name') && (
              <span style={styles.errorText}>{visibleError('name')}</span>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="booking-email">
              Email
            </label>
            <input
              id="booking-email"
              type="email"
              style={{
                ...styles.input,
                ...(visibleError('email') ? styles.inputError : {}),
              }}
              value={form.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {visibleError('email') && (
              <span style={styles.errorText}>{visibleError('email')}</span>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="booking-phone">
              Phone
            </label>
            <input
              id="booking-phone"
              type="tel"
              style={{
                ...styles.input,
                ...(visibleError('phone') ? styles.inputError : {}),
              }}
              value={form.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              placeholder="10-digit number"
              autoComplete="tel"
            />
            {visibleError('phone') && (
              <span style={styles.errorText}>{visibleError('phone')}</span>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <div style={styles.readonly}>{dateLabel}</div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Time Slot</label>
            <div style={styles.readonly}>{timeSlotLabel}</div>
            {fieldErrors.timeSlot && (
              <span style={styles.errorText}>{fieldErrors.timeSlot}</span>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="booking-notes">
              Notes
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              style={styles.textarea}
              value={form.notes}
              onChange={handleChange('notes')}
              placeholder="Anything you want the expert to know? (optional)"
            />
          </div>

          {generalError && (
            <div style={styles.errorBanner}>{generalError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={
              submitting
                ? { ...styles.submitBtn, ...styles.submitBtnDisabled }
                : styles.submitBtn
            }
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
