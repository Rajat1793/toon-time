import { useState } from 'react';
import { RotateCcw, Trophy, Minus } from 'lucide-react';

type Cell = 'X' | 'O' | null;

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

interface TicTacToeTabProps {
  isDottedBgOn: boolean;
}

export default function TicTacToeTab({ isDottedBgOn }: TicTacToeTabProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Theme tokens — mirrors the pattern used in StopwatchTab / LapsTab
  const textPrimary   = isDottedBgOn ? 'text-[#0F0F0F]'       : 'text-[#F0EFEA]';
  const textSecondary = isDottedBgOn ? 'text-[#0F0F0F]/60'     : 'text-white/60';
  const textMuted     = isDottedBgOn ? 'text-[#0F0F0F]/40'     : 'text-white/40';
  const cardBg        = isDottedBgOn ? 'bg-white'               : 'bg-[#1A1A1A]';
  const cardBorder    = isDottedBgOn ? 'border-[#0F0F0F]/10'   : 'border-white/10';
  const cardHover     = isDottedBgOn ? 'hover:bg-[#0F0F0F]/5'  : 'hover:bg-white/10';
  const btnSecBg      = isDottedBgOn ? 'bg-white'               : 'bg-[#1A1A1A]';
  const btnSecText    = isDottedBgOn ? 'text-[#0F0F0F]/60 hover:text-[#0F0F0F]' : 'text-white/60 hover:text-white';
  const btnSecBorder  = isDottedBgOn ? 'border-[#0F0F0F]/15'   : 'border-white/10';
  const btnSecHover   = isDottedBgOn ? 'hover:bg-[#0F0F0F]/5'  : 'hover:bg-white/10';

  const result  = getWinner(board);
  const winner  = result?.winner ?? null;
  const winLine = result?.line ?? [];
  const isDraw  = !winner && board.every(Boolean);

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;
    const next = board.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);

    const newResult = getWinner(next);
    if (newResult?.winner) {
      setScores(prev => ({ ...prev, [newResult.winner as 'X' | 'O']: prev[newResult.winner as 'X' | 'O'] + 1 }));
    } else if (next.every(Boolean)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }

    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleFullReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  };

  let statusText = '';
  let statusIcon = null;
  if (winner) {
    statusText = `Player ${winner} wins!`;
    statusIcon = <Trophy className="w-4 h-4 text-orange-400" />;
  } else if (isDraw) {
    statusText = "It's a draw!";
    statusIcon = <Minus className={`w-4 h-4 ${textMuted}`} />;
  } else {
    statusText = `Player ${xIsNext ? 'X' : 'O'}'s turn`;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Tic Tac Toe</h1>
        <p className={`font-sans text-xs uppercase tracking-widest mt-1 ${textMuted}`}>Two-player board game</p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Player X</span>
          <span className="font-sans text-3xl font-bold text-orange-400">{scores.X}</span>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Draws</span>
          <span className={`font-sans text-3xl font-bold ${textSecondary}`}>{scores.draws}</span>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Player O</span>
          <span className={`font-sans text-3xl font-bold ${textPrimary}`}>{scores.O}</span>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full border transition-all ${
        winner
          ? 'bg-orange-600/15 border-orange-600/40 text-orange-400'
          : isDraw
          ? `${isDottedBgOn ? 'bg-[#0F0F0F]/5 border-[#0F0F0F]/10' : 'bg-white/5 border-white/10'} ${textMuted}`
          : xIsNext
          ? 'bg-orange-600/10 border-orange-600/20 text-orange-500'
          : `${isDottedBgOn ? 'bg-[#0F0F0F]/5 border-[#0F0F0F]/10' : 'bg-white/5 border-white/10'} ${textSecondary}`
      }`}>
        {statusIcon}
        <span className="font-sans text-sm font-bold uppercase tracking-widest">{statusText}</span>
      </div>

      {/* Board */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm">
          {board.map((cell, i) => {
            const isWinCell = winLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={!!winner || isDraw || !!cell}
                className={`
                  aspect-square rounded-2xl border text-4xl font-black font-sans
                  flex items-center justify-center
                  transition-all duration-150 select-none
                  ${cell ? 'cursor-default' : winner || isDraw ? 'cursor-default opacity-60' : `cursor-pointer ${cardHover} active:scale-95`}
                  ${isWinCell
                    ? 'bg-orange-600/20 border-orange-500/60 shadow-[0_0_16px_rgba(234,88,12,0.25)]'
                    : `${cardBg} ${cardBorder}`
                  }
                  ${cell === 'X' ? 'text-orange-500' : isDottedBgOn ? 'text-[#0F0F0F]' : 'text-[#F0EFEA]'}
                `}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-black font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Game
        </button>
        <button
          onClick={handleFullReset}
          className={`flex items-center gap-2 px-5 py-2.5 ${btnSecBg} ${btnSecText} border ${btnSecBorder} ${btnSecHover} font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 cursor-pointer`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Scores
        </button>
      </div>

      {/* Turn indicator dots */}
      {!winner && !isDraw && (
        <div className="flex justify-center gap-3">
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${
            xIsNext
              ? 'bg-orange-600/20 border-orange-500/50'
              : `bg-transparent ${isDottedBgOn ? 'border-[#0F0F0F]/5' : 'border-white/5'}`
          }`}>
            <span className={`w-2 h-2 rounded-full ${xIsNext ? 'bg-orange-500' : isDottedBgOn ? 'bg-[#0F0F0F]/20' : 'bg-white/20'}`}></span>
            <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${xIsNext ? 'text-orange-400' : textMuted}`}>X</span>
          </div>
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${
            !xIsNext
              ? `${isDottedBgOn ? 'bg-[#0F0F0F]/10 border-[#0F0F0F]/20' : 'bg-white/10 border-white/20'}`
              : `bg-transparent ${isDottedBgOn ? 'border-[#0F0F0F]/5' : 'border-white/5'}`
          }`}>
            <span className={`w-2 h-2 rounded-full ${!xIsNext ? (isDottedBgOn ? 'bg-[#0F0F0F]' : 'bg-white') : isDottedBgOn ? 'bg-[#0F0F0F]/20' : 'bg-white/20'}`}></span>
            <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${!xIsNext ? textPrimary : textMuted}`}>O</span>
          </div>
        </div>
      )}
    </div>
  );
}
