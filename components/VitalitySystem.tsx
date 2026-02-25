import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, History, ShoppingBag, CheckCircle2, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { LangKey } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  lang: LangKey;
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  source: string;
  amount: number;
  date: string;
}

const VitalitySystem: React.FC<Props> = ({ isOpen, onClose, points, lang }) => {
  const [activeTab, setActiveTab] = useState<'redeem' | 'history' | 'rules'>('redeem');

  // Mock transactions
  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'earn', source: '每日打卡', amount: 10, date: '2023-10-25 08:30' },
    { id: '2', type: 'earn', source: '完成任务', amount: 30, date: '2023-10-24 14:15' },
    { id: '3', type: 'spend', source: '兑换养生茶包', amount: 1200, date: '2023-10-20 10:00' },
    { id: '4', type: 'earn', source: '参与挑战', amount: 100, date: '2023-10-18 09:00' },
    { id: '5', type: 'earn', source: '社区贡献', amount: 5, date: '2023-10-15 16:20' },
  ]);

  if (!isOpen) return null;

  const labels = {
    zh: {
      title: '元气系统',
      currentPoints: '当前可用积分',
      redeem: '积分兑换',
      history: '积分记录',
      rules: '积分规则',
      earnRecord: '获取记录',
      spendRecord: '消耗记录',
      physical: '实物兑换',
      service: '服务兑换',
      redeemBtn: '立即兑换',
      insufficient: '积分不足',
      success: '兑换成功'
    },
    en: {
      title: 'Vitality System',
      currentPoints: 'Available Points',
      redeem: 'Redeem',
      history: 'History',
      rules: 'Rules',
      earnRecord: 'Earned',
      spendRecord: 'Spent',
      physical: 'Physical Items',
      service: 'Services',
      redeemBtn: 'Redeem Now',
      insufficient: 'Insufficient Points',
      success: 'Success'
    }
  }[lang];

  const handleRedeem = (cost: number, itemName: string) => {
    if (points < cost) {
      alert(labels.insufficient);
      return;
    }
    // In a real app, we would update the points here and add a transaction
    alert(`${labels.success}: ${itemName}`);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col animate-in slide-in-from-bottom-full duration-500">
      <header className="flex items-center justify-between p-6 shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--glass-fill)] border border-[var(--border-color)]">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-widest uppercase">{labels.title}</h2>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 space-y-8">
        
        {/* Points Display */}
        <div className="glass-card p-8 border-[var(--border-color)] shadow-xl bg-[var(--accent)]/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
          <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.4em] mb-2">{labels.currentPoints}</p>
          <div className="text-6xl font-light tracking-tighter text-[var(--accent)] tabular-nums">
            {points}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 glass-card !rounded-full border-[var(--border-color)] bg-[var(--glass-fill)] shadow-soft">
          {[
            { id: 'redeem', icon: Gift, label: labels.redeem },
            { id: 'history', icon: History, label: labels.history },
            { id: 'rules', icon: Info, label: labels.rules }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-[var(--text-main)] text-[var(--color-bg)] shadow-md' : 'opacity-50 hover:opacity-100'}`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
          
          {/* Redeem Tab */}
          {activeTab === 'redeem' && (
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black opacity-50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <ShoppingBag size={14} /> {labels.physical}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 1, name: '定制养生茶包', cost: 1200, desc: '根据体质定制的专属养生茶包' },
                    { id: 2, name: '艾灸贴套装', cost: 800, desc: '便携式无烟艾灸贴' },
                  ].map(item => (
                    <div key={item.id} className="glass-card p-5 border-[var(--border-color)] flex flex-col justify-between h-48">
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold">{item.name}</h4>
                        <span className="inline-block text-[10px] font-black text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
                          {item.cost} PTS
                        </span>
                        <p className="text-[9px] opacity-60 leading-relaxed line-clamp-2">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleRedeem(item.cost, item.name)}
                        className="mt-4 w-full py-2.5 rounded-xl border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-[var(--color-bg)] transition-colors"
                      >
                        {labels.redeemBtn}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black opacity-50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> {labels.service}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 3, name: '名医在线问诊券', cost: 500, desc: '兑换一次三甲医院中医专家在线问诊服务' },
                    { id: 4, name: '线下推拿体验', cost: 2000, desc: '合作机构单次中医推拿理疗体验券' },
                  ].map(item => (
                    <div key={item.id} className="glass-card p-5 border-[var(--border-color)] flex items-center justify-between">
                      <div className="space-y-1 pr-4">
                        <h4 className="text-sm font-bold">{item.name}</h4>
                        <p className="text-[9px] opacity-60 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[10px] font-black text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
                          {item.cost} PTS
                        </span>
                        <button 
                          onClick={() => handleRedeem(item.cost, item.name)}
                          className="px-4 py-2 rounded-xl bg-[var(--text-main)] text-[var(--color-bg)] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                        >
                          {labels.redeemBtn}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="glass-card border-[var(--border-color)] overflow-hidden">
                {transactions.map((tx, idx) => (
                  <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}>
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{tx.source}</p>
                      <p className="text-[9px] opacity-40 tabular-nums">{tx.date}</p>
                    </div>
                    <div className={`text-sm font-black tabular-nums ${tx.type === 'earn' ? 'text-[#34C759]' : 'text-rose-500'}`}>
                      {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="glass-card p-6 border-[var(--border-color)] space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black opacity-50 uppercase tracking-[0.2em] flex items-center gap-2">
                  <CheckCircle2 size={14} /> 获取规则
                </h3>
                <ul className="space-y-3">
                  {[
                    { label: '每日打卡', pts: '+10分' },
                    { label: '完成任务', pts: '+20-50分' },
                    { label: '参与挑战', pts: '+100分' },
                    { label: '社区贡献', pts: '+5分' },
                  ].map((rule, i) => (
                    <li key={i} className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2 last:border-0 last:pb-0">
                      <span className="opacity-80">{rule.label}</span>
                      <span className="font-black text-[var(--accent)]">{rule.pts}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <h3 className="text-xs font-black opacity-50 uppercase tracking-[0.2em]">使用说明</h3>
                <p className="text-[10px] opacity-60 leading-relaxed">
                  积分可用于兑换商城内的实物商品或服务体验。积分每年年底清零，请及时使用。最终解释权归平台所有。
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VitalitySystem;
