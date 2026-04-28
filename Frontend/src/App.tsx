import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import { useState } from 'react';

type FeatureKey = 'astrolog';

const queryClient = new QueryClient();


function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey | null>(null);

  const handleSelectFeature = (feature: FeatureKey) => {
    setActiveFeature(feature);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {activeFeature === 'astrolog' ? (
        <Gallery onBack={() => setActiveFeature(null)} />
      ) : (
        <Home onSelectFeature={handleSelectFeature} />
      )}
    </QueryClientProvider>
  );
}

export default App;
