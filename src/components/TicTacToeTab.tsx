import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Trophy, Minus, Globe, Monitor, Copy, Check, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

type Cell = 'X' | 'O' | null;
type GameMode    = 'select' | 'local' | 'online';
type OnlinePhase = 'menu' | 'join-input' | 'connecting' | 'waiting' | 'playing' | 'disconnected';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line };
  }
  return null;
}

// In dev: ws://localhost:8080  |  In prod: set VITE_WS_URL env var in Render
const WS_URL = (import.meta.env.VITE_WS_URL as string)
  || (import.meta.env.DEV ? 'ws://localhost:8080' : 'wss://toon-time-ws.onrender.com');

interface TicTacToeTabProps {
  isDottedBgOn: boolean;
}

export default function TicTacToeTab({ isDottedBgOn }: TicTacToeTabProps) {
  // ── Theme tokens ─────────────────────────────────────────────────────────
  const textPrimary   = isDottedBgOn ? 'text-[#0D530E]'         : 'text-[#FBF5DD]';
  const textSecondary = isDottedBgOn ? 'text-[#0D530E]/60'      : 'text-[#FBF5DD]/60';
  const textMuted     = isDottedBgOn ? 'text-[#0D530E]/40'      : 'text-[#FBF5DD]/40';
  const cardBg        = isDottedBgOn ? 'bg-[#FBF5DD]'            : 'bg-[#16421A]';
  const cardBg2       = isDottedBgOn ? 'bg-[#E7E1B1]'            : 'bg-[#1F5523]';
  const cardBorder    = isDottedBgOn ? 'border-[#0D530E]/15'    : 'border-[#FBF5DD]/15';
  const cardHover     = isDottedBgOn ? 'hover:bg-[#0D530E]/5'   : 'hover:bg-[#FBF5DD]/10';
  const btnSecBg      = isDottedBgOn ? 'bg-[#FBF5DD]'            : 'bg-[#16421A]';
  const btnSecText    = isDottedBgOn ? 'text-[#0D530E]/60 hover:text-[#0D530E]' : 'text-[#FBF5DD]/60 hover:text-[#FBF5DD]';
  const btnSecBorder  = isDottedBgOn ? 'border-[#0D530E]/15'    : 'border-[#FBF5DD]/15';
  const btnSecHover   = isDottedBgOn ? 'hover:bg-[#0D530E]/5'   : 'hover:bg-[#FBF5DD]/10';
  const inputCls      = isDottedBgOn ? 'bg-[#E7E1B1] text-[#0D530E]' : 'bg-[#16421A] text-[#FBF5DD]';

  // ── Game state ────────────────────────────────────────────────────────────
  const [board,   setBoard]   = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores,  setScores]  = useState({ X: 0, O: 0, draws: 0 });

  // ── Mode / online state ───────────────────────────────────────────────────
  const [gameMode,     setGameMode]     = useState<GameMode>('select');
  const [onlinePhase,  setOnlinePhase]  = useState<OnlinePhase>('menu');
  const [roomCode,     setRoomCode]     = useState('');
  const [joinInput,    setJoinInput]    = useState('');
  const [myPlayer,     setMyPlayer]     = useState<'X' | 'O' | null>(null);
  const [onlineError,  setOnlineError]  = useState('');
  const [copied,       setCopied]       = useState(false);

  // Stable ref so WS close handler always sees current phase
  const phaseRef = useRef<OnlinePhase>('menu');
  useEffect(() => { phaseRef.current = onlinePhase; }, [onlinePhase]);

  const wsRef = useRef<WebSocket | null>(null);

  // Cleanup on unmount
  useEffect(() => () => closeWS(), []);

  // ── Sound effects ─────────────────────────────────────────────────────────
  function tone(
    ctx: AudioContext, freq: number, start: number,
    dur: number, gain = 0.25, type: OscillatorType = 'sine'
  ) {
    const osc   = ctx.createOscillator();
    const gainN = ctx.createGain();
    osc.connect(gainN); gainN.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gainN.gain.setValueAtTime(gain, start);
    gainN.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.start(start); osc.stop(start + dur);
  }

  function playMove(player: 'X' | 'O') {
    try {
      const ctx = new AudioContext(); const t = ctx.currentTime;
      if (player === 'X') {
        // X: bright high double-tap
        tone(ctx, 900,  t,        0.07, 0.22, 'square');
        tone(ctx, 1350, t + 0.05, 0.05, 0.12, 'sine');
      } else {
        // O: warm lower tap
        tone(ctx, 450, t,        0.07, 0.22, 'square');
        tone(ctx, 675, t + 0.05, 0.05, 0.12, 'sine');
      }
    } catch (_) {}
  }

  function playWin() {
    try {
      const ctx = new AudioContext(); const t = ctx.currentTime;
      // Triumphant ascending arpeggio C5→E5→G5→C6→E6
      [523, 659, 784, 1047, 1319].forEach((f, i) =>
        tone(ctx, f, t + i * 0.11, 0.45, 0.28)
      );
      // Warm root chord underneath
      [261, 329, 392].forEach(f => tone(ctx, f, t + 0.50, 0.80, 0.15));
    } catch (_) {}
  }

  function playDraw() {
    try {
      const ctx = new AudioContext(); const t = ctx.currentTime;
      // Descending neutral tones
      [523, 466, 415, 370].forEach((f, i) =>
        tone(ctx, f, t + i * 0.14, 0.28, 0.20)
      );
    } catch (_) {}
  }

  // ── WS helpers ────────────────────────────────────────────────────────────
  function closeWS() {
    if (wsRef.current) {
      wsRef.current.onclose = null; // prevent close handler from firing
      wsRef.current.close();
      wsRef.current = null;
    }
  }

  async function connect(initialMessage: object) {
    closeWS();
    setOnlineError('');
    setOnlinePhase('connecting');

    // Wake up the free-tier server via HTTP before opening the WebSocket.
    // On Render free plan, a cold-start can take 30-50s which causes mobile
    // browsers to drop the WS connection before the server is ready.
    // Skip the ping entirely for local dev.
    const isLocalhost = WS_URL.includes('localhost') || WS_URL.includes('127.0.0.1');
    if (!isLocalhost) {
      const httpOrigin = WS_URL.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
      try {
        await fetch(httpOrigin, { signal: AbortSignal.timeout(50000) });
      } catch (_) {
        setOnlineError('Server is taking too long to wake up. Please try again.');
        setOnlinePhase('menu');
        return;
      }
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => ws.send(JSON.stringify(initialMessage));

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data as string);

      if (msg.type === 'ROOM_CREATED') {
        setRoomCode(msg.roomCode);
        setMyPlayer('X');
        setOnlinePhase('waiting');
      }
      if (msg.type === 'ROOM_JOINED') {
        setRoomCode(msg.roomCode);
        setMyPlayer('O');
      }
      if (msg.type === 'GAME_START') {
        setBoard(msg.board);
        setXIsNext(msg.xIsNext);
        setOnlinePhase('playing');
      }
      if (msg.type === 'GAME_UPDATE') {
        setBoard(msg.board);
        setXIsNext(msg.xIsNext);
        const res = getWinner(msg.board);
        if (res?.winner) {
          setScores(prev => ({ ...prev, [res.winner as 'X' | 'O']: prev[res.winner as 'X' | 'O'] + 1 }));
        } else if ((msg.board as Cell[]).every(Boolean)) {
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        }
      }
      if (msg.type === 'ERROR') {
        setOnlineError(msg.message);
      }
      if (msg.type === 'OPPONENT_DISCONNECTED') {
        setOnlinePhase('disconnected');
      }
    };

    ws.onerror = () => {
      ws.onclose = null;
      setOnlineError('Could not connect to the game server. Try again.');
      setOnlinePhase('menu');
    };

    ws.onclose = () => {
      if (phaseRef.current === 'playing' || phaseRef.current === 'waiting') {
        setOnlinePhase('disconnected');
      }
    };
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleLocalClick(index: number) {
    if (board[index] || winner || isDraw) return;
    const next = board.slice() as Cell[];
    next[index] = xIsNext ? 'X' : 'O';
    setBoard(next);
    const res = getWinner(next);
    if (res?.winner) setScores(prev => ({ ...prev, [res.winner as 'X' | 'O']: prev[res.winner as 'X' | 'O'] + 1 }));
    else if (next.every(Boolean)) setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    setXIsNext(!xIsNext);
  }

  function handleOnlineClick(index: number) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (board[index] || winner || isDraw) return;
    const isMyTurn = (xIsNext && myPlayer === 'X') || (!xIsNext && myPlayer === 'O');
    if (!isMyTurn) return;
    wsRef.current.send(JSON.stringify({ type: 'MAKE_MOVE', index }));
  }

  function handleCreateRoom()  { void connect({ type: 'CREATE_ROOM' }); }
  function handleJoinRoom()    { if (joinInput.length >= 4) void connect({ type: 'JOIN_ROOM', roomCode: joinInput }); }
  function handleNewGameOnline() { wsRef.current?.send(JSON.stringify({ type: 'NEW_GAME' })); }

  function handleCopyCode() {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function goToModes() {
    closeWS();
    setGameMode('select');
    setOnlinePhase('menu');
    setRoomCode(''); setJoinInput(''); setMyPlayer(null); setOnlineError('');
    setBoard(Array(9).fill(null)); setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  }

  function goToOnlineMenu() {
    closeWS();
    setOnlinePhase('menu');
    setRoomCode(''); setJoinInput(''); setMyPlayer(null); setOnlineError('');
    setBoard(Array(9).fill(null)); setXIsNext(true);
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const result  = getWinner(board);
  const winner  = result?.winner ?? null;
  const winLine = result?.line  ?? [];
  const isDraw  = !winner && board.every(Boolean);
  const isMyTurn = gameMode === 'online'
    ? (xIsNext && myPlayer === 'X') || (!xIsNext && myPlayer === 'O')
    : true;

  // Play move sound when any cell is filled (local & online)
  const prevBoardRef = useRef<Cell[]>(Array(9).fill(null));
  useEffect(() => {
    const changed = board.findIndex((c, i) => c !== null && prevBoardRef.current[i] === null);
    if (changed !== -1 && !winner && !isDraw) playMove(board[changed] as 'X' | 'O');
    prevBoardRef.current = [...board];
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play win / draw sound on state transition
  const prevWinnerRef = useRef<Cell>(null);
  const prevDrawRef   = useRef(false);
  useEffect(() => {
    if (winner && !prevWinnerRef.current) playWin();
    else if (isDraw && !prevDrawRef.current) playDraw();
    prevWinnerRef.current = winner;
    prevDrawRef.current   = isDraw;
  }, [winner, isDraw]); // eslint-disable-line react-hooks/exhaustive-deps

  let statusText = '';
  if (winner) {
    statusText = gameMode === 'online'
      ? (winner === myPlayer ? '🎉 You win!' : `Player ${winner} wins!`)
      : `Player ${winner} wins!`;
  } else if (isDraw) {
    statusText = "It's a draw!";
  } else if (gameMode === 'online') {
    statusText = isMyTurn ? 'Your turn' : "Opponent's turn…";
  } else {
    statusText = `Player ${xIsNext ? 'X' : 'O'}'s turn`;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER BRANCHES
  // ════════════════════════════════════════════════════════════════════════════

  // ── 1. Mode Select ────────────────────────────────────────────────────────
  if (gameMode === 'select') {
    return (
      <div className="flex flex-col gap-8 max-w-sm mx-auto w-full">
        <div>
          <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Tic Tac Toe</h1>
          <p className={`font-sans text-xs uppercase tracking-widest mt-1 ${textMuted}`}>Choose your game mode</p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setGameMode('local')}
            className={`${cardBg} border ${cardBorder} rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:border-[#306D29]/50 transition-all group text-left`}
          >
            <div className={`w-14 h-14 rounded-xl ${cardBg2} border ${cardBorder} flex items-center justify-center shrink-0 group-hover:border-[#306D29]/40 transition-colors`}>
              <Monitor className={`w-6 h-6 ${textSecondary}`} />
            </div>
            <div>
              <p className={`font-sans text-base font-bold ${textPrimary}`}>Local Play</p>
              <p className={`font-sans text-xs mt-1 ${textMuted}`}>Two players on the same device</p>
            </div>
          </button>

          <button
            onClick={() => setGameMode('online')}
            className={`${cardBg} border ${cardBorder} rounded-2xl p-6 flex items-center gap-5 cursor-pointer hover:border-[#306D29]/50 transition-all group text-left`}
          >
            <div className="w-14 h-14 rounded-xl bg-[#306D29]/10 border border-[#306D29]/20 flex items-center justify-center shrink-0 group-hover:border-[#306D29]/40 transition-colors">
              <Globe className="w-6 h-6 text-[#306D29]" />
            </div>
            <div>
              <p className={`font-sans text-base font-bold ${textPrimary}`}>Multiplayer</p>
              <p className={`font-sans text-xs mt-1 ${textMuted}`}>Play online with a friend via room code</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── 2. Online — Main Menu ─────────────────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'menu') {
    return (
      <div className="flex flex-col gap-8 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-3">
          <button onClick={goToModes} className={`w-9 h-9 rounded-full border ${cardBorder} ${btnSecBg} flex items-center justify-center ${textSecondary} ${cardHover} transition-all cursor-pointer shrink-0`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Multiplayer</h1>
            <p className={`font-sans text-xs uppercase tracking-widest mt-0.5 ${textMuted}`}>Online via WebSocket</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={handleCreateRoom} className="bg-[#306D29] hover:bg-[#306D29] text-[#FBF5DD] font-sans text-sm font-bold rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all text-left">
            <Globe className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Create Room</p>
              <p className="text-xs font-medium opacity-70 mt-0.5">Get a 4-letter code to share with a friend</p>
            </div>
          </button>

          <button onClick={() => setOnlinePhase('join-input')} className={`${cardBg} border ${cardBorder} ${textPrimary} font-sans text-sm font-bold rounded-2xl p-5 flex items-center gap-4 cursor-pointer ${cardHover} transition-all text-left`}>
            <ArrowLeft className="w-5 h-5 rotate-180 shrink-0" />
            <div>
              <p className="font-bold">Join Room</p>
              <p className={`text-xs font-medium mt-0.5 ${textMuted}`}>Enter the code your friend shared</p>
            </div>
          </button>
        </div>

        {onlineError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {onlineError}
          </div>
        )}
      </div>
    );
  }

  // ── 3. Online — Connecting (warm-up) ─────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'connecting') {
    return (
      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto w-full py-16">
        <Loader2 className="w-14 h-14 text-[#306D29] animate-spin" />
        <div className="text-center">
          <p className={`font-sans text-base font-bold ${textPrimary}`}>Waking up the server…</p>
          <p className={`font-sans text-xs mt-2 ${textMuted}`}>Free hosting may take up to 30 seconds on first connection.</p>
        </div>
        <button
          onClick={() => { closeWS(); setOnlinePhase('menu'); }}
          className={`text-xs ${textMuted} underline cursor-pointer mt-2`}
        >
          Cancel
        </button>
      </div>
    );
  }

  // ── 4. Online — Join Input ────────────────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'join-input') {
    return (
      <div className="flex flex-col gap-8 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-3">
          <button onClick={() => { setOnlinePhase('menu'); setOnlineError(''); }} className={`w-9 h-9 rounded-full border ${cardBorder} ${btnSecBg} flex items-center justify-center ${textSecondary} ${cardHover} transition-all cursor-pointer shrink-0`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Join Room</h1>
            <p className={`font-sans text-xs uppercase tracking-widest mt-0.5 ${textMuted}`}>Enter the 4-letter room code</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="e.g. AB3X"
            maxLength={4}
            value={joinInput}
            onChange={e => setJoinInput(e.target.value.toUpperCase())}
            className={`w-full text-center font-heading text-4xl font-black tracking-[0.35em] py-6 rounded-2xl border ${cardBorder} ${inputCls} focus:border-[#306D29] focus:outline-none transition-colors`}
          />
          <button
            onClick={handleJoinRoom}
            disabled={joinInput.length < 4}
            className="bg-[#306D29] hover:bg-[#306D29] disabled:opacity-40 disabled:cursor-not-allowed text-[#FBF5DD] font-sans text-sm font-bold rounded-2xl py-4 cursor-pointer transition-all"
          >
            Join Game
          </button>
        </div>

        {onlineError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {onlineError}
          </div>
        )}
      </div>
    );
  }

  // ── 4. Online — Waiting for Opponent ──────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'waiting') {
    return (
      <div className="flex flex-col gap-8 max-w-sm mx-auto w-full">
        <div>
          <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Waiting for opponent…</h1>
          <p className={`font-sans text-xs uppercase tracking-widest mt-1 ${textMuted}`}>Share the code below with your friend</p>
        </div>

        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-8 flex flex-col items-center gap-6`}>
          <Loader2 className="w-8 h-8 text-[#306D29] animate-spin" />
          <div className="text-center">
            <p className={`font-sans text-xs font-bold uppercase tracking-widest ${textMuted} mb-3`}>Room Code</p>
            <p className="font-heading text-6xl font-black text-[#306D29] tracking-widest select-all">{roomCode}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-2 px-5 py-2.5 ${cardBg2} border ${cardBorder} ${textSecondary} hover:text-[#306D29] hover:border-[#306D29]/40 font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <button onClick={goToOnlineMenu} className={`flex items-center justify-center gap-2 px-5 py-3 ${btnSecBg} ${btnSecText} border ${btnSecBorder} ${btnSecHover} font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer`}>
          Cancel
        </button>
      </div>
    );
  }

  // ── 5. Online — Opponent Disconnected ─────────────────────────────────────
  if (gameMode === 'online' && onlinePhase === 'disconnected') {
    return (
      <div className="flex flex-col gap-8 max-w-sm mx-auto w-full">
        <div className={`${cardBg} border border-red-500/20 rounded-2xl p-6 flex items-center gap-4`}>
          <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
          <div>
            <p className={`font-sans text-base font-bold ${textPrimary}`}>Opponent disconnected</p>
            <p className={`font-sans text-xs mt-1 ${textMuted}`}>The connection was lost</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={goToOnlineMenu} className="bg-[#306D29] hover:bg-[#306D29] text-[#FBF5DD] font-sans text-sm font-bold rounded-2xl py-4 cursor-pointer transition-all">
            Play Again
          </button>
          <button onClick={goToModes} className={`${btnSecBg} ${btnSecText} border ${btnSecBorder} ${btnSecHover} font-sans text-sm font-bold rounded-2xl py-4 cursor-pointer transition-all`}>
            Back to Modes
          </button>
        </div>
      </div>
    );
  }

  // ── 6. Game Board (Local or Online → Playing) ─────────────────────────────
  const handleClick = gameMode === 'online' ? handleOnlineClick : handleLocalClick;

  return (
    <div className="flex flex-col gap-8">

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`font-sans text-2xl font-bold tracking-tight ${textPrimary}`}>Tic Tac Toe</h1>
          <p className={`font-sans text-xs uppercase tracking-widest mt-1 ${textMuted}`}>
            {gameMode === 'online' ? `Room ${roomCode} · You are ${myPlayer}` : 'Two-player board game'}
          </p>
        </div>
        <button
          onClick={goToModes}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cardBorder} ${btnSecBg} ${textSecondary} ${cardHover} font-sans text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer`}
        >
          <ArrowLeft className="w-3 h-3" />
          Modes
        </button>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${cardBg} border ${gameMode === 'online' && myPlayer === 'X' ? 'border-[#306D29]/40' : cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>
            {gameMode === 'online' ? (myPlayer === 'X' ? 'You (X)' : 'Opponent (X)') : 'Player X'}
          </span>
          <span className="font-sans text-3xl font-bold text-[#306D29]">{scores.X}</span>
        </div>
        <div className={`${cardBg} border ${cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Draws</span>
          <span className={`font-sans text-3xl font-bold ${textSecondary}`}>{scores.draws}</span>
        </div>
        <div className={`${cardBg} border ${gameMode === 'online' && myPlayer === 'O' ? 'border-[#306D29]/40' : cardBorder} rounded-2xl p-4 flex flex-col items-center gap-1`}>
          <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>
            {gameMode === 'online' ? (myPlayer === 'O' ? 'You (O)' : 'Opponent (O)') : 'Player O'}
          </span>
          <span className={`font-sans text-3xl font-bold ${textPrimary}`}>{scores.O}</span>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full border transition-all ${
        winner
          ? 'bg-[#306D29]/15 border-[#306D29]/40 text-[#306D29]'
          : isDraw
          ? `${isDottedBgOn ? 'bg-[#0D530E]/20 border-[#0D530E]/10' : 'bg-[#FBF5DD]/10 border-[#FBF5DD]/15'} ${textMuted}`
          : (isMyTurn || gameMode === 'local')
          ? 'bg-[#306D29]/10 border-[#306D29]/20 text-[#306D29]'
          : `${isDottedBgOn ? 'bg-[#0D530E]/20 border-[#0D530E]/10' : 'bg-[#FBF5DD]/10 border-[#FBF5DD]/15'} ${textSecondary}`
      }`}>
        {winner
          ? <Trophy className="w-4 h-4 text-[#306D29]" />
          : isDraw
          ? <Minus className={`w-4 h-4 ${textMuted}`} />
          : (gameMode === 'online' && !isMyTurn)
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : null}
        <span className="font-sans text-sm font-bold uppercase tracking-widest">{statusText}</span>
      </div>

      {/* Board */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm">
          {board.map((cell, i) => {
            const isWinCell = winLine.includes(i);
            const canClick  = !cell && !winner && !isDraw && (gameMode === 'local' || isMyTurn);
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={!canClick}
                className={`
                  aspect-square rounded-2xl border text-4xl font-black font-sans
                  flex items-center justify-center transition-all duration-150 select-none
                  ${canClick ? `cursor-pointer ${cardHover} active:scale-95` : 'cursor-default'}
                  ${isWinCell
                    ? 'bg-[#306D29]/20 border-[#306D29]/60 shadow-[0_0_16px_rgba(234,88,12,0.25)]'
                    : `${cardBg} ${cardBorder}`}
                  ${cell === 'X' ? 'text-[#306D29]' : isDottedBgOn ? 'text-[#0D530E]' : 'text-[#FBF5DD]'}
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
        {gameMode === 'online' ? (
          (winner || isDraw) && (
            <button onClick={handleNewGameOnline} className="flex items-center gap-2 px-5 py-2.5 bg-[#306D29] hover:bg-[#306D29] text-[#FBF5DD] font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              New Game
            </button>
          )
        ) : (
          <>
            <button onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#306D29] hover:bg-[#306D29] text-[#FBF5DD] font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              New Game
            </button>
            <button onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); setScores({ X: 0, O: 0, draws: 0 }); }} className={`flex items-center gap-2 px-5 py-2.5 ${btnSecBg} ${btnSecText} border ${btnSecBorder} ${btnSecHover} font-sans text-xs font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 cursor-pointer`}>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Scores
            </button>
          </>
        )}
      </div>

      {/* Turn Indicator Dots */}
      {!winner && !isDraw && (
        <div className="flex justify-center gap-3">
          {(['X', 'O'] as const).map(p => {
            const active = (p === 'X') === xIsNext;
            const isYou  = gameMode === 'online' && myPlayer === p;
            return (
              <div key={p} className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all ${
                active
                  ? p === 'X'
                    ? 'bg-[#306D29]/20 border-[#306D29]/50'
                    : `${isDottedBgOn ? 'bg-[#0D530E]/15 border-[#0D530E]/25' : 'bg-[#FBF5DD]/10 border-[#FBF5DD]/20'}`
                  : `bg-transparent ${isDottedBgOn ? 'border-[#0D530E]/5' : 'border-white/5'}`
              }`}>
                <span className={`w-2 h-2 rounded-full ${active ? (p === 'X' ? 'bg-[#306D29]' : isDottedBgOn ? 'bg-[#0D530E]' : 'bg-[#FBF5DD]') : isDottedBgOn ? 'bg-[#0D530E]/20' : 'bg-[#FBF5DD]/20'}`} />
                <span className={`font-sans text-[10px] font-bold uppercase tracking-widest ${active ? (p === 'X' ? 'text-[#306D29]' : textPrimary) : textMuted}`}>
                  {p}{isYou ? ' (you)' : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
