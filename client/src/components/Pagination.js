import React from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  button: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s ease, color 0.15s ease',
  },
  buttonDisabled: {
    cursor: 'not-allowed',
    color: '#9ca3af',
    background: '#f9fafb',
  },
  info: {
    fontSize: 14,
    color: '#374151',
    minWidth: 100,
    textAlign: 'center',
  },
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotal = Math.max(totalPages || 1, 1);
  const safeCurrent = Math.min(Math.max(currentPage || 1, 1), safeTotal);
  const prevDisabled = safeCurrent <= 1;
  const nextDisabled = safeCurrent >= safeTotal;

  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        onClick={() => !prevDisabled && onPageChange?.(safeCurrent - 1)}
        disabled={prevDisabled}
        style={prevDisabled ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
      >
        Prev
      </button>
      <span style={styles.info}>
        Page {safeCurrent} of {safeTotal}
      </span>
      <button
        type="button"
        onClick={() => !nextDisabled && onPageChange?.(safeCurrent + 1)}
        disabled={nextDisabled}
        style={nextDisabled ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
