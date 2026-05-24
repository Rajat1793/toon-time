import { HelpCircle, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onToggleSidebar?: () => void;
  isDottedBgOn: boolean;
}

export default function Header({ onOpenSettings, onOpenHelp, onToggleSidebar, isDottedBgOn }: HeaderProps) {
  const bg     = isDottedBgOn ? 'bg-[#FBF5DD]'          : 'bg-[#0D530E]';
  const border = isDottedBgOn ? 'border-[#0D530E]/15'   : 'border-[#FBF5DD]/15';
  const text   = isDottedBgOn ? 'text-[#0D530E]'         : 'text-[#FBF5DD]';
  const btnBorder = isDottedBgOn ? 'border-[#0D530E]/20' : 'border-[#FBF5DD]/20';
  const menuHover = isDottedBgOn ? 'hover:text-[#306D29] hover:bg-[#0D530E]/5' : 'hover:text-[#E7E1B1] hover:bg-[#FBF5DD]/5';

  return (
    <header className={`${bg} ${border} border-b flex justify-between items-center w-full px-5 md:px-10 h-20 z-40 sticky top-0 transition-colors`}>
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            type="button" 
            onClick={onToggleSidebar}
            className={`md:hidden p-1.5 border ${btnBorder} ${text} ${menuHover} rounded-full transition-all`}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="font-heading text-2xl md:text-3xl font-black text-[#306D29] italic tracking-tighter uppercase select-none">
          TOON.TIME
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onOpenHelp}
          className={`w-11 h-11 flex items-center justify-center p-2 border ${btnBorder} rounded-full bg-transparent ${text} hover:bg-[#0D530E] hover:text-[#FBF5DD] hover:border-[#0D530E] transition-all cursor-pointer`}
          title="How to Play"
        >
          <HelpCircle className="w-5 h-5 pointer-events-none" />
        </button>
        <button
          onClick={onOpenSettings}
          className={`w-11 h-11 flex items-center justify-center p-2 border ${btnBorder} rounded-full bg-transparent ${text} hover:bg-[#306D29] hover:text-[#FBF5DD] hover:border-[#306D29] transition-all cursor-pointer`}
          title="Captain Settings"
        >
          <Settings className="w-5 h-5 pointer-events-none" />
        </button>
      </div>
    </header>
  );
}
