import { Timer, Hourglass, ClipboardList, Grid3X3 } from 'lucide-react';
import { ActiveView } from '../types';

interface MobileNavProps {
  currentView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  isDottedBgOn: boolean;
}

export default function MobileNav({ currentView, onChangeView, isDottedBgOn }: MobileNavProps) {
  const bg     = isDottedBgOn ? 'bg-[#FBF5DD]'           : 'bg-[#0D530E]';
  const border = isDottedBgOn ? 'border-[#0D530E]/15'    : 'border-[#FBF5DD]/15';
  const inactive = isDottedBgOn ? 'text-[#0D530E]/50 hover:text-[#0D530E]' : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD]';

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 ${bg} border-t ${border} px-4 shadow-xl`}>
      {([
        { view: 'stopwatch', label: 'Stopwatch', Icon: Timer },
        { view: 'timer',     label: 'Timer',     Icon: Hourglass },
        { view: 'laps',      label: 'Laps',      Icon: ClipboardList },
        { view: 'tictactoe', label: 'Game',      Icon: Grid3X3 },
      ] as const).map(({ view, label, Icon }) => (
        <button
          key={view}
          onClick={() => onChangeView(view)}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all active:scale-95 cursor-pointer ${
            currentView === view
              ? 'bg-[#306D29] text-[#FBF5DD] border border-[#306D29] font-bold'
              : inactive
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="font-sans text-[9px] font-bold uppercase tracking-widest mt-0.5">{label}</span>
        </button>
      ))}
    </nav>
  );
}
