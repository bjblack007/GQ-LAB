
import React from 'react';
import { 
  ClipboardList, Footprints, ShoppingBag, Brain, Power, Sparkles, ChevronRight, Activity, Cpu
} from 'lucide-react';
import { TabType } from '../types';
import { LangKey } from '../App';

interface Props {
  onTabChange: (tab: TabType, sub?: string) => void;
  onBackToQi: () => void;
  lang: LangKey;
  points: number;
}

const SystemHub: React.FC<Props> = ({ onTabChange, onBackToQi, lang, points }) => {
  const modules = [
    { id: 'constitution', sub: 'test', title: 'Essence ID', cn: '先天禀赋', desc: 'Identify your TCM constitution', icon: ClipboardList },
    { id: 'plan', sub: 'meditation', title: 'Mind Flow', cn: '心斋坐忘', desc: 'Regulate spirit & energy', icon: Brain },
    { id: 'records', sub: 'journey', title: 'Life Logs', cn: '修行足迹', desc: 'Trace your health path', icon: Footprints },
    { id: 'mall', sub: null, title: 'Qi Exchange', cn: '元气商城', desc: 'Redeem vitality rewards', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen pt-24 pb-48 px-10">
      <header className="mb-16 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 opacity-30 mb-2">
             <Cpu size={12} />
             <p className="text-[9px] font-black uppercase tracking-[0.4em]">Core Interface</p>
          </div>
          <h1 className="text-5xl font-thin tracking-tighter text-main">OS Launcher</h1>
          <p className="text-[10px] font-bold text-sub uppercase tracking-[0.3em] mt-1">观气智能 · 总控中心</p>
        </div>
        <button 
          onClick={onBackToQi}
          className="w-14 h-14 glass-card !rounded-full flex flex-col items-center justify-center text-main opacity-40 hover:opacity-100 transition-all active:scale-90"
        >
          <Power size={18} strokeWidth={1.5} />
          <span className="text-[6px] font-black uppercase tracking-widest mt-1.5 opacity-50">Standby</span>
        </button>
      </header>

      {/* High Fidelity Grid */}
      <div className="grid grid-cols-1 gap-6">
        {modules.map((mod, idx) => (
          <button 
            key={idx}
            onClick={() => onTabChange(mod.id as TabType, mod.sub as any)}
            className="glass-card spatial-surface p-9 flex items-center gap-8 group text-left relative overflow-hidden shimmer-light border-white/5"
          >
            <div className="w-16 h-16 glass-card !rounded-3xl flex items-center justify-center text-main shadow-inner border-white/10 group-hover:scale-110 transition-transform">
              <mod.icon size={26} strokeWidth={1.5} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-baseline gap-3">
                <h4 className="text-2xl font-normal tracking-tight">{mod.title}</h4>
                <span className="text-[11px] font-bold opacity-30">{mod.cn}</span>
              </div>
              <p className="text-[10px] font-medium text-sub uppercase tracking-widest opacity-60">{mod.desc}</p>
            </div>
            <ChevronRight size={18} className="opacity-10 group-hover:opacity-60 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Premium Status Section */}
      <div className="mt-16 glass-card p-12 relative overflow-hidden text-center space-y-6 bg-white/[0.02]">
        <div className="w-12 h-12 glass-card rounded-full mx-auto flex items-center justify-center opacity-30">
           <Sparkles size={20} className="text-main" />
        </div>
        <div className="space-y-3">
          <p className="text-xl font-serif italic text-main opacity-80 leading-relaxed max-w-xs mx-auto">
            "静中求动，和而不同"
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-sub">Harmony in Stillness</p>
        </div>
        
        <div className="flex justify-center gap-3 pt-2">
           <div className="w-1.5 h-1.5 rounded-full bg-main opacity-40"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-main opacity-20"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-main opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

export default SystemHub;
