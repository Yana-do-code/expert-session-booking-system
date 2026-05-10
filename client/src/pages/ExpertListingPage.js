import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ExpertCard from '../components/ExpertCard';
import Pagination from '../components/Pagination';
import { fetchExperts } from '../services/expertService';

const PAGE_SIZE = 8;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    padding: '32px 24px 64px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterRow: {
    marginBottom: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  centerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
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
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    borderRadius: '50%',
    animation: 'expertSpin 0.8s linear infinite',
  },
};

const spinnerKeyframes = `@keyframes expertSpin { to { transform: rotate(360deg); } }`;

function ExpertListingPage({ onSelectExpert }) {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadExperts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExperts({ search, category, page, limit: PAGE_SIZE });
      setExperts(data.experts || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Something went wrong while fetching experts.'
      );
      setExperts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  // Reset to page 1 when filters change
  const handleSearchChange = (val) => {
    setPage(1);
    setSearch(val);
  };

  const handleCategoryChange = (val) => {
    setPage(1);
    setCategory(val);
  };

  return (
    <div style={styles.page}>
      <style>{spinnerKeyframes}</style>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Find an Expert</h1>
          <p style={styles.subtitle}>
            Browse and book sessions with vetted experts across multiple domains.
          </p>
        </header>

        <div style={styles.controls}>
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>

        <div style={styles.filterRow}>
          <CategoryFilter value={category} onChange={handleCategoryChange} />
        </div>

        {loading && (
          <div style={styles.centerBox}>
            <div style={styles.spinner} aria-label="Loading" />
          </div>
        )}

        {!loading && error && <div style={styles.errorBox}>{error}</div>}

        {!loading && !error && experts.length === 0 && (
          <div style={styles.centerBox}>No experts found.</div>
        )}

        {!loading && !error && experts.length > 0 && (
          <>
            <div style={styles.grid}>
              {experts.map((expert) => (
                <ExpertCard
                  key={expert._id}
                  expert={expert}
                  onSelect={onSelectExpert}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ExpertListingPage;
