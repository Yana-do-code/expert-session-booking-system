import React, { useEffect, useRef, useState } from 'react';

const styles = {
  wrapper: {
    position: 'relative',
    flex: '1 1 320px',
    maxWidth: 480,
  },
  input: {
    width: '100%',
    padding: '10px 14px 10px 38px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    outline: 'none',
    background: '#fff',
    color: '#111827',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  inputFocus: {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
    fontSize: 16,
  },
};

function SearchBar({ value = '', onChange, placeholder = 'Search experts by name...', delay = 400 }) {
  const [internal, setInternal] = useState(value);
  const [focused, setFocused] = useState(false);
  const timerRef = useRef(null);
  const lastEmittedRef = useRef(value);

  // Sync external value updates (e.g., reset)
  useEffect(() => {
    setInternal(value);
    lastEmittedRef.current = value;
  }, [value]);

  // Debounced emit
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (internal !== lastEmittedRef.current) {
        lastEmittedRef.current = internal;
        onChange?.(internal);
      }
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [internal, delay, onChange]);

  return (
    <div style={styles.wrapper}>
      <span style={styles.icon} aria-hidden="true">
        {/* Inline SVG search icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={focused ? { ...styles.input, ...styles.inputFocus } : styles.input}
      />
    </div>
  );
}

export default SearchBar;
