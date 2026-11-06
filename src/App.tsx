/**
 * Aqua Nexus — Smart Lake Intelligence & Autonomous Floating Robot Platform
 * Main Application Orchestrator
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SimulationBar } from './components/layout/SimulationBar';
import { MobileNav } from './components/layout/MobileNav';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { WaterQualityPage } from './pages/WaterQualityPage';
import { OperationsPage } from './pages/OperationsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MissionsPage } from './pages/MissionsPage';
import { DevicesPage } from './pages/DevicesPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { Esp32BridgeSpec } from './components/hardware/Esp32BridgeSpec';

const AppContent: React.FC = () => {
  const { activeView } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'map':
        return <MapPage />;
      case 'water-quality':
        return <WaterQualityPage />;
      case 'operations':
        return <OperationsPage />;
      case 'insights':
        return <AIInsightsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'missions':
        return <MissionsPage />;
      case 'devices':
        return <DevicesPage />;
      case 'calibrations':
        return <CalibrationPage />;
      case 'esp32-bridge':
        return <Esp32BridgeSpec />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08111F] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#14B8A6]/30 selection:text-[#71F8E4]">
      {/* Top Bar Header */}
      <Header />

      {/* Persistent Simulation Control & Integrity Bar */}
      <SimulationBar />

      {/* Main Workspace: Persistent Sidebar + Viewport Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop / Tablet Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Central Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-8 bg-grid-pattern">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Touch Navigation */}
      <MobileNav />

      {/* Authentication Suite Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
