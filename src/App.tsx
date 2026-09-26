import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { CreateReviewModal } from './components/reviews/CreateReviewModal';

import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { ReviewsView } from './views/ReviewsView';
import { LibraryView } from './views/LibraryView';
import { ArtistsView } from './views/ArtistsView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { CreateReviewView } from './views/CreateReviewView';
import { ReviewDetailView } from './views/ReviewDetailView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { TrackDetailView } from './views/TrackDetailView';
import { AchievementsView } from './views/AchievementsView';
import { Sparkles, CheckCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { authMode, currentView, setAuthMode, toastMessage, navigateTo } = useApp();

  if (authMode === 'login') {
    return <LoginView />;
  }

  if (authMode === 'register') {
    return <RegisterView />;
  }

  if (authMode === 'onboarding') {
    return <OnboardingFlow />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'inicio':
        return <HomeView />;
      case 'explorar':
        return <ExploreView />;
      case 'resenhas':
        return <ReviewsView />;
      case 'biblioteca':
        return <LibraryView />;
      case 'artistas':
        return <ArtistsView />;
      case 'notificacoes':
        return <NotificationsView />;
      case 'perfil':
      case 'user-profile':
        return <ProfileView />;
      case 'configuracoes':
        return <SettingsView />;
      case 'create-review':
        return <CreateReviewView />;
      case 'review-detail':
        return <ReviewDetailView />;
      case 'album-detail':
        return <AlbumDetailView />;
      case 'artist-detail':
        return <ArtistDetailView />;
      case 'track-detail':
        return <TrackDetailView />;
      case 'achievements':
        return <AchievementsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#18181B] flex flex-col antialiased">
      <div className="flex flex-1 w-full min-h-screen">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Center Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation />

      {/* Global Review Creation Modal */}
      <CreateReviewModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle size={16} className="text-[#7C3AED]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Discreet Demo Stage Navigator (Floating pill for effortless review of all screens) */}
      <div className="fixed bottom-4 right-4 z-50 hidden sm:flex items-center gap-1.5 p-1.5 bg-[#18181B]/90 backdrop-blur-md text-white rounded-full border border-white/10 shadow-xl text-[11px] font-semibold">
        <span className="text-[#A1A1AA] px-2">Navegar:</span>
        <button
          onClick={() => navigateTo('create-review')}
          className="px-2.5 py-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer text-[#EDE9FE]"
        >
          + Resenha
        </button>
        <button
          onClick={() => navigateTo('achievements')}
          className="px-2.5 py-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer text-[#EDE9FE]"
        >
          Conquistas
        </button>
        <button
          onClick={() => setAuthMode('login')}
          className="px-2.5 py-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer text-[#A1A1AA] hover:text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
