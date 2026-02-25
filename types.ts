
export type TabType = 'home' | 'system' | 'constitution' | 'plan' | 'mall' | 'community' | 'records' | 'profile' | 'progress';

export interface Medal {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  desc: string;
}

export interface ReminderConfig {
  id: string;
  label: string;
  time: string; // "08:30" or "60" (interval)
  enabled: boolean;
  type: 'ritual' | 'break';
  lastChecked?: string; // ISO Date string for daily check-in tracking
}

export interface VitalityRecord {
  id: string;
  type: 'earn' | 'spend';
  title: string;
  amount: number;
  date: string;
  category: string;
  timestamp: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  desc: string;
  category: 'kungfu' | 'diet' | 'emotion' | 'routine';
  element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  content: string[];
  meridians?: string[];
  acupoints?: string[];
  scheduledTime?: string;
}

export interface ConstitutionResult {
  type: string;
  constitution: string;
  characteristics: string[];
  energy: FiveElementsEnergy;
  advice?: {
    core: string;
  };
  currentStatus?: {
    score: number;
    risks: string[];
    summary: string;
  };
}

export interface FiveElementsEnergy {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface CustomThemeConfig {
  bgColor: string;
  accentColor: string;
  textColor: string;
  glassColor: string;
  bgImage: string | null;
}
