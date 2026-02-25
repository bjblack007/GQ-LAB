
import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, ArrowRight, Package, UserCheck, Heart, Zap, Calendar, MessageSquare, Video } from 'lucide-react';

interface Props { 
  onBack?: () => void; 
  initialMode?: 'shop' | 'inventory';
}

const VitalityMall: React.FC<Props> = ({ onBack, initialMode = 'shop' }) => {
  const [mode, setMode] = useState<'shop' | 'inventory'>(initialMode);
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', '膳食', '器物', '香氛', '中医服务'];

  const allProducts = [
    // 膳食 (Diet) - 5 items
    { 
      id: 'd1', category: '膳食', name: '陈皮普洱茶', price: 128, 
      image: 'https://images.unsplash.com/photo-1594631252845-29fc4586c562?auto=format&fit=crop&q=80&w=600', 
      sub: '十年陈韵，温润养胃' 
    },
    { 
      id: 'd2', category: '膳食', name: '茯苓山药糕', price: 68, 
      image: 'https://images.unsplash.com/photo-1614986381404-5d5523dc015b?auto=format&fit=crop&q=80&w=600', 
      sub: '健脾祛湿，无糖配方' 
    },
    { 
      id: 'd3', category: '膳食', name: '红豆薏米粉', price: 59, 
      image: 'https://images.unsplash.com/photo-1588609553591-62862d2d6c13?auto=format&fit=crop&q=80&w=600', 
      sub: '早晚冲饮，轻盈体态' 
    },
    { 
      id: 'd4', category: '膳食', name: '九蒸九晒芝麻丸', price: 89, 
      image: 'https://images.unsplash.com/photo-1599525281561-12c5b369c73e?auto=format&fit=crop&q=80&w=600', 
      sub: '乌发养颜，古法炮制' 
    },
    { 
      id: 'd5', category: '膳食', name: '人参滋补汤包', price: 158, 
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600', 
      sub: '补气固元，炖煮便捷' 
    },

    // 器物 (Instruments) - 5 items
    { 
      id: 'i1', category: '器物', name: '天然玉石刮痧板', price: 89, 
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600', 
      sub: '疏通经络，提拉紧致' 
    },
    { 
      id: 'i2', category: '器物', name: '绿檀经络梳', price: 128, 
      image: 'https://images.unsplash.com/photo-1590483050964-b5b6301323d4?auto=format&fit=crop&q=80&w=600', 
      sub: '头部按摩，天然芳香' 
    },
    { 
      id: 'i3', category: '器物', name: '纯铜艾灸盒', price: 198, 
      image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=600', 
      sub: '温阳散寒，随身养护' 
    },
    { 
      id: 'i4', category: '器物', name: '决明子护颈枕', price: 168, 
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80&w=600', 
      sub: '牵引修复，草本填充' 
    },
    { 
      id: 'i5', category: '器物', name: '棉麻太极练功服', price: 299, 
      image: 'https://images.unsplash.com/photo-1518331483807-f6adc0e1ad23?auto=format&fit=crop&q=80&w=600', 
      sub: '透气亲肤，动静皆宜' 
    },

    // 香氛 (Aroma) - 5 items
    { 
      id: 'a1', category: '香氛', name: '沉香线香', price: 228, 
      image: 'https://images.unsplash.com/photo-1603173772274-1237c050a41d?auto=format&fit=crop&q=80&w=600', 
      sub: '凝神静气，书房雅伴' 
    },
    { 
      id: 'a2', category: '香氛', name: '艾草除秽香包', price: 39, 
      image: 'https://images.unsplash.com/photo-1616606886498-8869c3639454?auto=format&fit=crop&q=80&w=600', 
      sub: '驱蚊避疫，端午传承' 
    },
    { 
      id: 'a3', category: '香氛', name: '澳洲檀香精油', price: 188, 
      image: 'https://images.unsplash.com/photo-1608528577891-9a054822560d?auto=format&fit=crop&q=80&w=600', 
      sub: '纯度极高，冥想扩香' 
    },
    { 
      id: 'a4', category: '香氛', name: '安神助眠喷雾', price: 88, 
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600', 
      sub: '薰衣草基调，整夜安睡' 
    },
    { 
      id: 'a5', category: '香氛', name: '古法醒脑香囊', price: 49, 
      image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=600', 
      sub: '薄荷冰片，提神醒脑' 
    },

    // 中医服务 (TCM Services) - 8 items
    { 
      id: 's1', category: '中医服务', name: '名医在线面诊', price: 300, 
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', 
      sub: '视频问诊，辩证开方', isService: true
    },
    { 
      id: 's2', category: '中医服务', name: '体质深度调理方案', price: 599, 
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600', 
      sub: '30天跟踪，饮食+功法定制', isService: true
    },
    { 
      id: 's3', category: '中医服务', name: '线下针灸预约', price: 200, 
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
      sub: '经络疏通，专业医师操作', isService: true
    },
    { 
      id: 's4', category: '中医服务', name: '推拿正骨预约', price: 268, 
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600', 
      sub: '缓解劳损，骨骼复位', isService: true
    },
    { 
      id: 's5', category: '中医服务', name: '三九贴敷预约', price: 158, 
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600', 
      sub: '冬病夏治，增强免疫', isService: true
    },
    // 企业服务模块
    { 
      id: 'c1', category: '中医服务', name: '季度中医专家巡诊', price: 9999, 
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600', 
      sub: '企业专属，专家上门问诊', isService: true
    },
    { 
      id: 'c2', category: '中医服务', name: '办公室理疗服务', price: 2999, 
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', 
      sub: '按摩、艾灸，缓解职业病', isService: true
    },
    { 
      id: 'c3', category: '中医服务', name: '养生工作坊', price: 1999, 
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600', 
      sub: '健康讲座与互动体验', isService: true
    },
  ];

  const inventory = [
    { id: 'i1', name: '定制理疗方案 (年卡)', status: '服务中', date: '2026-01-15 到期', icon: UserCheck },
    { id: 'i2', name: '古法艾灸盒', status: '待发货', date: '下单日期: 02-12', icon: Package },
  ];

  const ICON_GOLD = "#fdd95f";

  const filteredProducts = activeCategory === '全部' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pb-48 pt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="px-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-normal tracking-tighter">元气补给</h1>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em]">Redeem Vitality Rewards</p>
          </div>
          <button 
            onClick={() => setMode(mode === 'shop' ? 'inventory' : 'shop')} 
            className="w-12 h-12 glass-card !rounded-2xl flex items-center justify-center border-[var(--border-color)] active:scale-90 transition-all hover:bg-[var(--accent)]/5"
          >
            {mode === 'shop' ? <Package size={20} color={ICON_GOLD} className="opacity-80"/> : <ShoppingBag size={20} color={ICON_GOLD} className="opacity-80"/>}
          </button>
        </div>

        {mode === 'shop' && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={`flex-shrink-0 px-6 h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[var(--accent)] text-[var(--color-bg)] shadow-lg scale-105' : 'glass-card opacity-30 border-[var(--border-color)]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <section className="px-8 mt-8">
        {mode === 'shop' ? (
          <div className="grid grid-cols-2 gap-5">
            {filteredProducts.map(p => (
              <div key={p.id} className="glass-card p-5 space-y-5 border-[var(--border-color)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-all group shadow-soft cursor-pointer flex flex-col justify-between">
                <div className="space-y-5">
                    <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-black/40 relative">
                      <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90" />
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 glass-card !rounded-full flex items-center justify-center bg-black/20 border-white/10">
                            <Heart size={14} className="text-white/60" />
                        </div>
                      </div>
                      {(p as any).isService && (
                         <div className="absolute bottom-4 left-4 right-4 text-center">
                            <div className="glass-card !rounded-lg py-1 px-2 text-[8px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white border-white/10">
                               需要预约
                            </div>
                         </div>
                      )}
                    </div>
                    <div className="space-y-1 px-1">
                      <h4 className="text-sm font-bold tracking-tight line-clamp-1">{p.name}</h4>
                      <p className="text-[9px] opacity-40 uppercase tracking-widest leading-none line-clamp-1">{p.sub}</p>
                    </div>
                </div>
                
                <div className="flex justify-between items-center px-1 pt-2">
                  <div className="flex items-center gap-1">
                     <Zap size={10} color={ICON_GOLD} />
                     <span className="text-sm font-bold tabular-nums">¥{p.price}</span>
                  </div>
                  {(p as any).isService ? (
                      <button className="h-8 px-4 rounded-full bg-[var(--accent)] text-[var(--color-bg)] flex items-center justify-center shadow-xl active:scale-90 transition-all hover:scale-105 gap-1">
                        <Calendar size={12} />
                        <span className="text-[9px] font-black uppercase">预约</span>
                      </button>
                  ) : (
                      <button className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--color-bg)] flex items-center justify-center shadow-xl active:scale-90 transition-all hover:scale-110">
                        <Plus size={18}/>
                      </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
             {inventory.map(item => (
               <div key={item.id} className="glass-card p-8 flex items-center gap-8 border-[var(--border-color)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-all shadow-soft group cursor-pointer">
                  <div className="w-16 h-16 squircle-icon bg-[var(--accent)]/5 border-transparent text-[#fdd95f]">
                     <item.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex justify-between items-center">
                        <h4 className="text-base font-bold tracking-tight">{item.name}</h4>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#fdd95f] px-3 py-1.5 bg-[var(--accent)]/5 rounded-full border border-[var(--accent)]/5">{item.status}</span>
                     </div>
                     <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-medium">{item.date}</p>
                  </div>
               </div>
             ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VitalityMall;
