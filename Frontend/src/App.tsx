import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import { useState } from 'react';
import './App.css';

const queryClient = new QueryClient();


function App() {
  const [showGallery, setShowGallery] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      {showGallery ? (
        <Gallery />
      ) : (
        <Home onEnter={() => setShowGallery(true)} />
      )}
    </QueryClientProvider>
  );
}

export default App;
