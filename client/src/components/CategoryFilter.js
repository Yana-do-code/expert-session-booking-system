import React from 'react';

const CATEGORIES = ['All', 'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Health'];

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    padding: '8px 14px',
    borderRadius: 999,
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#374151',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
  },
  buttonActive: {
    background: '#4f46e5',
    color: '#ffffff',
    borderColor: '#4f46e5',
  },
};

function CategoryFilter({ value, onChange }) {
  return (
    <div style={styles.wrapper} role="group" aria-label="Filter experts by category">
      {CATEGORIES.map((cat) => {
        const isAll = cat === 'All';
        const isActive = isAll ? !value : value === cat;
        const next = isAll ? '' : cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange?.(next)}
            style={isActive ? { ...styles.button, ...styles.buttonActive } : styles.button}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
