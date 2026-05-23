import { HelpCircle, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onToggleSidebar?: () => void;
  isDottedBgOn: boolean;
}

export default function Header({ onOpenSettings, onOpenHelp, onToggleSidebar, isDottedBgOn }: HeaderProps) {
  const bg     = isDottedBgOn ? 'bg-white'           : 'bg-[#0F0F0F]';
  const border = isDottedBgOn ? 'border-[#0F0F0F]/10' : 'border-white/10';
  const text   = isDottedBgOn ? 'text-[#0F0F0F]'     : 'text-[#F0EFEA]';
  const btnBorder = isDottedBgOn ? 'border-[#0F0F0F]/20' : 'border-white/20';
  const menuHover = isDottedBgOn ? 'hover:text-orange-500 hover:bg-[#0F0F0F]/5' : 'hover:text-orange-500 hover:bg-white/5';

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
        <div className="font-heading text-2xl md:text-3xl font-black text-orange-600 italic tracking-tighter uppercase select-none">
          TOON.TIME
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onOpenHelp}
          className={`w-11 h-11 flex items-center justify-center p-2 border ${btnBorder} rounded-full bg-transparent ${text} hover:bg-[#0F0F0F] hover:text-white hover:border-[#0F0F0F] transition-all cursor-pointer`}
          title="How to Play"
        >
          <HelpCircle className="w-5 h-5 pointer-events-none" />
        </button>
        <button
          onClick={onOpenSettings}
          className={`w-11 h-11 flex items-center justify-center p-2 border ${btnBorder} rounded-full bg-transparent ${text} hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all cursor-pointer`}
          title="Captain Settings"
        >
          <Settings className="w-5 h-5 pointer-events-none" />
        </button>
      </div>
    </header>
  );
}
