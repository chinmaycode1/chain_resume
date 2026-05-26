import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { ScorePage } from './pages/ScorePage';
import '@rainbow-me/rainbowkit/styles.css';

const CardPage = lazy(() => import('./pages/CardPage'));

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00FF94',
            accentColorForeground: '#020208',
            borderRadius: 'medium',
          })}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/builder" element={<ResumeBuilder />} />
              <Route path="/score/:resumeId?" element={<ScorePage />} />
              <Route
                path="/card"
                element={
                  <Suspense
                    fallback={
                      <div
                        style={{
                          width: '100vw',
                          height: '100vh',
                          background: '#020208',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00FF94',
                          fontFamily: 'monospace',
                        }}
                      >
                        LOADING 3D ENGINE...
                      </div>
                    }
                  >
                    <CardPage />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
