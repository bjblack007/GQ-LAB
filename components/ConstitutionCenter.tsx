
import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, Compass, ShieldAlert, Sparkles, ClipboardList, X, User, Calendar, Clock, ChevronRight, CheckSquare, Square, Circle, FileText, CheckCircle2, Utensils, Moon, Activity, Heart
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { FiveSixCalculator } from '../logic';
import { SURVEY_SECTIONS } from '../constants';
import { ThemeKey, LangKey } from '../App';

interface Props {
  onResultCalculated: (result: any) => void;
  currentResult: any;
  onNavigateHome: () => void;
  initialStep?: string;
  theme: ThemeKey;
  lang: LangKey;
}

const ConstitutionCenter: React.FC<Props> = ({ onResultCalculated, currentResult, onNavigateHome, initialStep, theme, lang }) => {
  const [step, setStep] = useState<string>((initialStep as string) || 'welcome');
  const [formData, setFormData] = useState({ birthday: '', hour: '00:00', gender: 'male', name: '' });
  
  // Survey States
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [examDataImported, setExamDataImported] = useState(false);
  
  const calculator = useMemo(() => new FiveSixCalculator(), []);

  const radarData = useMemo(() => {
    if (!currentResult?.energy) return [];
    return Object.entries(currentResult.energy).map(([key, val]) => ({
      subject: key === 'wood' ? '木' : key === 'fire' ? '火' : key === 'earth' ? '土' : key === 'metal' ? '金' : '水',
      value: val,
    }));
  }, [currentResult]);

  const labels = {
    zh: {
      title: '体质中心', welcome: '先天禀赋辨识', start: '开始测评', history: '历次档案', report: '元气报告', track: '改善追踪',
      basics: '基础信息', quiz: '体感自测', sync: '同步方案到首页',
      importData: '接入入职体检数据', importSuccess: '体检数据已接入'
    },
    en: {
      title: 'Constitution', welcome: 'Essence ID', start: 'Start Test', history: 'Archives', report: 'Report', track: 'Tracking',
      basics: 'Basics', quiz: 'Quiz', sync: 'Sync to Dashboard',
      importData: 'Import Medical Data', importSuccess: 'Data Imported'
    }
  }[lang];

  const handleFinishQuiz = () => {
    setStep('loading');
    setTimeout(() => {
      const birthDate = new Date(formData.birthday || new Date().toISOString());
      const result = calculator.calculateEnergy(birthDate, formData.hour, formData.gender, surveyAnswers);
      onResultCalculated(result);
      setStep('report');
    }, 2800);
  };

  const toggleMultiSelect = (qId: string, option: string) => {
    const current = surveyAnswers[qId] || [];
    if (current.includes(option)) {
      setSurveyAnswers({ ...surveyAnswers, [qId]: current.filter((i: string) => i !== option) });
    } else {
      setSurveyAnswers({ ...surveyAnswers, [qId]: [...current, option] });
    }
  };

  const setSingleSelect = (qId: string, option: string) => {
    setSurveyAnswers({ ...surveyAnswers, [qId]: option });
  };

  const handleInputChange = (qId: string, val: string) => {
    setSurveyAnswers({ ...surveyAnswers, [qId]: val });
  };

  const handleImportExamData = () => {
    setExamDataImported(true);
    setFormData({ ...formData, birthday: '1995-06-15', gender: 'male', name: 'User' });
    setTimeout(() => {
        alert("已成功从企业健康数据库同步您的体检信息。");
    }, 500);
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-full flex items-center justify-center p-6 animate-in fade-in zoom-in duration-1000">
        <div className="w-full max-w-sm glass-card p-10 flex flex-col items-center text-center gap-10 border-white/10 shadow-2xl">
          <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center shadow-inner relative animate-float bg-white/5">
            <ClipboardList size={36} className="text-accent opacity-80" />
            <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20"></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-light tracking-tighter reveal-gradient-text leading-tight">{labels.welcome}</h1>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] text-[var(--text-main)]">Ancient Wisdom · Modern Interface</p>
          </div>
          <div className="w-full space-y-4">
            <button onClick={() => setStep('form')} className="w-full bg-current text-[var(--color-bg)] py-5 rounded-full font-black tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-[11px] uppercase">{labels.start}</button>
            
            <button 
                onClick={handleImportExamData}
                disabled={examDataImported}
                className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all flex items-center justify-center gap-2 ${examDataImported ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20' : 'border-[var(--border-color)] text-[var(--text-main)] hover:bg-white/5'}`}
            >
                {examDataImported ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                {examDataImported ? labels.importSuccess : labels.importData}
            </button>
            
            <button onClick={() => setStep('history')} className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase hover:opacity-100 flex items-center justify-center gap-2 transition-opacity text-[var(--text-main)] pt-2"><History size={12} /> {labels.history}</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="p-4 pt-20 pb-32 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-8">
            <div className="text-center space-y-2">
               <h2 className="text-3xl font-light tracking-tight text-[var(--text-main)]">{labels.basics}</h2>
               <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.4em] text-[var(--text-main)]">Step 1 · Identification</p>
            </div>
            
            <div className="glass-card p-6 md:p-8 space-y-6 shadow-2xl border-white/5">
               <div className="space-y-2">
                  <label className="text-[9px] font-black opacity-60 px-1 flex items-center gap-2 uppercase tracking-widest text-[var(--text-main)]"><User size={10} /> Name</label>
                  <input type="text" placeholder="Entry name..." className="w-full glass-card px-5 py-4 text-sm outline-none rounded-2xl bg-white/5 border-white/5 placeholder-[var(--text-main)]/30 text-[var(--text-main)]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black opacity-60 px-1 flex items-center gap-2 uppercase tracking-widest text-[var(--text-main)]"><Calendar size={10} /> Birth Date</label>
                  <input type="date" className="w-full glass-card px-5 py-4 text-sm outline-none rounded-2xl bg-white/5 border-white/5 text-[var(--text-main)]" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black opacity-60 px-1 flex items-center gap-2 uppercase tracking-widest text-[var(--text-main)]"><Clock size={10} /> Polarity</label>
                  <div className="flex gap-3">
                    {['male', 'female'].map(g => (
                      <button key={g} onClick={() => setFormData({...formData, gender: g})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.gender === g ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-xl' : 'glass-card opacity-40 border-white/5 text-[var(--text-main)]'}`}>
                        {g === 'male' ? 'Yang (男)' : 'Yin (女)'}
                      </button>
                    ))}
                  </div>
               </div>
               <button onClick={() => setStep('quiz')} disabled={!formData.birthday} className="w-full bg-[var(--text-main)] text-[var(--color-bg)] py-5 rounded-full font-black uppercase tracking-[0.3em] shadow-xl disabled:opacity-30 active:scale-95 transition-all text-[11px] mt-4">Continue</button>
            </div>
        </div>
      </div>
    );
  }

  // ... (rest of the component remains similar but with ensure p-4/p-6 padding adjustments for mobile in quiz/report sections)

  if (step === 'quiz') {
    const section = SURVEY_SECTIONS[currentSectionIdx];
    const isLastSection = currentSectionIdx === SURVEY_SECTIONS.length - 1;

    return (
      <div className="p-4 pt-20 pb-32 flex flex-col items-center min-h-screen">
         <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex justify-between items-end px-2">
               <div className="space-y-1">
                 <h2 className="text-2xl font-light text-[var(--text-main)]">{section.title}</h2>
                 <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.4em] text-[var(--text-main)]">{section.desc}</p>
               </div>
               <span className="text-[10px] font-black opacity-40 pb-1 text-[var(--text-main)]">{currentSectionIdx + 1} / {SURVEY_SECTIONS.length}</span>
            </div>

            <div className="glass-card p-6 space-y-8 shadow-2xl border-white/5 flex flex-col">
               <div className="space-y-8">
                  {section.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                       <h3 className="text-sm font-bold text-[var(--text-main)] opacity-90">{q.text}</h3>
                       
                       {q.type === 'input' && (
                         <input 
                           type="text" 
                           className="w-full glass-card px-5 py-4 text-xs outline-none rounded-2xl bg-white/5 border-white/10 placeholder-[var(--text-main)]/30 text-[var(--text-main)]"
                           placeholder={q.placeholder}
                           value={surveyAnswers[q.id] || ''}
                           onChange={(e) => handleInputChange(q.id, e.target.value)}
                         />
                       )}

                       {(q.type === 'single' || q.type === 'multi') && (
                         <div className="grid grid-cols-1 gap-2">
                           {q.options?.map((opt) => {
                             const isSelected = q.type === 'multi' ? (surveyAnswers[q.id] || []).includes(opt) : surveyAnswers[q.id] === opt;
                             return (
                               <button
                                 key={opt}
                                 onClick={() => q.type === 'multi' ? toggleMultiSelect(q.id, opt) : setSingleSelect(q.id, opt)}
                                 className={`w-full px-5 py-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center gap-3 ${
                                   isSelected 
                                   ? 'bg-[var(--accent)] text-[var(--color-bg)] shadow-md' 
                                   : 'bg-white/5 text-[var(--text-main)] opacity-60 hover:opacity-100 hover:bg-white/10'
                                 }`}
                               >
                                 {isSelected ? (q.type === 'multi' ? <CheckSquare size={14} /> : <CheckCircle2 size={14} />) : (q.type === 'multi' ? <Square size={14} /> : <Circle size={14} />)}
                                 {opt}
                               </button>
                             );
                           })}
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               <div className="pt-4 flex gap-4">
                 {currentSectionIdx > 0 && (
                    <button 
                      onClick={() => setCurrentSectionIdx(prev => prev - 1)}
                      className="px-6 py-4 rounded-full border border-[var(--border-color)] text-[var(--text-main)] font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
                    >
                      Back
                    </button>
                 )}
                 <button 
                    onClick={() => {
                      if (isLastSection) {
                        handleFinishQuiz();
                      } else {
                        setCurrentSectionIdx(prev => prev + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 py-4 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-[10px]"
                 >
                    {isLastSection ? 'Complete' : 'Next'}
                 </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // ... (rest of the component, mainly reports, which adapt to container width automatically)
  if (step === 'loading') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 gap-12 duration-1000 animate-in fade-in">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 border-[1px] border-[var(--text-main)] opacity-10 rounded-full animate-[spin_8s_linear_infinite]"></div>
            <div className="absolute inset-4 border-[1px] border-[var(--text-main)] opacity-5 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
            <Sparkles size={40} className="text-accent opacity-40 animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <p className="text-2xl font-light tracking-tighter reveal-gradient-text text-[var(--text-main)]">Decoding Essence...</p>
          </div>
        </div>
      );
  }

  if (step === 'report' && currentResult) {
      return (
        <div className="p-4 pb-48 animate-in fade-in slide-in-from-bottom-10 pt-20 space-y-8 max-w-xl mx-auto">
           {/* Report Header */}
           <header className="flex justify-between items-center px-1 text-[var(--text-main)]">
             <button onClick={() => setStep('welcome')} className="w-10 h-10 glass-card !rounded-2xl flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"><X size={18}/></button>
             <h2 className="text-lg font-medium tracking-tight">{labels.report}</h2>
             <button onClick={() => setStep('history')} className="w-10 h-10 glass-card !rounded-2xl flex items-center justify-center opacity-20"><History size={18}/></button>
           </header>

           {/* Summary Card */}
           <div className="glass-card p-8 space-y-4 bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col items-center gap-4 text-center relative z-10 text-[var(--text-main)]">
                 <div className="w-14 h-14 glass-card bg-current/5 !rounded-2xl flex items-center justify-center opacity-80 shadow-2xl"><Compass size={28} className="opacity-80" /></div>
                 <div className="space-y-1">
                    <h3 className="text-3xl font-light tracking-tighter reveal-gradient-text leading-tight">{currentResult.type}</h3>
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.5em]">{currentResult.constitution}</p>
                 </div>
              </div>
              <div className="h-56 w-full mt-4 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                       <PolarGrid stroke="var(--text-main)" opacity={0.1} />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-main)', fontSize: 10, opacity: 0.5, fontWeight: 700 }} />
                       <Radar name="Energy" dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* ... Advice Sections ... */}
           <div className="grid grid-cols-1 gap-4 text-[var(--text-main)]">
             <div className="glass-card p-6 space-y-3 border-white/5 shadow-soft">
                <h4 className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em]">Core Principle · 平衡</h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed italic">“{currentResult.advice?.core}”</p>
             </div>
             {/* ... Risks ... */}
             <div className="glass-card p-6 space-y-4 border-white/5 shadow-soft">
                <h4 className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em]">Risks · 关注</h4>
                <div className="flex flex-wrap gap-2">
                   {currentResult.currentStatus?.risks.map((risk: string) => (
                     <span key={risk} className="px-3 py-1.5 bg-current/5 border border-current/5 text-current opacity-60 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={10} className="opacity-40" /> {risk}</span>
                   ))}
                </div>
             </div>
           </div>

           <button onClick={onNavigateHome} className="w-full py-5 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all mt-2">{labels.sync}</button>
        </div>
      );
  }

  return null;
};

export default ConstitutionCenter;
