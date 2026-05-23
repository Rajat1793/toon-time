import { Timer, Hourglass, ClipboardList, Grid3X3 } from 'lucide-react';
import { ActiveView } from '../types';

interface MobileNavProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
}

export default function MobileNav({ currentView, onChangeView }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 bg-[#0F0F0F] border-t border-white/10 px-4 shadow-xl">
      <button
        onClick={() => onChangeView('stopwatch')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer ${
          currentView === 'stopwatch'
            ? 'bg-orange-600 text-black border border-orange-600 font-bold'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Timer className="w-4 h-4" />
        <span className="font-sans text-[9px] font-bold uppercase tracking-widest mt-0.5">Stopwatch</span>
      </button>

      <button
        onClick={() => onChangeView('timer')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer ${
          currentView === 'timer'
            ? 'bg-orange-600 text-black border border-orange-600 font-bold'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Hourglass className="w-4 h-4" />
        <span className="font-sans text-[9px] font-bold uppercase tracking-widest mt-0.5">Timer</span>
      </button>

      <button
        onClick={() => onChangeView('laps')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer ${
          currentView === 'laps'
            ? 'bg-orange-600 text-black border border-orange-600 font-bold'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <ClipboardList className="w-4 h-4" />
        <span className="font-sans text-[9px] font-bold uppercase tracking-widest mt-0.5">Laps</span>
      </button>

      <button
        onClick={() => onChangeView('tictactoe')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer ${
          currentView === 'tictactoe'
            ? 'bg-orange-600 text-black border border-orange-600 font-bold'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        <span className="font-sans text-[9px] font-bold uppercase tracking-widest mt-0.5">Game</span>
      </button>
    </nav>
  );
}
