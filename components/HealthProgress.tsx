import React from 'react';
import { ShieldAlert, ArrowLeft, Activity, Heart, AlertTriangle, Stethoscope, Briefcase, Zap, Flame, Compass, ClipboardList, ArrowRight } from 'lucide-react';
import { TabType } from '../types';

interface Props {
  result: any;
  onBack: () => void;
  onNavigate?: (tab: TabType, sub?: string) => void;
}

const HealthProgress: React.FC<Props> = ({ result, onBack, onNavigate }) => {
  if (!result) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 gap-12 animate-zen">
        <div className="w-32 h-32 glass-panel rounded-full flex items-center justify-center">
           <ClipboardList size={48} className="text-accent opacity-40" />
        </div>
        <div className="text-center space-y-4 max-w-xs">
          <h2 className="text-3xl font-normal tracking-tight">暂无健康进度</h2>
          <p className="text-sm opacity-40 leading-relaxed font-light">完成体质辨识后，您可以在此查看各项健康指标的动态反馈。</p>
        </div>
        <button 
          onClick={() => onNavigate?.('constitution', 'test')}
          className="px-10 py-5 bg-black text-white rounded-full font-bold uppercase tracking-[0.4em] text-[11px] shadow-2xl active:scale-95 transition-all flex items-center gap-3"
        >
          前往测评 <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const currentStatus = result?.currentStatus || {
    score: 85,
    risks: ['先天肝气偏旺', '后天劳损风险'],
    summary: '平和稳态'
  };

  const healthData = result?.healthData || {};

  const getProblemIcon = (category: string) => {
    switch (category) {
      case 'neck': return <Activity className="text-blue-500" />;
      case 'digest': return <Stethoscope className="text-orange-500" />;
      case 'fatigue': return <Zap className="text-yellow-500" />;
      case 'back': return <Briefcase className="text-slate-500" />;
      default: return <Heart className="text-red-500" />;
    }
  };

  const problems = [
    { label: '颈部状况', data: healthData.neck, category: 'neck' },
    { label: '消化系统', data: healthData.digest, category: 'digest' },
    { label: '精力状态', data: healthData.fatigue, category: 'fatigue' },
    { label: '腰背压力', data: healthData.back, category: 'back' },
  ].filter(p => p.data && p.data.length > 0 && !p.data.includes('无明显不适') && !p.data.includes('精神状态良好') && !p.data.includes('消化系统正常'));

  return (
    <div className="min-h-screen p-6 pt-24 pb-32 space-y-8 animate-zen">
      <div className="flex items-center gap-5 glass-panel p-7 rounded-[3rem] shadow-xl">
        <button onClick={onBack} className="p-3 bg-black/5 rounded-2xl text-accent active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-serif font-black tracking-tight">健康风险 · 进度</h1>
          <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">Health Risks & Current Progress</p>
        </div>
        <div className="flex flex-col items-center gap-1">
           <div className={`text-xl font-serif font-black ${currentStatus.score > 80 ? 'text-green-600' : 'text-accent'}`}>
              {currentStatus.score}
           </div>
           <span className="text-[8px] font-black opacity-30 uppercase">SCORE</span>
        </div>
      </div>

      <div className="bg-[#1C1C1E] p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
               <Compass className="text-accent animate-[spin_10s_linear_infinite]" size={24} />
               <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">当前健康体征概要</span>
            </div>
            <h2 className="text-3xl font-serif font-black tracking-tight">{currentStatus.summary}</h2>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${currentStatus.score}%` }}></div>
            </div>
         </div>
         <ShieldAlert size={140} className="absolute -right-6 -bottom-6 text-white/5 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-1000" />
      </div>

      <div className="space-y-6">
        <h3 className="font-serif font-black text-lg px-2 flex items-center gap-3 opacity-60">
          <AlertTriangle size={20} className="text-accent" />
          体症映照记录
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {problems.length > 0 ? problems.map((prob, idx) => (
            <div key={idx} className="glass-panel p-7 rounded-[3rem] shadow-xl flex items-start gap-6">
               <div className="w-14 h-14 bg-black/5 rounded-3xl flex items-center justify-center shrink-0">
                  {getProblemIcon(prob.category)}
               </div>
               <div className="flex-1 space-y-3">
                  <h4 className="text-sm font-serif font-black">{prob.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {prob.data.map((item, i) => (
                      <span key={i} className="text-[10px] font-bold opacity-40 glass-panel px-3 py-1.5 rounded-xl">
                        {item}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          )) : (
            <div className="glass-panel p-12 rounded-[3.5rem] border-2 border-dashed border-accent/10 text-center space-y-4">
               <Heart size={40} className="mx-auto text-accent opacity-20" />
               <p className="text-sm font-serif font-black opacity-40">目前各项体征显示良好</p>
               <p className="text-[10px] opacity-20 uppercase tracking-widest leading-relaxed">请保持当前良好的生活方式<br/>持续关注经络运行</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-serif font-black text-lg px-2 flex items-center gap-3 opacity-60">
          <Flame size={20} className="text-accent" />
          先天风险预警
        </h3>
        <div className="glass-panel p-8 rounded-[3.5rem] shadow-xl space-y-6">
          {currentStatus.risks.map((risk: string, i: number) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="w-2 h-10 bg-accent/10 rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-1/2 bg-accent rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-serif font-black group-hover:text-accent transition-colors">{risk}</p>
                <p className="text-[10px] opacity-30 font-bold uppercase tracking-widest mt-0.5">Risk Level: Moderate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthProgress;