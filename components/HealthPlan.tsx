
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Heart, Utensils, Clock, Activity, Sparkles, Coffee, Sun, Zap, Check,
  LayoutGrid, Brain, MoonStar, Target, Compass, ChevronDown, ChevronUp,
  Play, Pause, RotateCcw, Wind, ChevronRight, X, ArrowLeft
} from 'lucide-react';
import { SOLAR_TERMS, CULTIVATION_LIBRARY } from '../constants';
import { LangKey } from '../App';
import { TabType, LibraryItem } from '../types';

interface Props {
  result: any;
  lang: LangKey;
  onNavigate?: (tab: TabType, sub?: string) => void;
}

const HealthPlan: React.FC<Props> = ({ result, lang, onNavigate }) => {
  const [viewMode, setViewMode] = useState<'schedule' | 'library' | 'meditation' | 'none'>('schedule');
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<LibraryItem | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<'kungfu' | 'diet' | 'emotion'>('kungfu');
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);
  const [musicMode, setMusicMode] = useState<string | null>(null);
  
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [initialSeconds, setInitialSeconds] = useState(600);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const ICON_GOLD = "#fdd95f";

  // Identify weak element for recommendations
  const weakElement = useMemo(() => {
     if (!result || !result.energy) return null;
     const energy = result.energy;
     // Find element with value < 10 (or the lowest if all are sufficient but relatively low)
     const entries = Object.entries(energy) as [string, number][];
     entries.sort((a, b) => a[1] - b[1]);
     return entries[0][0]; // Returns 'wood', 'fire', etc.
  }, [result]);

  const labels = {
    zh: {
      schedule: '修行课表', library: '修身馆', essence: '我的体质', meditation: '静心冥想',
      morning: '晨启', noon: '午养', evening: '晚收',
      start: '开启修行', categories: { all: '全部', kungfu: '运动养生', diet: '饮食调理', emotion: '情志调节', routine: '作息调理' },
      meditationTitle: '气神合一', meditationDesc: '调息凝神，回归真我',
      complete: '修行圆满'
    },
    en: {
      schedule: 'Rituals', library: 'Library', essence: 'My Essence', meditation: 'Meditation',
      morning: 'Morning', noon: 'Noon', evening: 'Night',
      start: 'Start', categories: { all: 'All', kungfu: 'Exercise', diet: 'Diet', emotion: 'Emotion', routine: 'Routine' },
      meditationTitle: 'Zen Breath', meditationDesc: 'Harmonize spirit and breath',
      complete: 'Enlightened'
    }
  }[lang];

  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
      timerRef.current = window.setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      handleMeditationComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timerSeconds]);

  const handleMeditationComplete = () => {
    setIsTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const current = parseInt(localStorage.getItem('guan_qi_points') || '2480');
    localStorage.setItem('guan_qi_points', (current + 50).toString());
    window.dispatchEvent(new Event('points-updated'));
    alert(labels.complete + "! +50 Qi Points");
    setTimerSeconds(initialSeconds);
  };

  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerSeconds(initialSeconds);
  };
  const setPreset = (mins: number) => {
    setIsTimerActive(false);
    setInitialSeconds(mins * 60);
    setTimerSeconds(mins * 60);
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((initialSeconds - timerSeconds) / initialSeconds) * 100;

  const filteredLibrary = useMemo(() => {
    let items = libraryFilter === 'all' 
      ? [...CULTIVATION_LIBRARY] 
      : CULTIVATION_LIBRARY.filter(item => item.category === libraryFilter);
      
    // Sort items: Recommended first, then by category
    return items.sort((a, b) => {
        const aRec = a.element === weakElement;
        const bRec = b.element === weakElement;
        if (aRec && !bRec) return -1;
        if (!aRec && bRec) return 1;
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
    });
  }, [libraryFilter, weakElement]);

  const handleCheckIn = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkedInIds.includes(id)) return;
    setCheckedInIds(prev => [...prev, id]);
    const current = parseInt(localStorage.getItem('guan_qi_points') || '2480');
    localStorage.setItem('guan_qi_points', (current + 20).toString());
    window.dispatchEvent(new Event('points-updated'));
  };

  const rituals = [
    { id: 'morning', time: '07:00', title: labels.morning, icon: Sun, desc: '生发阳气' },
    { id: 'noon', time: '12:00', title: labels.noon, icon: Coffee, desc: '调养心经' },
    { id: 'meditation-daily', time: 'Anytime', title: labels.meditation, icon: Brain, desc: '调理情绪', special: 'meditation' },
    { id: 'evening', time: '21:00', title: labels.evening, icon: MoonStar, desc: '封藏引火' },
  ];

  return (
    <div className="min-h-full pt-20 pb-48 px-6 space-y-8 animate-zen">
      {/* 顶部体质模块 - 在静心冥想模式下隐藏以达到纯净效果 */}
      {viewMode !== 'meditation' && (
        <div 
          onClick={() => setViewMode(prev => prev === 'none' ? 'schedule' : 'none')}
          className={`bento-card glass-panel p-8 rounded-[3.5rem] space-y-6 relative overflow-hidden transition-all duration-700 ${viewMode === 'none' ? 'bg-accent/5' : 'bg-gradient-to-br from-accent/10 to-transparent border-accent/20 border'}`}
        >
          <div className="flex justify-between items-center relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center shadow-inner">
                   <Compass size={24} color={ICON_GOLD} className={viewMode !== 'none' ? 'animate-spin-slow' : ''} />
                </div>
                <div className="space-y-0.5">
                   <h3 className="text-2xl font-normal tracking-tighter">{labels.essence}</h3>
                   <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{result?.type || '辨识待启'}</p>
                </div>
             </div>
             {viewMode === 'none' ? <ChevronDown size={20} className="opacity-30" /> : <ChevronUp size={20} className="opacity-30" />}
          </div>
          
          {viewMode !== 'none' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
               <p className="text-sm font-medium opacity-70 italic leading-relaxed">“{result?.advice?.core || '顺应自然，静待元气复苏。'}”</p>
               <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewMode('schedule'); }} 
                    className={`flex-1 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'schedule' ? 'bg-accent text-white shadow-lg' : 'glass-panel opacity-40'}`}
                  >
                    {labels.schedule}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewMode('library'); }} 
                    className={`flex-1 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'library' ? 'bg-accent text-white shadow-lg' : 'glass-panel opacity-40'}`}
                  >
                    {labels.library}
                  </button>
               </div>
            </div>
          )}
        </div>
      )}

      <div className="min-h-[450px]">
        {viewMode === 'schedule' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-5">
            {rituals.map((item) => (
              <div 
                key={item.id} 
                onClick={(e) => item.special === 'meditation' ? setViewMode('meditation') : handleCheckIn(item.id, e)}
                className={`glass-card p-6 border-white/5 flex items-center gap-6 cursor-pointer shadow-soft transition-all active:scale-98 ${checkedInIds.includes(item.id) ? 'bg-accent/5 opacity-60' : ''}`}
              >
                <div className={`w-14 h-14 glass-panel !rounded-2xl flex items-center justify-center shadow-inner text-accent bg-white/5`}>
                  <item.icon size={24} color={ICON_GOLD} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold tracking-tight">{item.title}</h4>
                    <span className="text-[9px] font-black opacity-30 uppercase">{item.time}</span>
                  </div>
                  <p className="text-[10px] opacity-40 mt-0.5">{item.desc}</p>
                </div>
                {checkedInIds.includes(item.id) ? <Check size={18} className="text-accent" /> : <ChevronRight size={16} className="opacity-10" />}
              </div>
            ))}
          </div>
        )}

        {viewMode === 'meditation' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-700 flex flex-col items-center py-4">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-normal tracking-tighter reveal-gradient-text">{labels.meditationTitle}</h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">{labels.meditationDesc}</p>
             </div>

             <div className="relative vitality-ring w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                   <circle 
                    cx="128" cy="128" r="110" 
                    fill="none" stroke="currentColor" strokeWidth="4" className="opacity-5"
                   />
                   <circle 
                    cx="128" cy="128" r="110" 
                    fill="none" stroke={ICON_GOLD} strokeWidth="4" 
                    strokeDasharray="690.8" 
                    strokeDashoffset={690.8 - (690.8 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                   />
                </svg>
                
                <div className={`w-48 h-48 rounded-full glass-panel flex flex-col items-center justify-center shadow-2xl relative ${isTimerActive ? 'animate-breath' : ''}`}>
                   <span className="text-5xl font-light tabular-nums tracking-tighter">{formatTime(timerSeconds)}</span>
                   <Wind size={20} color={ICON_GOLD} className={`mt-2 transition-opacity ${isTimerActive ? 'opacity-80 animate-pulse' : 'opacity-0'}`} />
                </div>
             </div>

             <div className="flex gap-3">
                {[5, 10, 20].map(mins => (
                  <button 
                    key={mins} 
                    onClick={() => setPreset(mins)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${initialSeconds === mins * 60 ? 'bg-accent text-white' : 'glass-panel opacity-30'}`}
                  >
                    {mins}m
                  </button>
                ))}
             </div>

             <div className="flex items-center gap-8 pt-4">
                <button onClick={() => setViewMode('schedule')} className="p-4 glass-panel rounded-full active:scale-90 transition-all">
                  <ArrowLeft size={20} color={ICON_GOLD} className="opacity-60" />
                </button>
                <button onClick={resetTimer} className="p-4 glass-panel rounded-full active:scale-90 transition-all"><RotateCcw size={20} color={ICON_GOLD} className="opacity-60" /></button>
                <button 
                  onClick={toggleTimer} 
                  className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                >
                  {isTimerActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>
                <button onClick={() => setViewMode('schedule')} className="p-4 glass-panel rounded-full active:scale-90 transition-all"><LayoutGrid size={20} color={ICON_GOLD} className="opacity-60" /></button>
             </div>
          </div>
        )}

        {viewMode === 'library' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {(['all', 'kungfu', 'diet', 'emotion', 'routine'] as const).map(cat => (
                <button key={cat} onClick={() => setLibraryFilter(cat)} className={`flex-shrink-0 px-5 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${libraryFilter === cat ? 'bg-accent text-white shadow-lg' : 'glass-panel opacity-40'}`}>
                  {labels.categories[cat]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredLibrary.map(item => (
                <div key={item.id} onClick={() => setSelectedLibraryItem(item)} className={`glass-card p-6 !rounded-[2.2rem] flex flex-col gap-4 border-white/5 shadow-soft hover:bg-white/10 transition-colors relative ${item.element === weakElement ? 'border-accent/30' : ''}`}>
                  {item.element === weakElement && (
                      <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest bg-accent text-white px-2 py-1 rounded-md">
                          Recommended
                      </div>
                  )}
                  <div className="w-10 h-10 glass-panel !rounded-xl flex items-center justify-center shadow-inner bg-white/5">
                    <Sparkles size={18} color={ICON_GOLD} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold tracking-tight">{item.title}</h5>
                    <p className="text-[9px] opacity-40 line-clamp-1 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div onClick={() => setViewMode('meditation')} className="glass-card p-6 !rounded-[2.2rem] flex flex-col gap-4 border-accent/20 bg-accent/5 shadow-soft border hover:bg-accent/10 transition-colors">
                  <div className="w-10 h-10 glass-panel !rounded-xl flex items-center justify-center shadow-inner bg-white/10">
                    <Brain size={18} color={ICON_GOLD} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold tracking-tight text-accent">{labels.meditation}</h5>
                    <p className="text-[9px] opacity-40 line-clamp-1 mt-1">进入静谧空间</p>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedLibraryItem && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-3xl flex items-end justify-center px-4 pb-20">
           <div className="glass-card w-full max-w-md p-10 space-y-8 animate-in slide-in-from-bottom duration-500 border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <span className="px-3 py-1 glass-panel text-accent rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5">
                      {labels.categories[selectedLibraryItem.category as keyof typeof labels.categories] || selectedLibraryItem.category}
                    </span>
                    <h4 className="text-3xl font-normal tracking-tighter pt-2">{selectedLibraryItem.title}</h4>
                 </div>
                 <button onClick={() => { setSelectedLibraryItem(null); setMusicMode(null); }} className="p-3 glass-panel rounded-full bg-white/5"><X size={20} color={ICON_GOLD} /></button>
              </div>

              <div className="space-y-4">
                <p className="text-sm opacity-80 leading-relaxed">{selectedLibraryItem.desc}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedLibraryItem.scheduledTime && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-lg bg-white/5 text-[10px] opacity-80">
                      <Clock size={12} className="text-accent" />
                      <span>{selectedLibraryItem.scheduledTime}</span>
                    </div>
                  )}
                  {selectedLibraryItem.meridians && selectedLibraryItem.meridians.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-lg bg-white/5 text-[10px] opacity-80">
                      <Activity size={12} className="text-accent" />
                      <span>{selectedLibraryItem.meridians.join(', ')}</span>
                    </div>
                  )}
                  {selectedLibraryItem.acupoints && selectedLibraryItem.acupoints.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-lg bg-white/5 text-[10px] opacity-80">
                      <Target size={12} className="text-accent" />
                      <span>{selectedLibraryItem.acupoints.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedLibraryItem.title === '职场八段锦' ? (
                <div className="space-y-4">
                  <div className="w-full aspect-video bg-black/50 rounded-2xl overflow-hidden relative flex items-center justify-center border border-white/10 group cursor-pointer hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={32} className="text-accent ml-1" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-xs opacity-50 font-bold tracking-widest uppercase">Video Guide</div>
                  </div>
                  <div className="space-y-2 max-h-[20vh] overflow-y-auto no-scrollbar pr-1">
                    {selectedLibraryItem.content.map((p, idx) => (
                      <div key={idx} className="flex gap-4 p-4 glass-panel rounded-2xl border-white/5 bg-white/[0.02]">
                        <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[8px] font-black shrink-0">{idx+1}</span>
                        <p className="text-[10px] leading-relaxed opacity-70">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedLibraryItem.title === '音乐疗愈' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    {['助眠模式', '专注模式', '白噪音模式', '五行音乐模式'].map(mode => (
                      <button 
                        key={mode} 
                        onClick={() => setMusicMode(mode)}
                        className={`p-3 rounded-xl text-[10px] font-bold text-center transition-colors ${musicMode === mode ? 'bg-accent text-white shadow-lg' : 'glass-panel hover:bg-white/10'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  
                  {musicMode && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-6 glass-panel rounded-3xl flex flex-col items-center gap-6 border-accent/20 bg-accent/5">
                        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center shadow-[0_0_30px_rgba(253,217,95,0.2)]">
                          <Wind size={32} className="text-accent animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="text-sm font-bold tracking-widest">{musicMode}</div>
                          <div className="text-[10px] opacity-50 uppercase tracking-widest">Playing</div>
                        </div>
                        <div className="flex items-center gap-6 w-full justify-center">
                          <button className="p-2 opacity-50 hover:opacity-100 transition-opacity"><RotateCcw size={16} /></button>
                          <button className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                            <Pause size={20} />
                          </button>
                          <button className="p-2 opacity-50 hover:opacity-100 transition-opacity"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-[9px] font-black opacity-30 uppercase tracking-widest px-2">Playlist</div>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between p-3 glass-panel rounded-xl hover:bg-white/5 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] opacity-50">{i}</div>
                              <span className="text-[10px] font-medium">{musicMode} Track {i}</span>
                            </div>
                            <span className="text-[9px] opacity-30">45:00</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-h-[30vh] overflow-y-auto no-scrollbar pr-1">
                   {selectedLibraryItem.content.map((p, idx) => (
                      <div key={idx} className="flex gap-4 p-5 glass-panel rounded-3xl border-white/5 bg-white/[0.02]">
                         <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[9px] font-black shrink-0">{idx+1}</span>
                         <p className="text-xs leading-relaxed opacity-70">{p}</p>
                      </div>
                   ))}
                </div>
              )}

              <button 
                onClick={() => {
                  if (selectedLibraryItem.category === 'emotion' && selectedLibraryItem.title !== '音乐疗愈') {
                    setSelectedLibraryItem(null);
                    setMusicMode(null);
                    setViewMode('meditation');
                  } else {
                    setSelectedLibraryItem(null);
                    setMusicMode(null);
                  }
                }} 
                className="w-full py-6 rounded-full bg-accent text-white font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all"
              >
                {labels.start}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default HealthPlan;
