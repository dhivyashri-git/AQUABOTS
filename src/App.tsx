import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { DrainDetailDrawer } from './components/common/DrainDetailDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { Landing } from './pages/Landing';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { role } = useAuth();
  const { selectedDrain, setSelectedDrain } = useApp();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalDefaultRole, setLoginModalDefaultRole] = useState<'citizen' | 'worker' | 'admin'>('citizen');

  const handleOpenLogin = (initialRole: 'citizen' | 'worker' | 'admin' = 'citizen') => {
    setLoginModalDefaultRole(initialRole);
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#061A2E] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Sticky Header Navbar */}
      <Navbar onOpenLogin={handleOpenLogin} />

      {/* Main Viewport Router based on User Role */}
      <main className="flex-1 relative">
        {role === 'citizen' && <CitizenDashboard />}
        {role === 'worker' && <WorkerDashboard />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'public' && <Landing onOpenLogin={handleOpenLogin} />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Global Drawers */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultRole={loginModalDefaultRole}
      />

      {/* Interactive Telemetry & Actuation Inspection Drawer */}
      <DrainDetailDrawer />

      {/* Global Animated Toast Notification System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
