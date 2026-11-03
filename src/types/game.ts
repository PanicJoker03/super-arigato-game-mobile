export type GameMode = 'rush' | 'lab' | 'endless' | 'gallery';

export interface MugDesign {
  id: string;
  name: string;
  category: 'classic' | 'special' | 'spooky' | 'sports';
  description: string;
  stickerUrl?: string;
  colorScheme: {
    bg: string;
    text: string;
    accent: string;
  };
  price: number;
  unlocked: boolean;
  idealTemp: number; // e.g. 333°C
  badgeType: 'arigato' | 'lamp' | 'vampire' | 'soccer' | 'starry' | 'gracias' | 'pinkcat' | 'bluecat';
}

export interface Customer {
  id: string;
  name: string;
  avatarBg: string;
  avatarCat: 'golden' | 'pink' | 'blue' | 'vampire' | 'soccer' | 'grandma';
  dialogue: string;
  patience: number; // max seconds
  currentPatience: number; // current seconds
  order: {
    mugType: 'white' | 'magic' | 'golden' | 'neon';
    designId: string;
    tapeColor?: string;
  };
  reward: number;
  tip: number;
}

export interface WorkshopUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  icon: string;
  bonusText: string;
}

export interface PlayerStats {
  coins: number;
  reputation: number; // 0 to 100
  totalMugsMade: number;
  perfectMugs: number;
  burnedMugs: number;
  day: number;
  highScoreEndless: number;
}

export interface CustomMugProject {
  id: string;
  mugColor: string;
  badge: string;
  customText: string;
  textColor: string;
  hasGlitter: boolean;
  createdAt: number;
}
