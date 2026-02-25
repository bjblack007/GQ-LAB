
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Zap, Clock, Brain, Coffee, ShoppingBag, 
  ClipboardList, Calendar, Cloud, LayoutGrid, CheckCircle2, ChevronRight, Activity,
  Wifi, Bluetooth, MoreHorizontal, Plus, Trash2, Check, X, Heart, Footprints, Utensils, Smile, TrendingUp, Bell, Sparkles, Gift
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ThemeKey, LangKey } from '../App';
import { SOLAR_TERMS, TREND_DATA } from '../constants';
import { ReminderConfig } from '../types';
import VitalitySystem from './VitalitySystem';
import CustomRecordModal from './CustomRecordModal';

interface Props {
  onActivate: (tab: any, sub?: string) => void;
  points: number;
  theme: ThemeKey;
  lang: LangKey;
  reminders: ReminderConfig[];
  onUpdateReminders: (r: ReminderConfig[]) => void;
  onThemeToggle?: () => void;
  onLangToggle?: () => void;
}

const Dashboard: React.FC<Props> = ({ onActivate, points, theme, lang, reminders, onUpdateReminders, onThemeToggle, onLangToggle }) => {
  const [time, setTime] = useState(new Date());
  
  // Hero Widget State
  const [activeHeroSlide, setActiveHeroSlide] = useState(0); // 0: Daily, 1: Wearable, 2: Trends, 3: Vitality
  const totalSlides = 4;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showVitalitySystem, setShowVitalitySystem] = useState(false);
  const [showCustomRecord, setShowCustomRecord] = useState<string | null>(null);

  // Swipe Logic
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const lastCheckIn = localStorage.getItem('guan_qi_last_checkin');
    const today = new Date().toDateString();
    if (lastCheckIn === today) {
      setHasCheckedIn(true);
    }

    return () => clearInterval(timer);
  }, []);

  const [exerciseGoal, setExerciseGoal] = useState('60m');

  useEffect(() => {
    const savedTargets = localStorage.getItem('guan_qi_exercise_targets');
    if (savedTargets) {
      try {
        const targets = JSON.parse(savedTargets);
        const total = Object.values(targets).reduce((acc: any, curr: any) => acc + curr, 0);
        setExerciseGoal(`${total}m`);
      } catch (e) {
        console.error('Failed to parse exercise targets', e);
      }
    }
  }, []);

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchEnd.current = null;
    const clientX = 'targetTouches' in e ? e.targetTouches[0].clientX : e.clientX;
    touchStart.current = clientX;
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'targetTouches' in e ? e.targetTouches[0].clientX : e.clientX;
    touchEnd.current = clientX;
  };

  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) {
      touchStart.current = null;
      return;
    }
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && activeHeroSlide < totalSlides - 1) setActiveHeroSlide(prev => prev + 1);
    if (isRightSwipe && activeHeroSlide > 0) setActiveHeroSlide(prev => prev - 1);
    
    touchStart.current = null;
    touchEnd.current = null;
  };

  const handleBreakCheckIn = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newReminders = reminders.map(r => {
      if (r.id === id) return { ...r, lastChecked: today };
      return r;
    });
    onUpdateReminders(newReminders);
    const current = parseInt(localStorage.getItem('guan_qi_points') || '2480');
    const newPoints = current + 15;
    localStorage.setItem('guan_qi_points', newPoints.toString());
    window.dispatchEvent(new Event('points-updated'));
  };

  const handleDailyCheckIn = () => {
    if (hasCheckedIn) return;
    const current = parseInt(localStorage.getItem('guan_qi_points') || '2480');
    const newPoints = current + 10;
    setHasCheckedIn(true);
    localStorage.setItem('guan_qi_points', newPoints.toString());
    localStorage.setItem('guan_qi_last_checkin', new Date().toDateString());
    window.dispatchEvent(new Event('points-updated'));
  };

  const currentTerm = useMemo(() => {
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const date = time.getDate().toString().padStart(2, '0');
    const todayStr = `${month}-${date}`;
    return SOLAR_TERMS.find(s => s.date === todayStr) || SOLAR_TERMS[SOLAR_TERMS.length - 1];
  }, [time]);

  const breakReminders = useMemo(() => reminders.filter(r => r.type === 'break' && r.enabled), [reminders]);
  const todayDate = new Date().toISOString().split('T')[0];

  // Date Formatting
  const dayName = time.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long' });
  const dayNum = time.getDate();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const healthScore = Math.min(100, Math.round(82 * (1 + points / 15000)));

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
  };

  const labels = {
    zh: {
      currentRitual: '今日修行', ritualDesc: '调和肝气 · 八段锦',
      reminder: '工间提醒', reminderDesc: '建议起立扩胸', complete: '打卡', done: '已完成',
      checkIn: '打卡', placeholder: '添加新事项...',
      vitality: '元气系统', vitalityDesc: '可用积分', enterSystem: '进入系统', todayVitality: '今日元气',
      dailyHealth: '监测中心', wearable: '设备同步', trends: '健康趋势', assessment: '定期评估',
      sleep: '睡眠', diet: '饮食', mood: '情绪', exercise: '运动',
      heartRate: '实时心率', steps: '今日步数', sleepQuality: '睡眠质量',
      sync: '数据已同步', syncing: '正在同步...',
      reAssess: '每月评估', monthlyRemind: '建议每月进行一次体质深度评估',
      overview: '监测概览', lastSync: '上次同步',
      goals: '目标完成度', hubTitle: '监测与跟踪',
      viewReport: '查看报告', startTest: '开始测试'
    },
    en: {
      currentRitual: 'Daily Ritual', ritualDesc: 'Balance Qi · Ba Duan Jin',
      reminder: 'Work Breaks', reminderDesc: 'Time for a stretch', complete: 'Check', done: 'Done',
      checkIn: 'Check', placeholder: 'Add new item...',
      vitality: 'Vitality System', vitalityDesc: 'Available Points', enterSystem: 'Enter System', todayVitality: 'Today Vitality',
      dailyHealth: 'Monitor Hub', wearable: 'Device Sync', trends: 'Health Trends', assessment: 'Assessment',
      sleep: 'Sleep', diet: 'Diet', mood: 'Mood', exercise: 'Exercise',
      heartRate: 'Heart Rate', steps: 'Steps Today', sleepQuality: 'Sleep Quality',
      sync: 'Data Synced', syncing: 'Syncing...',
      reAssess: 'Monthly Assess', monthlyRemind: 'Monthly constitution assessment recommended',
      overview: 'Monitor Overview', lastSync: 'Last Sync',
      goals: 'Goal Progress', hubTitle: 'Monitor & Track',
      viewReport: 'View Report', startTest: 'Start Test'
    }
  }[lang];

  return (
    <div className="relative min-h-screen flex flex-col p-4 pb-24 space-y-5 animate-in fade-in duration-1000">
      
      {/* 顶部简易 Header (Logo Only) */}
      <header className="flex justify-between items-center px-1 pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">System Core</span>
          <span className="text-sm font-bold tracking-tight opacity-80">Guan Qi OS</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onLangToggle} className="w-10 h-10 glass-card !rounded-2xl text-[10px] font-black flex items-center justify-center active:scale-90 border-[var(--border-color)]">
             {lang === 'zh' ? '中' : 'EN'}
          </button>
          <button onClick={onThemeToggle} className="w-10 h-10 glass-card !rounded-2xl flex items-center justify-center active:scale-90 border-[var(--border-color)]">
            {theme === 'day' ? <Sun size={16} className="text-[var(--accent)]" /> : <Moon size={16} className="text-[var(--accent)]" />}
          </button>
        </div>
      </header>

      {/* HERO WIDGET (Swipeable) */}
      <div 
        className="relative w-full aspect-[1/1.1] sm:aspect-[2/1] bg-[#1c1c1e] rounded-[2.5rem] text-white shadow-2xl overflow-hidden shrink-0 select-none group border border-white/5 cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={(e) => touchStart.current !== null && onTouchMove(e)}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        {/* Slide 0: Daily Health Data & Goals */}
        <div 
          className={`absolute inset-0 p-7 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeHeroSlide === 0 ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'}`}
        >
           <div className="flex justify-between items-center mb-5 shrink-0">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{labels.hubTitle}</span>
                 <h3 className="text-xl font-medium tracking-tight">{labels.dailyHealth}</h3>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">{labels.goals}</span>
                 <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] w-[75%] shadow-[0_0_10px_rgba(253,217,95,0.3)]"></div>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { id: 'sleep', icon: Moon, label: labels.sleep, val: '7.5h', goal: '8h', color: 'text-indigo-400', progress: 93 },
                { id: 'diet', icon: Utensils, label: labels.diet, val: '1850', goal: '2100', color: 'text-emerald-400', progress: 88, custom: true },
                { id: 'mood', icon: Smile, label: labels.mood, val: '平静', goal: '稳定', color: 'text-amber-400', progress: 100 },
                { id: 'exercise', icon: Activity, label: labels.exercise, val: '45m', goal: exerciseGoal, color: 'text-rose-400', progress: 75 }
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (item.id === 'mood') {
                      onActivate('records', 'emotion');
                    } else {
                      setShowCustomRecord(item.id);
                    }
                  }}
                  className="bg-white/5 rounded-3xl p-4 flex flex-col justify-between border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                >
                   <div className="flex justify-between items-start z-10">
                      <item.icon size={18} className={item.color} />
                      <span className="text-[8px] font-black opacity-30">{item.progress}%</span>
                   </div>
                   <div className="z-10">
                      <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{item.label}</p>
                      {item.id === 'diet' ? (
                        <div className="flex items-center gap-2 mt-1">
                           <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400" style={{ width: `${item.progress}%` }}></div>
                           </div>
                           <span className="text-xs font-medium tabular-nums">{item.val}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                           <span className="text-lg font-medium">{item.val}</span>
                           <span className="text-[9px] opacity-20">/ {item.goal}</span>
                        </div>
                      )}
                   </div>
                   {/* Progress Background */}
                   {!item.id.includes('diet') && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                       <div className={`h-full opacity-30 ${item.color.replace('text-', 'bg-')}`} style={{ width: `${item.progress}%` }}></div>
                    </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Slide 1: Wearable Device Sync */}
        <div 
          className={`absolute inset-0 p-7 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeHeroSlide === 1 ? 'translate-x-0 opacity-100 scale-100' : activeHeroSlide < 1 ? 'translate-x-full opacity-0 scale-95' : '-translate-x-full opacity-0 scale-95'}`}
        >
           <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{labels.hubTitle}</span>
                 <h3 className="text-xl font-medium tracking-tight">{labels.wearable}</h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={handleSync}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 transition-all active:scale-90 ${isSyncing ? 'text-blue-400' : 'text-[#34C759]'}`}
                >
                  {isSyncing ? `${Math.min(99, syncProgress)}%` : labels.sync}
                </button>
                {lastSyncTime && !isSyncing && (
                  <span className="text-[8px] opacity-30 font-bold uppercase tracking-tighter">
                    {labels.lastSync} {lastSyncTime}
                  </span>
                )}
              </div>
           </div>

           <div className="space-y-3 flex-1">
              {isSyncing && (
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-blue-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/5 rounded-[1.8rem] p-4 flex flex-col gap-2 border border-white/5 relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center">
                       <Heart size={18} className={isSyncing ? 'text-rose-500 animate-[pulse_1s_infinite]' : 'text-rose-500'} />
                       <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{labels.heartRate}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-medium tabular-nums">{isSyncing ? '--' : '72'}</span>
                       <span className="text-[10px] opacity-40">BPM</span>
                    </div>
                    <div className="h-8 w-full opacity-40">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[{v:68},{v:70},{v:75},{v:72},{v:74},{v:71},{v:73}]}>
                             <Area type="monotone" dataKey="v" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} strokeWidth={2} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white/5 rounded-[1.8rem] p-4 flex flex-col gap-2 border border-white/5 relative overflow-hidden hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center">
                       <Moon size={18} className="text-indigo-400" />
                       <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{labels.sleepQuality}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-medium tabular-nums">{isSyncing ? '--' : '88'}</span>
                       <span className="text-[10px] opacity-40">%</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                       {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.5)]' : 'bg-white/10'}`}></div>)}
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 rounded-[2rem] p-5 flex items-center gap-5 border border-white/5 relative overflow-hidden hover:bg-white/10 transition-colors">
                 <div className="w-12 h-12 rounded-2xl bg-[#34C759]/10 flex items-center justify-center text-[#34C759] shrink-0">
                    <Footprints size={24} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{labels.steps}</p>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-medium tabular-nums">{isSyncing ? '....' : '8,420'}</span>
                       <span className="text-xs opacity-40">/ 10,000</span>
                    </div>
                 </div>
                 <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                       <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-[#34C759]" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - 0.842)} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[8px] font-black">84%</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Slide 2: Health Trend Analysis */}
        <div 
          className={`absolute inset-0 p-7 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeHeroSlide === 2 ? 'translate-x-0 opacity-100 scale-100' : activeHeroSlide < 2 ? 'translate-x-full opacity-0 scale-95' : '-translate-x-full opacity-0 scale-95'}`}
        >
           <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{labels.hubTitle}</span>
                 <h3 className="text-xl font-medium tracking-tight">{labels.trends}</h3>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Last 6 Months</span>
                 <TrendingUp size={16} className="text-[var(--accent)]" />
              </div>
           </div>

           <div className="flex-1 w-full flex flex-col">
              <div className="h-40 w-full mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TREND_DATA}>
                       <defs>
                          <linearGradient id="miniQiGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#fdd95f" stopOpacity={0.4}/>
                             <stop offset="95%" stopColor="#fdd95f" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Tooltip 
                         content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                             return (
                               <div className="bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-xl text-[10px] font-bold">
                                 {payload[0].value} PTS
                               </div>
                             );
                           }
                           return null;
                         }}
                       />
                       <Area type="monotone" dataKey="score" stroke="#fdd95f" strokeWidth={3} fill="url(#miniQiGradient)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {[
                   { label: 'AVG', val: '86', trend: '+2%' },
                   { label: 'PEAK', val: '98', trend: 'MAX' },
                   { label: 'LOW', val: '72', trend: '-5%' }
                 ].map(stat => (
                   <div key={stat.label} className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center group hover:bg-white/10 transition-colors">
                      <p className="text-[8px] font-black opacity-30 uppercase tracking-tighter">{stat.label}</p>
                      <p className="text-sm font-bold tabular-nums">{stat.val}</p>
                      <p className={`text-[7px] font-bold ${stat.trend.includes('+') ? 'text-[#34C759]' : stat.trend.includes('-') ? 'text-rose-500' : 'text-[var(--accent)]'}`}>{stat.trend}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Slide 3: Vitality System */}
        <div 
          className={`absolute inset-0 p-7 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeHeroSlide === 3 ? 'translate-x-0 opacity-100 scale-100' : activeHeroSlide < 3 ? 'translate-x-full opacity-0 scale-95' : '-translate-x-full opacity-0 scale-95'}`}
        >
           <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{labels.hubTitle}</span>
                 <h3 className="text-xl font-medium tracking-tight">{labels.vitality}</h3>
              </div>
              <div className="flex items-center gap-2">
                 <Gift size={16} className="text-[var(--accent)]" />
              </div>
           </div>

           <div className="flex-1 w-full flex flex-col justify-center items-center space-y-4">
              <div className="flex items-center justify-around w-full px-2">
                {/* Today's Vitality */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <div className={`absolute inset-0 rounded-full blur-md transition-all duration-1000 ${hasCheckedIn ? 'bg-[var(--accent)] opacity-30 scale-125 animate-pulse' : 'bg-white/10 opacity-20 scale-100'}`} />
                    <Zap size={28} className={`relative transition-all duration-1000 ${hasCheckedIn ? 'text-[var(--accent)] drop-shadow-[0_0_10px_rgba(253,217,95,0.8)]' : 'text-white/20'}`} />
                    {/* Energy Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" className="text-[var(--accent)] transition-all duration-1000 ease-out" strokeDasharray="188.5" strokeDashoffset={hasCheckedIn ? 188.5 * (1 - 0.85) : 188.5 * (1 - 0.35)} strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">{labels.todayVitality}</p>
                    <p className="text-lg font-bold tabular-nums">{hasCheckedIn ? 85 : 35}<span className="text-[10px] opacity-50 ml-0.5">/100</span></p>
                  </div>
                </div>

                <div className="w-px h-16 bg-white/10"></div>

                {/* Total Points */}
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 flex items-center justify-center">
                    <div className="text-5xl font-light tracking-tighter text-[var(--accent)] tabular-nums drop-shadow-[0_0_15px_rgba(253,217,95,0.3)]">
                      {points}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] opacity-60 uppercase tracking-widest">{labels.vitalityDesc}</p>
                    <p className="text-lg font-bold tabular-nums opacity-0">0</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleDailyCheckIn}
                  disabled={hasCheckedIn}
                  className={`flex items-center gap-2 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
                    hasCheckedIn 
                      ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                      : 'bg-[var(--accent)] text-black hover:scale-105 active:scale-95'
                  }`}
                >
                  {hasCheckedIn ? <Check size={14} /> : <Sparkles size={14} />}
                  <span>{hasCheckedIn ? labels.done : labels.checkIn + ' (+10)'}</span>
                </button>
                <button 
                  onClick={() => setShowVitalitySystem(true)}
                  className="flex items-center gap-2 px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black active:scale-95"
                >
                  <Gift size={14} />
                  <span>{labels.enterSystem}</span>
                </button>
              </div>
           </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
           {[...Array(totalSlides)].map((_, i) => (
             <button 
               key={i} 
               onClick={(e) => {
                 e.stopPropagation();
                 setActiveHeroSlide(i);
               }}
               className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeHeroSlide === i ? 'bg-white w-4' : 'bg-white/20 hover:bg-white/40'}`} 
             />
           ))}
        </div>
      </div>

      {/* 核心功能图标 - Compacted */}
      <section className="flex justify-between px-4">
         {[
           { id: 'constitution', sub: 'test', icon: ClipboardList, label: lang === 'zh' ? '体质' : 'Essence' },
           { id: 'records', sub: 'stats', icon: LayoutGrid, label: lang === 'zh' ? '数据' : 'Stats' },
           { id: 'records', sub: 'journey', icon: Calendar, label: lang === 'zh' ? '足迹' : 'History' },
           { id: 'mall', sub: 'purchased', icon: ShoppingBag, label: lang === 'zh' ? '补给' : 'Store' }
         ].map(link => (
           <button key={link.label} onClick={() => onActivate(link.id, link.sub)} className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 squircle-icon bg-[var(--glass-fill)] shadow-sm hover:bg-[var(--accent)]/20 transition-colors">
                <link.icon size={22} strokeWidth={1.5} className="text-[var(--accent)] opacity-90" />
              </div>
              <span className="text-[9px] font-black opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-[0.1em]">{link.label}</span>
           </button>
         ))}
      </section>

      {/* 动态推荐 & 工间提醒 - Compacted Spacing */}
      <section className="space-y-3">
        <div 
          onClick={() => onActivate('plan')}
          className="glass-card p-5 flex items-center gap-6 group cursor-pointer border-[var(--border-color)] shadow-sm hover:bg-[var(--accent)]/5 transition-all"
        >
           <div className="w-12 h-12 squircle-icon shrink-0 bg-[var(--accent)]/5 border-transparent">
              <Brain size={22} strokeWidth={1.5} className="text-[var(--accent)] opacity-80" />
           </div>
           <div className="flex-1 space-y-0.5">
              <h4 className="text-base font-bold tracking-tight">{labels.currentRitual}</h4>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">{labels.ritualDesc}</p>
           </div>
           <ChevronRight size={18} className="opacity-10 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 工间提醒列表 */}
        <div className="glass-card p-5 border-[var(--border-color)] shadow-sm flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 squircle-icon shrink-0 bg-[var(--accent)]/10">
                <Coffee size={14} strokeWidth={2} className="text-[var(--accent)]" />
             </div>
             <div>
               <h4 className="text-sm font-bold tracking-tight">{labels.reminder}</h4>
               <p className="text-[9px] opacity-40 uppercase tracking-widest">{breakReminders.length} Sessions</p>
             </div>
           </div>

           <div className="space-y-2">
             {breakReminders.slice(0, 3).map(item => {
               const isChecked = item.lastChecked === todayDate;
               return (
                 <div key={item.id} className="flex items-center justify-between p-3 glass-card border-[var(--border-color)] bg-transparent hover:bg-[var(--accent)]/5 transition-colors !rounded-xl">
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black opacity-30 w-8">{item.time}</span>
                     <span className={`text-xs font-bold ${isChecked ? 'opacity-40 line-through' : ''}`}>{item.label}</span>
                   </div>
                   <button 
                    onClick={() => !isChecked && handleBreakCheckIn(item.id)}
                    disabled={isChecked}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-transparent border border-[var(--accent)] text-[var(--accent)] opacity-50' 
                        : 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-md active:scale-90'
                    }`}
                   >
                     {isChecked ? <Check size={12}/> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                   </button>
                 </div>
               );
             })}
           </div>
        </div>
      </section>

      <VitalitySystem 
        isOpen={showVitalitySystem} 
        onClose={() => setShowVitalitySystem(false)} 
        points={points} 
        lang={lang} 
      />

      <CustomRecordModal 
        isOpen={!!showCustomRecord} 
        onClose={() => setShowCustomRecord(null)} 
        lang={lang} 
        type={showCustomRecord || ''} 
      />
    </div>
  );
};

export default Dashboard;
