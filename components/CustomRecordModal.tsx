import React, { useState } from 'react';
import { X, Save, Activity, Moon, Utensils, Smile, ArrowLeft } from 'lucide-react';
import { LangKey } from '../App';
import SleepModule from './SleepModule';
import DietModule from './DietModule';
import ExerciseModule from './ExerciseModule';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: LangKey;
  type: string;
}

const CustomRecordModal: React.FC<Props> = ({ isOpen, onClose, lang, type }) => {
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  if (type === 'sleep') {
    return <SleepModule onClose={onClose} lang={lang} />;
  }
  
  if (type === 'diet') {
    return <DietModule onClose={onClose} lang={lang} />;
  }
  
  if (type === 'exercise') {
    return <ExerciseModule onClose={onClose} lang={lang} />;
  }

  const config = {
    mood: { icon: Smile, color: 'text-amber-400', unit: '', label: lang === 'zh' ? '情绪状态' : 'Mood State' },
  }[type] || { icon: Activity, color: 'text-white', unit: '', label: 'Record' };

  const Icon = config.icon;

  const handleSave = () => {
    // In a real app, save the data
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-bg)] flex flex-col animate-in slide-in-from-bottom-full duration-500">
      <header className="flex items-center justify-between p-6 shrink-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--glass-fill)] border border-[var(--border-color)]">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-widest uppercase">{lang === 'zh' ? '自定义记录' : 'Custom Record'}</h2>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 px-6 py-8 space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-[var(--glass-fill)] border border-[var(--border-color)] ${config.color}`}>
            <Icon size={40} />
          </div>
          <h3 className="text-xl font-bold">{config.label}</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black opacity-50 uppercase tracking-widest">{lang === 'zh' ? '数值' : 'Value'}</label>
            <div className="relative">
              <input 
                type="text" 
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full bg-[var(--glass-fill)] border border-[var(--border-color)] rounded-2xl px-4 py-4 text-2xl font-bold outline-none focus:border-[var(--accent)] transition-colors text-center"
                placeholder="0"
              />
              {config.unit && <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 font-bold">{config.unit}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black opacity-50 uppercase tracking-widest">{lang === 'zh' ? '备注' : 'Note'}</label>
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-[var(--glass-fill)] border border-[var(--border-color)] rounded-2xl px-4 py-4 text-sm outline-none focus:border-[var(--accent)] transition-colors min-h-[120px] resize-none"
              placeholder={lang === 'zh' ? '添加一些备注信息...' : 'Add some notes...'}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 rounded-full bg-[var(--text-main)] text-[var(--color-bg)] font-black uppercase tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {lang === 'zh' ? '保存记录' : 'Save Record'}
        </button>
      </div>
    </div>
  );
};

export default CustomRecordModal;
