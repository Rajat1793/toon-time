import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// Tabs
import TimerTab from './components/TimerTab';
import StopwatchTab from './components/StopwatchTab';
import LapsTab from './components/LapsTab';
import TicTacToeTab from './components/TicTacToeTab';

// Modals
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import UpgradeModal from './components/UpgradeModal';

import { ActiveView, Lap, SavedTimer, UserProfile, AppSettings } from './types';

export default function App() {
  // Navigation Main View State (Default to stopwatch as seen in Screen 2, or timer as seen in Screen 1)
  const [currentView, setCurrentView] = useState<ActiveView>('timer');

  // Trigger loading custom preset setup from Captains Log tab to focus tab
  const [triggerPresetId, setTriggerPresetId] = useState<string | null>(null);

  // Modal display toggles
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // App Settings State (Local Storage persistent)
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('toon_time_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      spinachPoints: 120, // default points
      tasksCompleted: 4,
      proUnlocked: false,
      isVolumeOn: true,
      isDottedBgOn: true,
    };
  });

  // User Profile State (Local Storage persistent)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('toon_time_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: 'Popeye',
      role: 'Captain',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZ4Mn4Z2QfnX3lt5FPihsu_9w50_J5EW_Qs0dZMk9kugNRhJCQkn15c_TcFca0mj1qb9971hpeXDJNlz-U2LX6VlMuA60LH99F_IQIy9rlByajrQ013xYNbBgTk6iWn72w_PyoJ8N9DgnLO8U3gy9bmOBuaUXmlPQrhnD8tXBhbDs-3PWJ_mBd3I6hYWlOQ-kix7UHYIj9jUx-5-Agg833ZZKdhqRw5QTlSfxrpoVkQn9NpCzOLq08hDFpnm6YXHPfrWdaARupVor',
    };
  });

  // Custom Split laps (shared between Stopwatch Split and Captain's Log Recent Laps)
  const [laps, setLaps] = useState<Lap[]>(() => {
    const saved = localStorage.getItem('toon_time_laps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Saved Presets List
  const [savedTimers, setSavedTimers] = useState<SavedTimer[]>(() => {
    const saved = localStorage.getItem('toon_time_timers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Sync state with storage
  useEffect(() => {
    localStorage.setItem('toon_time_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem('toon_time_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('toon_time_laps', JSON.stringify(laps));
  }, [laps]);

  useEffect(() => {
    localStorage.setItem('toon_time_timers', JSON.stringify(savedTimers));
  }, [savedTimers]);

  // Activate preset triggered from Saved Timers
  const handleActivatePreset = (presetId: string) => {
    setTriggerPresetId(presetId);
    setCurrentView('timer'); // auto jump to timer countdown view
  };

  const handleUpgradeComplete = () => {
    setAppSettings(prev => ({ ...prev, proUnlocked: true }));
  };

  const handleToggleSidebarMobile = () => {
    setShowSidebarMobile(prev => !prev);
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      appSettings.isDottedBgOn ? 'grid-bg' : 'bg-[#0D530E]'
    }`}>
      {/* Header component */}
      <Header 
        onOpenSettings={() => setShowSettings(true)} 
        onOpenHelp={() => setShowHelp(true)} 
        onOpenUpgrade={() => setShowUpgrade(true)}
        onToggleSidebar={handleToggleSidebarMobile}
        isDottedBgOn={appSettings.isDottedBgOn}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* Sidebar Left Component (Desktop Mode) */}
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => {
            setCurrentView(view);
            setShowSidebarMobile(false);
          }}
          userProfile={userProfile}
          proUnlocked={appSettings.proUnlocked}
          onOpenUpgrade={() => setShowUpgrade(true)}
          isDottedBgOn={appSettings.isDottedBgOn}
        />

        {/* Slidable mobile drawer menu inside desktop container */}
        {showSidebarMobile && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Backdrop slide-menu */}
            <div 
              className="fixed inset-0 bg-black/75" 
              onClick={() => setShowSidebarMobile(false)}
            ></div>
            <div className="relative bg-[#16421A] w-64 h-[calc(100vh-5rem)] top-20 border-r border-[#FBF5DD]/15 p-5 flex flex-col gap-4 z-40 text-[#FBF5DD]">
              <div className="flex items-center gap-3 p-3 bg-[#0D530E] border border-[#FBF5DD]/15 rounded-xl">
                <img
                  src={userProfile.avatarUrl}
                  className="w-10 h-10 rounded-full border border-[#FBF5DD]/15 bg-[#0D530E] object-cover"
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-heading text-sm font-semibold leading-none text-[#FBF5DD]">{userProfile.name}</p>
                  <p className="text-[10px] font-sans font-bold text-[#FBF5DD]/40 uppercase mt-1">Captain</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => {
                    setCurrentView('stopwatch');
                    setShowSidebarMobile(false);
                  }}
                  className={`flex items-center gap-3 p-3 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all ${
                    currentView === 'stopwatch'
                      ? 'bg-[#306D29] text-[#FBF5DD]'
                      : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD] hover:bg-[#FBF5DD]/5'
                  }`}
                >
                  <span>Stopwatch</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('timer');
                    setShowSidebarMobile(false);
                  }}
                  className={`flex items-center gap-3 p-3 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all ${
                    currentView === 'timer'
                      ? 'bg-[#306D29] text-[#FBF5DD]'
                      : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD] hover:bg-[#FBF5DD]/5'
                  }`}
                >
                  <span>Timer</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('laps');
                    setShowSidebarMobile(false);
                  }}
                  className={`flex items-center gap-3 p-3 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all ${
                    currentView === 'laps'
                      ? 'bg-[#306D29] text-[#FBF5DD]'
                      : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD] hover:bg-[#FBF5DD]/5'
                  }`}
                >
                  <span>Laps</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('tictactoe');
                    setShowSidebarMobile(false);
                  }}
                  className={`flex items-center gap-3 p-3 font-sans text-xs font-bold rounded-xl cursor-pointer transition-all ${
                    currentView === 'tictactoe'
                      ? 'bg-[#306D29] text-[#FBF5DD]'
                      : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD] hover:bg-[#FBF5DD]/5'
                  }`}
                >
                  <span>Tic Tac Toe</span>
                </button>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => {
                    setShowUpgrade(true);
                    setShowSidebarMobile(false);
                  }}
                  className="w-full bg-[#306D29] hover:bg-[#0D530E] text-[#FBF5DD] font-sans text-xs font-bold py-3 rounded-xl uppercase text-center cursor-pointer transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow px-4 md:px-10 py-10 pb-28 md:pb-12 w-full transition-all">
          
          {/* All tabs are always mounted so timers/stopwatch keep running in background */}
          <div className={currentView === 'timer' ? '' : 'hidden'}>
            <TimerTab
              appSettings={appSettings}
              setAppSettings={setAppSettings}
              savedTimers={savedTimers}
              triggerPresetId={triggerPresetId}
              clearTriggerPreset={() => setTriggerPresetId(null)}
            />
          </div>

          <div className={currentView === 'stopwatch' ? '' : 'hidden'}>
            <StopwatchTab 
              laps={laps} 
              setLaps={setLaps}
              isDottedBgOn={appSettings.isDottedBgOn}
            />
          </div>

          <div className={currentView === 'laps' ? '' : 'hidden'}>
            <LapsTab
              laps={laps}
              savedTimers={savedTimers}
              setSavedTimers={setSavedTimers}
              onActivatePreset={handleActivatePreset}
              isDottedBgOn={appSettings.isDottedBgOn}
            />
          </div>

          <div className={currentView === 'tictactoe' ? '' : 'hidden'}>
            <TicTacToeTab isDottedBgOn={appSettings.isDottedBgOn} />
          </div>

        </main>
      </div>

      {/* Bottom Sticky Navigation (for Mobile screens) */}
      <MobileNav currentView={currentView} onChangeView={setCurrentView} isDottedBgOn={appSettings.isDottedBgOn} />

      {/* Popups and drawer overlays */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          isDottedBgOn={appSettings.isDottedBgOn}
        />
      )}

      {showHelp && (
        <HelpModal 
          onClose={() => setShowHelp(false)}
          isDottedBgOn={appSettings.isDottedBgOn}
        />
      )}

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onUpgradeComplete={handleUpgradeComplete}
        />
      )}

    </div>
  );
}
