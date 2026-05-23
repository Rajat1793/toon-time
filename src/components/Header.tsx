import { HelpCircle, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onOpenSettings, onOpenHelp, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-[#0F0F0F] border-b border-white/10 flex justify-between items-center w-full px-5 md:px-10 h-20 z-40 sticky top-0 transition-colors">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            type="button" 
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 border border-white/10 text-white hover:text-orange-500 rounded-full hover:bg-white/5 transition-all"
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
          className="w-11 h-11 flex items-center justify-center p-2 border border-white/20 rounded-full bg-transparent text-[#F0EFEA] hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          title="How to Play"
        >
          <HelpCircle className="w-5 h-5 pointer-events-none" />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 flex items-center justify-center p-2 border border-white/20 rounded-full bg-transparent text-[#F0EFEA] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all cursor-pointer"
          title="Captain Settings"
        >
          <Settings className="w-5 h-5 pointer-events-none" />
        </button>
      </div>
    </header>
  );
}
