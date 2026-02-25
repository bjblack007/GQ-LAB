
import React, { useState, useEffect, useCallback } from 'react';
import { Compass, Activity, User, MessageCircle, ShoppingBag } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ConstitutionCenter from './components/ConstitutionCenter';
import HealthPlan from './components/HealthPlan';
import HealthLogs from './components/HealthLogs';
import Community from './components/Community';
import Profile from './components/Profile';
import Auth from './components/Auth';
import Splash from './components/Splash';
import VitalityMall from './components/VitalityMall';
import { TabType, CustomThemeConfig, ReminderConfig } from './types';
import { DEFAULT_REMINDERS } from './constants';

export type ThemeKey = 'day' | 'night' | 'custom';
export type LangKey = 'zh' | 'en';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [qiYunResult, setQiYunResult] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(2480);
  const [subView, setSubView] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [clickedTab, setClickedTab] = useState<string | null>(null);
  
  const [lang, setLang] = useState<LangKey>(() => (localStorage.getItem('guan_qi_lang') as LangKey) || 'zh');
  const [theme, setTheme] = useState<ThemeKey>(() => (localStorage.getItem('guan_qi_theme') as ThemeKey) || 'night');
  
  const [customTheme, setCustomTheme] = useState<CustomThemeConfig>(() => {
    const saved = localStorage.getItem('guan_qi_custom_theme');
    return saved ? JSON.parse(saved) : {
      bgColor: '#1a1a1a',
      accentColor: '#fdd95f',
      textColor: '#ffffff',
      glassColor: 'rgba(255, 255, 255, 0.1)',
      bgImage: null
    };
  });

  const [reminders, setReminders] = useState<ReminderConfig[]>(() => {
    const saved = localStorage.getItem('guan_qi_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  useEffect(() => {
    const handlePointsUpdate = () => {
      const saved = localStorage.getItem('guan_qi_points');
      if (saved) setPoints(parseInt(saved));
    };
    window.addEventListener('points-updated', handlePointsUpdate);
    return () => window.removeEventListener('points-updated', handlePointsUpdate);
  }, []);

  // Theme application logic
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    const root = document.documentElement;
    
    if (theme === 'custom') {
      root.style.setProperty('--color-bg', customTheme.bgColor);
      root.style.setProperty('--accent', customTheme.accentColor);
      root.style.setProperty('--text-main', customTheme.textColor);
      root.style.setProperty('--glass-fill', customTheme.glassColor);
      
      // Calculate active icon color based on text color or accent
      root.style.setProperty('--nav-icon-active', customTheme.textColor);
      root.style.setProperty('--nav-icon-inactive', customTheme.textColor + '4D'); // 30% opacity
      
      if (customTheme.bgImage) {
        root.style.setProperty('--bg-url', `url('${customTheme.bgImage}')`);
        // Crucial for showing the image: make body bg transparent so the fixed bg div shows through
        document.body.style.background = 'transparent';
      } else {
        root.style.setProperty('--bg-url', 'none');
        document.body.style.background = customTheme.bgColor;
      }
    } else {
      // Revert to CSS class based variables handled in index.html, remove inline styles
      root.style.removeProperty('--color-bg');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--text-main');
      root.style.removeProperty('--glass-fill');
      root.style.removeProperty('--nav-icon-active');
      root.style.removeProperty('--nav-icon-inactive');
      root.style.removeProperty('--bg-url');
      document.body.style.background = ''; // Revert to CSS class control
    }
  }, [theme, customTheme]);

  const updateCustomTheme = (newConfig: CustomThemeConfig) => {
    setCustomTheme(newConfig);
    localStorage.setItem('guan_qi_custom_theme', JSON.stringify(newConfig));
    setTheme('custom');
    localStorage.setItem('guan_qi_theme', 'custom');
  };

  const updateReminders = (newReminders: ReminderConfig[]) => {
    setReminders(newReminders);
    localStorage.setItem('guan_qi_reminders', JSON.stringify(newReminders));
  };

  useEffect(() => {
    const savedResult = localStorage.getItem('guan_qi_last_result');
    if (savedResult) setQiYunResult(JSON.parse(savedResult));
    const savedUser = localStorage.getItem('guan_qi_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const navigateToTab = useCallback((tab: TabType, sub?: string) => {
    setClickedTab(tab);
    setTimeout(() => setClickedTab(null), 300);
    setActiveTab(tab);
    setSubView(sub || null);
  }, []);

  const handleLogin = (u: any) => {
    setUser(u);
    setShowSplash(true);
    localStorage.setItem('guan_qi_user', JSON.stringify(u));
    setActiveTab('home');
  };

  if (!user) return <Auth onLogin={handleLogin} />;
  if (showSplash) return <Splash user={user} onComplete={() => setShowSplash(false)} />;

  const renderContent = () => {
    const commonProps = { 
      theme, 
      lang, 
      onThemeToggle: () => setTheme(theme === 'day' ? 'night' : 'day'),
      onLangToggle: () => setLang(lang === 'zh' ? 'en' : 'zh')
    };
    switch (activeTab) {
      case 'home': return <Dashboard onActivate={navigateToTab} points={points} reminders={reminders} onUpdateReminders={updateReminders} {...commonProps} />;
      case 'plan': return <HealthPlan result={qiYunResult} lang={lang} onNavigate={navigateToTab} />;
      case 'profile': return (
        <Profile 
          onLogout={() => { setUser(null); localStorage.removeItem('guan_qi_user'); }} 
          user={user} 
          onUpdateUser={(u) => { setUser(u); localStorage.setItem('guan_qi_user', JSON.stringify(u)); }}
          theme={theme} 
          setTheme={setTheme} 
          lang={lang} 
          setLang={setLang} 
          customTheme={customTheme}
          onUpdateCustomTheme={updateCustomTheme}
          reminders={reminders}
          onUpdateReminders={updateReminders}
          onNavigate={navigateToTab} 
        />
      );
      case 'community': return <Community lang={lang} onNavigate={navigateToTab} />;
      case 'mall': return <VitalityMall onBack={() => setActiveTab('home')} initialMode={subView === 'purchased' ? 'inventory' : 'shop'} />;
      case 'constitution': return <ConstitutionCenter onResultCalculated={(res) => { setQiYunResult(res); localStorage.setItem('guan_qi_last_result', JSON.stringify(res)); }} currentResult={qiYunResult} onNavigateHome={() => setActiveTab('home')} initialStep={subView === 'test' ? 'form' : 'report'} {...commonProps} />;
      case 'records': return <HealthLogs lang={lang} theme={theme} points={points} initialTab={subView as any} onNavigate={navigateToTab} qiYunResult={qiYunResult} />;
      default: return <Dashboard onActivate={navigateToTab} points={points} reminders={reminders} onUpdateReminders={updateReminders} {...commonProps} />;
    }
  };

  const navItems = [
    { id: 'home', icon: Compass },
    { id: 'plan', icon: Activity },
    { id: 'profile', icon: User, center: true },
    { id: 'community', icon: MessageCircle },
    { id: 'mall', icon: ShoppingBag },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden relative selection:bg-white selection:text-black">
      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        {renderContent()}
      </main>

      {/* 底部 Pill Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] h-20 pill-dock z-[100] flex items-center justify-around px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isClicked = clickedTab === item.id;
          
          if (item.center) {
            return (
              <button 
                key={item.id}
                onClick={() => navigateToTab(item.id as TabType)}
                className={`relative -top-10 transition-all duration-500 ${isClicked ? 'scale-90' : 'hover:scale-110 active:scale-95'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isActive ? 'bg-[var(--accent)] text-[var(--color-bg)]' : 'bg-[var(--glass-fill)] backdrop-blur-3xl border border-[var(--border-color)]'}`}>
                  <Icon size={30} strokeWidth={1.2} />
                </div>
                {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div>}
              </button>
            );
          }

          return (
            <button 
              key={item.id} 
              onClick={() => navigateToTab(item.id as TabType)}
              className={`w-12 h-12 flex flex-col items-center justify-center gap-1 transition-all duration-300 nav-icon ${isActive ? 'active' : ''} ${isClicked ? 'scale-75' : 'active:scale-90'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2 : 1.2} />
              {isActive && <div className="w-1 h-1 rounded-full bg-current opacity-40"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;
