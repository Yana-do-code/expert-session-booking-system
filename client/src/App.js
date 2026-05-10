import React, { useState } from 'react';
import ExpertListingPage from './pages/ExpertListingPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  const [view, setView] = useState('listing'); // 'listing' | 'detail' | 'myBookings'
  const [selectedExpertId, setSelectedExpertId] = useState(null);

  if (view === 'myBookings') {
    return <MyBookingsPage onBack={() => setView('listing')} />;
  }

  if (view === 'detail') {
    return (
      <ExpertDetailPage
        expertId={selectedExpertId}
        onBack={() => setView('listing')}
      />
    );
  }

  return (
    <ExpertListingPage
      onSelectExpert={(id) => {
        setSelectedExpertId(id);
        setView('detail');
      }}
      onMyBookings={() => setView('myBookings')}
    />
  );
}

export default App;
