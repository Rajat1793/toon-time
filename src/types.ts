export type ActiveView = 'timer' | 'stopwatch' | 'laps' | 'tictactoe';

export interface Lap {
  id: string;
  num: number;
  title: string;
  time: string; // "MM:SS:CC" or similar
  timestamp: string; // e.g. "2m ago" or ISO
  note?: string;
}

export interface SavedTimer {
  id: string;
  title: string;
  duration: number; // in seconds
  icon: 'utensils' | 'activity' | 'zap' | 'bell' | 'star';
  type: string; // "RECURRING DAILY" or "LAST USED: MON" etc.
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface AppSettings {
  spinachPoints: number;
  tasksCompleted: number;
  proUnlocked: boolean;
  isVolumeOn: boolean;
  isDottedBgOn: boolean;
}
