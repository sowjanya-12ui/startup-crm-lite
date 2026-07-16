import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import { LeadProvider } from './context/LeadContext';
import { useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppLayout() {
  const { isDarkMode } = useTheme();
  const { token } = useAuth(); // We check token to conditionally render Sidebar

  return (
    <LeadProvider>
      <div className="bg-background text-text-main min-h-screen font-sans selection:bg-primary/30 transition-colors duration-200">
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-background text-text-main transition-colors duration-200">
          
          {/* Render Sidebar only if user is logged in */}
          {token && <Sidebar />}

          <main className="flex-1 relative z-10 overflow-y-auto bg-background transition-colors duration-200">
            <AppRoutes />
          </main>

        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#111827',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </LeadProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;