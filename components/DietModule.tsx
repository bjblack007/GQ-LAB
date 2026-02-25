import React, { useState, useEffect } from 'react';
import { X, Save, Utensils, Coffee, Apple, Activity, PenTool, CheckCircle2, PieChart, Flame, Droplets } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { LangKey } from '../App';

interface Props {
  onClose: () => void;
  lang: LangKey;
}

type MealType = 'breakfast' | 'lunch' | 'tea' | 'dinner' | 'snacks';
type TabType = 'record' | 'analysis';

const DietModule: React.FC<Props> = ({ onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isSaving, setIsSaving] = useState(false);
  const [hasDataDays, setHasDataDays] = useState<number[]>([]);
  const [mealData, setMealData] = useState<Record<MealType, string>>({
    breakfast: '',
    lunch: '',
    tea: '',
    dinner: '',
    snacks: ''
  });

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const saved = localStorage.getItem(`guan_qi_diet_day_${selectedDay}`);
    if (saved) {
      setMealData(JSON.parse(saved));
    } else {
      setMealData({ breakfast: '', lunch: '', tea: '', dinner: '', snacks: '' });
    }
    
    const recorded = days.filter(d => localStorage.getItem(`guan_qi_diet_day_${d}`));
    setHasDataDays(recorded);
  }, [selectedDay]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`guan_qi_diet_day_${selectedDay}`, JSON.stringify(mealData));
    setTimeout(() => {
      setIsSaving(false);
      setHasDataDays(prev => Array.from(new Set([...prev, selectedDay])));
    }, 1200);
  };

  const meals = [
    { id: 'breakfast', label: lang === 'zh' ? '早餐' : 'Breakfast', en: 'Morning Fuel', icon: Coffee },
    { id: 'lunch', label: lang === 'zh' ? '午餐' : 'Lunch', en: 'Midday Nourishment', icon: Utensils },
    { id: 'tea', label: lang === 'zh' ? '下午茶' : 'Afternoon Tea', en: 'Tea Break', icon: Apple },
    { id: 'dinner', label: lang === 'zh' ? '晚餐' : 'Dinner', en: 'Evening Meal', icon: Utensils },
    { id: 'snacks', label: lang === 'zh' ? '零食' : 'Snacks', en: 'Light Bites', icon: Apple },
  ];

  const tcmData = [
    { subject: lang === 'zh' ? '木 (肝)' : 'Wood', A: 80, fullMark: 100 },
    { subject: lang === 'zh' ? '火 (心)' : 'Fire', A: 65, fullMark: 100 },
    { subject: lang === 'zh' ? '土 (脾)' : 'Earth', A: 90, fullMark: 100 },
    { subject: lang === 'zh' ? '金 (肺)' : 'Metal', A: 70, fullMark: 100 },
    { subject: lang === 'zh' ? '水 (肾)' : 'Water', A: 85, fullMark: 100 },
  ];

  const renderRecord = () => (
    <div className="flex-1 px-6 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* 微缩智能日历选择器 */}
      <section className="glass-card p-8 shadow-xl space-y-8 bg-emerald-500/5 border-none">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="h-14 border-l-4 border-emerald-400 pl-6 flex flex-col justify-center">
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
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 饮食记录区域 */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3 opacity-30">
              <PenTool size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Dietary Flow</span>
           </div>
           <span className="text-[9px] font-bold opacity-15 uppercase tracking-widest italic">Nourish the Body</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meals.map(meal => (
            <div key={meal.id} className="glass-card p-8 flex flex-col bg-[var(--card-inner)] shadow-inner group transition-all min-h-[180px] border-none">
               <div className="flex justify-between items-start mb-5">
                 <div className="space-y-1">
                   <h5 className="text-xs font-bold uppercase tracking-widest">{meal.label}</h5>
                   <p className="text-[8px] opacity-30 uppercase tracking-[0.2em]">{meal.en}</p>
                 </div>
                 {mealData[meal.id as MealType].length > 0 && <CheckCircle2 size={12} className="text-emerald-400 opacity-50" />}
               </div>
               <textarea 
                 className="w-full flex-1 bg-transparent outline-none text-sm font-light resize-none placeholder-[var(--text-main)]/10 leading-relaxed" 
                 placeholder="Tap to record..."
                 value={mealData[meal.id as MealType]}
                 onChange={e => setMealData({...mealData, [meal.id as MealType]: e.target.value})}
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="flex-1 px-6 py-6 space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
      <div className="glass-card p-8 shadow-xl space-y-8 border-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{lang === 'zh' ? '五行能量摄入分析' : 'Five Elements Energy Intake'}</h3>
              <p className="text-xs opacity-50">{lang === 'zh' ? '基于您的饮食记录' : 'Based on your diet records'}</p>
            </div>
          </div>
        </div>

        {/* Goal Tracking Section */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{lang === 'zh' ? '目标达成进度' : 'Goal Completion'}</span>
              <span className="text-[10px] font-black text-emerald-400">82%</span>
           </div>
           <div className="grid grid-cols-1 gap-3">
              {[
                { label: lang === 'zh' ? '五行能量补充' : 'Five Elements Supplement', val: 75, color: 'bg-emerald-400' },
                { label: lang === 'zh' ? '阴阳平衡度' : 'Yin-Yang Balance', val: 90, color: 'bg-blue-400' },
                { label: lang === 'zh' ? '热量摄入控制' : 'Calorie Control', val: 82, color: 'bg-orange-400' }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold opacity-70">{item.label}</span>
                      <span className="text-[10px] font-mono opacity-40">{item.val}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tcmData}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 12, opacity: 0.7 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Intake" dataKey="A" stroke="#34d399" fill="#34d399" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-[var(--card-inner)] p-4 rounded-2xl border-none space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <Flame size={16} />
              <span className="text-sm font-bold">{lang === 'zh' ? '阳性能量' : 'Yang Energy'}</span>
            </div>
            <div className="text-2xl font-light">45%</div>
            <p className="text-[10px] opacity-50">{lang === 'zh' ? '温热性食物摄入' : 'Warm/Hot foods intake'}</p>
          </div>
          <div className="bg-[var(--card-inner)] p-4 rounded-2xl border-none space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Droplets size={16} />
              <span className="text-sm font-bold">{lang === 'zh' ? '阴性能量' : 'Yin Energy'}</span>
            </div>
            <div className="text-2xl font-light">55%</div>
            <p className="text-[10px] opacity-50">{lang === 'zh' ? '寒凉性食物摄入' : 'Cold/Cool foods intake'}</p>
          </div>
        </div>

        <div className="bg-emerald-500/10 p-6 rounded-2xl border-none space-y-3 mt-6">
          <h4 className="text-sm font-bold text-emerald-400">{lang === 'zh' ? '中医食疗建议' : 'TCM Dietary Advice'}</h4>
          <p className="text-sm opacity-80 leading-relaxed">
            {lang === 'zh'
              ? '您的饮食中土（脾胃）的能量较为充足，但火（心）的能量偏低。建议适当增加红色食物的摄入，如红豆、番茄、红枣等，以养心安神。同时，阴阳能量基本平衡，请继续保持。'
              : 'The Earth (Spleen/Stomach) energy in your diet is sufficient, but Fire (Heart) energy is slightly low. Consider adding more red foods like red beans, tomatoes, and jujubes to nourish the heart. Yin and Yang energies are well-balanced.'}
          </p>
        </div>
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
          <h2 className="text-lg font-bold tracking-widest uppercase">{lang === 'zh' ? '饮食中心' : 'Diet Center'}</h2>
          <div className="w-10 h-10" />
        </div>
        
        <div className="flex bg-[var(--glass-fill)] rounded-full p-1 border-none overflow-x-auto no-scrollbar mx-auto w-full max-w-[200px]">
          {['record', 'analysis'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-md' : 'opacity-50 hover:opacity-100'}`}
            >
              {lang === 'zh' ? { record: '记录', analysis: '分析' }[tab] : { record: 'Record', analysis: 'Analysis' }[tab]}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'record' && renderRecord()}
      {activeTab === 'analysis' && renderAnalysis()}
    </div>
  );
};

export default DietModule;
