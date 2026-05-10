import React, { useState } from 'react';
import ExpertListingPage from './pages/ExpertListingPage';
import ExpertDetailPage from './pages/ExpertDetailPage';

function App() {
  const [selectedExpertId, setSelectedExpertId] = useState(null);
  return selectedExpertId ? (
    <ExpertDetailPage
      expertId={selectedExpertId}
      onBack={() => setSelectedExpertId(null)}
    />
  ) : (
    <ExpertListingPage onSelectExpert={setSelectedExpertId} />
  );
}

export default App;
