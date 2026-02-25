
import React, { useState, useEffect } from 'react';
import { 
  Heart, Activity, BarChart3, ChevronRight, Sparkles, Footprints, 
  PenTool, Save, CheckCircle2, TrendingUp, FileText, UploadCloud, FileCheck,
  Compass, ClipboardList, Target, AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { TREND_DATA } from '../constants';
import { LangKey } from '../App';
import { TabType } from '../types';

interface JournalEntry {
  currentFeeling: string;
  deeperFeeling: string;
  beliefs: string;
  expectations: string;
  mismatch: string;
  changes: string;
}

interface Props {
  lang: LangKey;
  theme?: 'day' | 'night';
  qiYunResult?: any;
  initialTab?: 'emotion' | 'journey' | 'stats';
  onNavigate?: (tab: TabType, sub?: string) => void;
}

const HealthLogs: React.FC<Props> = ({ lang, theme = 'night', qiYunResult, initialTab, onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'emotion' | 'journey' | 'stats'>(initialTab || 'stats');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [entry, setEntry] = useState<JournalEntry>({
    currentFeeling: '', deeperFeeling: '', beliefs: '', expectations: '', mismatch: '', changes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasDataDays, setHasDataDays] = useState<number[]>([]);
  
  // New state for physical exam data
  const [examImported, setExamImported] = useState(false);
  const [isImportingExam, setIsImportingExam] = useState(false);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const ICON_GOLD = "var(--accent)";

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const saved = localStorage.getItem(`guan_qi_journal_day_${selectedDay}`);
    if (saved) {
      setEntry(JSON.parse(saved));
    } else {
      setEntry({ currentFeeling: '', deeperFeeling: '', beliefs: '', expectations: '', mismatch: '', changes: '' });
    }
    
    const recorded = days.filter(d => localStorage.getItem(`guan_qi_journal_day_${d}`));
    setHasDataDays(recorded);
    
    // Check if exam data was previously imported (mock persistence)
    if (localStorage.getItem('guan_qi_exam_imported') === 'true') {
        setExamImported(true);
    }
  }, [selectedDay]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`guan_qi_journal_day_${selectedDay}`, JSON.stringify(entry));
    setTimeout(() => {
      setIsSaving(false);
      setHasDataDays(prev => Array.from(new Set([...prev, selectedDay])));
    }, 1200);
  };

  const handleImportExam = () => {
    setIsImportingExam(true);
    setTimeout(() => {
        setIsImportingExam(false);
        setExamImported(true);
        localStorage.setItem('guan_qi_exam_imported', 'true');
        // Trigger points update for "data completion"
        const current = parseInt(localStorage.getItem('guan_qi_points') || '2480');
        localStorage.setItem('guan_qi_points', (current + 100).toString());
        window.dispatchEvent(new Event('points-updated'));
        alert(lang === 'zh' ? '体检数据已成功接入' : 'Exam data imported successfully');
    }, 2000);
  };

  const footprints = [
    { time: '08:30', action: '完成 晨启仪式', icon: Sparkles },
    { time: '10:15', action: '练习 八段锦', icon: Activity },
    { time: '12:00', action: '完成 午养仪式', icon: Heart },
    { time: '15:45', action: '静心冥想 10min', icon: Activity },
  ];

  const renderStats = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
       
       {/* Data Trinity Module */}
       <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
             <ClipboardList size={16} className="text-[var(--accent)]" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">健康数据矩阵</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Constitution Report */}
            <div 
                onClick={() => onNavigate?.('constitution', qiYunResult ? 'report' : 'test')}
                className="glass-card p-6 flex flex-col justify-between h-40 border-[var(--border-color)] cursor-pointer hover:bg-[var(--accent)]/5 transition-all group"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 squircle-icon bg-[var(--accent)]/10 text-[var(--accent)]">
                        <Compass size={20} />
                    </div>
                    {qiYunResult ? <CheckCircle2 size={16} className="text-[var(--accent)]" /> : null}
                </div>
                <div>
                    <h4 className="text-sm font-bold">先天禀赋</h4>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">
                        {qiYunResult ? qiYunResult.type : '待测评'}
                    </p>
                </div>
            </div>

            {/* 2. Physical Exam */}
            <div className="glass-card p-6 flex flex-col justify-between h-40 border-[var(--border-color)] relative overflow-hidden">
                 <div className="flex justify-between items-start z-10">
                    <div className={`w-10 h-10 squircle-icon transition-colors ${examImported ? 'bg-green-500/10 text-green-500' : 'bg-white/5 opacity-40'}`}>
                        <FileText size={20} />
                    </div>
                    {examImported ? <span className="text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 px-2 py-1 rounded">Synced</span> : null}
                 </div>
                 <div className="z-10">
                    <h4 className="text-sm font-bold">体检档案</h4>
                    {examImported ? (
                         <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-[8px] font-bold opacity-60 bg-white/5 px-2 py-1 rounded">BMI 21.5</span>
                            <span className="text-[8px] font-bold opacity-60 bg-white/5 px-2 py-1 rounded">BP 115/75</span>
                         </div>
                    ) : (
                        <button 
                             onClick={(e) => { e.stopPropagation(); handleImportExam(); }}
                             disabled={isImportingExam}
                             className="mt-2 flex items-center gap-2 text-[9px] font-bold text-[var(--accent)] hover:opacity-80 transition-opacity"
                        >
                            {isImportingExam ? '同步中...' : '接入数据'} <UploadCloud size={12} />
                        </button>
                    )}
                 </div>
            </div>

            {/* 3. Survey/Symptom Status */}
            <div className="glass-card p-6 flex flex-col justify-between h-40 border-[var(--border-color)]">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 squircle-icon bg-orange-500/10 text-orange-500">
                        <Activity size={20} />
                    </div>
                    <span className="text-[10px] font-bold opacity-40">上次更新: 3天前</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold">症状自评</h4>
                    <div className="flex gap-2 mt-2">
                       {qiYunResult?.currentStatus?.risks.slice(0, 2).map((r: string, i: number) => (
                           <span key={i} className="text-[8px] font-bold bg-orange-500/10 text-orange-500 px-2 py-1 rounded flex items-center gap-1">
                               <AlertTriangle size={8} /> {r}
                           </span>
                       )) || <span className="text-[9px] opacity-40">暂无风险</span>}
                    </div>
                </div>
            </div>
          </div>
       </section>

       {/* Adjustment Goals */}
       {qiYunResult && (
           <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                 <Target size={16} className="text-[var(--accent)]" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">体质调整目标</h3>
              </div>
              <div className="glass-card p-6 border-[var(--border-color)] space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent)] text-[var(--color-bg)]">
                          {qiYunResult.constitution} · {qiYunResult.type}
                      </span>
                      <span className="text-[10px] opacity-50">基于综合数据生成</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                      {qiYunResult.advice?.goals?.map((goal: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                              <div className="w-6 h-6 rounded-full border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] text-[10px] font-black">
                                  {idx + 1}
                              </div>
                              <span className="text-sm opacity-80">{goal}</span>
                          </div>
                      )) || <p className="text-xs opacity-40 italic">完成体质测评以获取定制目标...</p>}
                  </div>
              </div>
           </section>
       )}
    </div>
  );

  const renderEmotion = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* 微缩智能日历选择器 */}
      <section className="glass-card p-8 border-[var(--border-color)] shadow-xl space-y-8 bg-[var(--accent)]/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="h-14 border-l-4 border-[var(--accent)] pl-6 flex flex-col justify-center">
               <h1 className="text-5xl font-light tabular-nums tracking-tighter leading-none">
                 {selectedDay < 10 ? `0${selectedDay}` : selectedDay}
               </h1>
               <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mt-2">Selected Node</span>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 h-14 bg-[var(--text-main)] text-[var(--color-bg)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
          >
            {isSaving ? <Activity size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? 'Synchronizing' : 'Seal Entry'}</span>
          </button>
        </div>

        {/* 10x3 网格 - 空间优化 */}
        <div className="grid grid-cols-10 gap-2.5">
          {days.map(d => {
            const isSelected = selectedDay === d;
            const hasData = hasDataDays.includes(d);
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`group relative aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-500 border ${
                  isSelected 
                  ? 'bg-[var(--text-main)] text-[var(--color-bg)] border-transparent scale-110 z-10 shadow-xl' 
                  : 'bg-white/5 border-[var(--border-color)] opacity-40 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                {d}
                {hasData && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 觉察日记区域 */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3 opacity-30">
              <PenTool size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">ShineNotes Flow</span>
           </div>
           <span className="text-[9px] font-bold opacity-15 uppercase tracking-widest italic">Surface to Essence</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'currentFeeling', label: '当下感受', en: 'Present Emotion', val: entry.currentFeeling },
                { id: 'deeperFeeling', label: '深层观察', en: 'Inner Reflection', val: entry.deeperFeeling },
                { id: 'beliefs', label: '核心观念', en: 'Root Beliefs', val: entry.beliefs },
                { id: 'expectations', label: '我的期待', en: 'Expectations', val: entry.expectations }
              ].map(field => (
                <div key={field.id} className="glass-card p-8 flex flex-col bg-[var(--card-inner)] border-[var(--border-color)] shadow-inner group hover:border-[var(--accent)]/30 transition-all min-h-[180px]">
                   <div className="flex justify-between items-start mb-5">
                     <div className="space-y-1">
                       <h5 className="text-xs font-bold uppercase tracking-widest">{field.label}</h5>
                       <p className="text-[8px] opacity-30 uppercase tracking-[0.2em]">{field.en}</p>
                     </div>
                     {field.val.length > 0 && <CheckCircle2 size={12} className="text-[var(--accent)] opacity-50" />}
                   </div>
                   <textarea 
                     className="w-full flex-1 bg-transparent outline-none text-sm font-light resize-none placeholder-[var(--text-main)]/10 leading-relaxed" 
                     placeholder="Tap to record..."
                     value={field.val}
                     onChange={e => setEntry({...entry, [field.id]: e.target.value})}
                   />
                </div>
              ))}
           </div>

           <div className="glass-card p-10 bg-[var(--card-inner)] border-[var(--border-color)] shadow-inner space-y-6">
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-widest">气机不对等处</h5>
                <p className="text-[8px] opacity-30 uppercase tracking-widest">Reality Mismatch Analysis</p>
              </div>
              <textarea 
               className="w-full min-h-[100px] bg-transparent outline-none text-sm font-light resize-none placeholder-[var(--text-main)]/10 leading-relaxed" 
               placeholder="Where does the tension lie?"
               value={entry.mismatch}
               onChange={e => setEntry({...entry, mismatch: e.target.value})}
              />
           </div>

           <div className="glass-card p-10 bg-[var(--accent)]/5 border-[var(--accent)]/20 shadow-xl space-y-6">
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">转念与化解</h5>
                <p className="text-[8px] opacity-30 uppercase tracking-widest">Cognitive Transformation</p>
              </div>
              <textarea 
               className="w-full min-h-[100px] bg-transparent outline-none text-sm font-medium resize-none placeholder-[var(--accent)]/20 leading-relaxed" 
               placeholder="How to harmonize this Qi?"
               value={entry.changes}
               onChange={e => setEntry({...entry, changes: e.target.value})}
              />
           </div>
        </div>
      </div>
    </div>
  );

  const renderJourney = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 relative pb-20">
      <div className="absolute left-10 top-0 bottom-0 w-px bg-[var(--text-main)] opacity-5"></div>
      {footprints.map((f, i) => (
        <div key={i} className="flex gap-8 relative z-10 group">
          <div className="w-20 h-20 squircle-icon bg-[var(--accent)]/5 border-[var(--border-color)] shadow-lg group-hover:scale-110 transition-transform text-[var(--accent)]">
            <f.icon size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1 glass-card p-8 border-[var(--border-color)] flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer shadow-soft">
            <div className="space-y-1">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">{f.time}</p>
              <h4 className="text-lg font-bold tracking-tight">{f.action}</h4>
            </div>
            <div className="text-right">
              <CheckCircle2 size={24} className="text-[#34C759] opacity-80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 space-y-12 pt-24 pb-32">
      <header className="flex flex-col gap-8 px-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
             <h2 className="text-5xl font-light tracking-tighter reveal-gradient-text">纪事档案</h2>
             <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em]">System Manifestation Journal</p>
          </div>
          <button 
            onClick={() => onNavigate?.('home')}
            className="w-12 h-12 glass-card !rounded-2xl flex items-center justify-center border-[var(--border-color)] active:scale-90 transition-all"
          >
            <Compass size={24} className="text-[var(--accent)]" />
          </button>
        </div>
        <div className="flex gap-2 p-1.5 glass-card !rounded-full border-[var(--border-color)] bg-[var(--accent)]/5 shadow-soft">
           {(['emotion', 'journey', 'stats'] as const).map(tab => (
             <button 
              key={tab} 
              onClick={() => setActiveSubTab(tab)} 
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full transition-all text-[11px] font-black uppercase tracking-widest ${activeSubTab === tab ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-xl scale-[1.03]' : 'opacity-40 hover:opacity-100'}`}
             >
               {tab === 'emotion' ? <PenTool size={16}/> : tab === 'journey' ? <Footprints size={16}/> : <BarChart3 size={16}/>}
               <span>{tab === 'emotion' ? '觉察' : tab === 'journey' ? '足迹' : '数据'}</span>
             </button>
           ))}
        </div>
      </header>

      <div className="min-h-[600px] px-2">
        {activeSubTab === 'stats' && renderStats()}
        {activeSubTab === 'emotion' && renderEmotion()}
        {activeSubTab === 'journey' && renderJourney()}
      </div>
    </div>
  );
};

export default HealthLogs;
