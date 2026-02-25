import React, { useState, useEffect } from 'react';
import { X, Save, Activity, Target, Dumbbell, Wind, Heart, ChevronRight, ArrowLeft, PenTool, CheckCircle2 } from 'lucide-react';
import { LangKey } from '../App';

interface Props {
  onClose: () => void;
  lang: LangKey;
}

type ExerciseType = 'aerobic' | 'strength' | 'kungfu' | 'stretching';
type TabType = 'record' | 'settings';

const ExerciseModule: React.FC<Props> = ({ onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isSaving, setIsSaving] = useState(false);
  const [hasDataDays, setHasDataDays] = useState<number[]>([]);
  const [records, setRecords] = useState<Record<ExerciseType, string>>({
    aerobic: '',
    strength: '',
    kungfu: '',
    stretching: ''
  });

  const [targets, setTargets] = useState<Record<ExerciseType, number>>(() => {
    const saved = localStorage.getItem('guan_qi_exercise_targets');
    return saved ? JSON.parse(saved) : {
      aerobic: 30,
      strength: 20,
      kungfu: 15,
      stretching: 10
    };
  });

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const saved = localStorage.getItem(`guan_qi_exercise_day_${selectedDay}`);
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords({ aerobic: '', strength: '', kungfu: '', stretching: '' });
    }
    
    const recorded = days.filter(d => localStorage.getItem(`guan_qi_exercise_day_${d}`));
    setHasDataDays(recorded);
  }, [selectedDay]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`guan_qi_exercise_day_${selectedDay}`, JSON.stringify(records));
    setTimeout(() => {
      setIsSaving(false);
      setHasDataDays(prev => Array.from(new Set([...prev, selectedDay])));
    }, 1200);
  };

  const handleSaveTargets = () => {
    localStorage.setItem('guan_qi_exercise_targets', JSON.stringify(targets));
    alert(lang === 'zh' ? '设置已保存' : 'Settings saved');
  };

  const exercises = [
    { id: 'aerobic', label: lang === 'zh' ? '有氧运动' : 'Aerobic', en: 'Cardio Flow', icon: Heart },
    { id: 'strength', label: lang === 'zh' ? '力量训练' : 'Strength', en: 'Muscle Build', icon: Dumbbell },
    { id: 'kungfu', label: lang === 'zh' ? '功法练习' : 'Kung Fu', en: 'Qi Cultivation', icon: Wind },
    { id: 'stretching', label: lang === 'zh' ? '柔韧拉伸' : 'Stretching', en: 'Flexibility', icon: Activity },
  ];

  const totalTargetTime = Object.values(targets).reduce((acc: number, curr: number) => acc + curr, 0);

  const renderSettings = () => (
    <div className="flex-1 px-6 py-6 space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
      <div className="space-y-6">
        <div className="flex justify-between items-end px-2">
           <h3 className="text-xl font-bold">{lang === 'zh' ? '运动目标设置' : 'Exercise Goals'}</h3>
           <div className="text-right">
              <div className="text-2xl font-light text-rose-500">{totalTargetTime}<span className="text-xs ml-1">min</span></div>
              <div className="text-[8px] opacity-30 uppercase tracking-widest">{lang === 'zh' ? '每日总目标' : 'Daily Total'}</div>
           </div>
        </div>

        <div className="space-y-6">
          {exercises.map(ex => (
            <div key={ex.id} className="glass-card p-6 border-none bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ex.icon size={20} className="text-rose-400" />
                  <span className="font-bold">{ex.label}</span>
                </div>
                <span className="text-xs opacity-40 uppercase tracking-widest">{ex.en}</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="120" 
                  step="5"
                  value={targets[ex.id as ExerciseType]}
                  onChange={(e) => setTargets({...targets, [ex.id]: parseInt(e.target.value)})}
                  className="flex-1 accent-rose-500"
                />
                <span className="text-lg font-medium w-16 text-right">{targets[ex.id as ExerciseType]}m</span>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={handleSaveTargets}
          className="w-full py-4 bg-rose-500 text-white rounded-full font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          {lang === 'zh' ? '保存设置' : 'Save Settings'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-[var(--color-bg)] text-[var(--text-main)] flex flex-col animate-in slide-in-from-bottom-full duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="flex flex-col gap-4 p-4 shrink-0 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-md z-50 border-none">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--glass-fill)] border-none">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold tracking-widest uppercase">{lang === 'zh' ? '运动中心' : 'Exercise Center'}</h2>
          <div className="w-10 h-10" />
        </div>
        
        <div className="flex bg-[var(--glass-fill)] rounded-full p-1 border-none overflow-x-auto no-scrollbar mx-auto w-full max-w-[200px]">
          {['record', 'settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-md' : 'opacity-50 hover:opacity-100'}`}
            >
              {lang === 'zh' ? { record: '记录', settings: '设置' }[tab] : { record: 'Record', settings: 'Settings' }[tab]}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'record' ? (
        <div className="flex-1 px-6 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
          
          {/* 微缩智能日历选择器 */}
          <section className="glass-card p-8 shadow-xl space-y-8 bg-rose-500/5 border-none">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="h-14 border-l-4 border-rose-400 pl-6 flex flex-col justify-center">
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
                    className={`group relative aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-500 ${
                      isSelected 
                      ? 'bg-[var(--text-main)] text-[var(--color-bg)] scale-110 z-10 shadow-xl' 
                      : 'bg-white/5 opacity-40 hover:opacity-100 hover:bg-white/10'
                    }`}
                  >
                    {d}
                    {hasData && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 运动记录区域 */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3 opacity-30">
                  <PenTool size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">Movement Flow</span>
               </div>
               <span className="text-[9px] font-bold opacity-15 uppercase tracking-widest italic">Vitality & Strength</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map(exercise => (
                <div key={exercise.id} className="glass-card p-8 flex flex-col bg-[var(--card-inner)] shadow-inner group transition-all min-h-[180px] border-none">
                   <div className="flex justify-between items-start mb-5">
                     <div className="space-y-1">
                       <h5 className="text-xs font-bold uppercase tracking-widest">{exercise.label}</h5>
                       <p className="text-[8px] opacity-30 uppercase tracking-[0.2em]">{exercise.en}</p>
                     </div>
                     {records[exercise.id as ExerciseType].length > 0 && <CheckCircle2 size={12} className="text-rose-400 opacity-50" />}
                   </div>
                   <textarea 
                     className="w-full flex-1 bg-transparent outline-none text-sm font-light resize-none placeholder-[var(--text-main)]/10 leading-relaxed" 
                     placeholder="Tap to record..."
                     value={records[exercise.id as ExerciseType]}
                     onChange={e => setRecords({...records, [exercise.id as ExerciseType]: e.target.value})}
                   />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : renderSettings()}
    </div>
  );
};

export default ExerciseModule;
