import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

// ── HTTP server (health check endpoint for Render) ──────────────────────────
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Toon Time WebSocket Server OK');
});

const wss = new WebSocketServer({ server: httpServer });

// rooms: Map<code, { X: WebSocket|null, O: WebSocket|null, board: Cell[], xIsNext: bool }>
const rooms = new Map();

// ── Helpers ──────────────────────────────────────────────────────────────────
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function send(ws, message) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

function broadcast(room, message) {
  send(room.X, message);
  send(room.O, message);
}

// ── Connection handler ───────────────────────────────────────────────────────
wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.player   = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      case 'CREATE_ROOM': {
        const code = generateCode();
        rooms.set(code, { X: ws, O: null, board: Array(9).fill(null), xIsNext: true });
        ws.roomCode = code;
        ws.player   = 'X';
        send(ws, { type: 'ROOM_CREATED', roomCode: code, player: 'X' });
        break;
      }

      case 'JOIN_ROOM': {
        const code = String(msg.roomCode ?? '').trim().toUpperCase();
        const room = rooms.get(code);
        if (!room)    { send(ws, { type: 'ERROR', message: 'Room not found.' });  return; }
        if (room.O)   { send(ws, { type: 'ERROR', message: 'Room is full.' });    return; }

        room.O      = ws;
        ws.roomCode = code;
        ws.player   = 'O';

        send(ws, { type: 'ROOM_JOINED', roomCode: code, player: 'O' });
        broadcast(room, { type: 'GAME_START', board: room.board, xIsNext: room.xIsNext });
        break;
      }

      case 'MAKE_MOVE': {
        const room = rooms.get(ws.roomCode);
        if (!room) return;

        const idx = Number(msg.index);
        if (!Number.isInteger(idx) || idx < 0 || idx > 8) return;
        if (room.board[idx] !== null) return;
        if (getWinner(room.board) || room.board.every(Boolean)) return; // game already over
        if ((room.xIsNext && ws.player !== 'X') || (!room.xIsNext && ws.player !== 'O')) return;

        room.board[idx] = ws.player;
        room.xIsNext    = !room.xIsNext;
        broadcast(room, { type: 'GAME_UPDATE', board: [...room.board], xIsNext: room.xIsNext });
        break;
      }

      case 'NEW_GAME': {
        const room = rooms.get(ws.roomCode);
        if (!room) return;
        if (!getWinner(room.board) && !room.board.every(Boolean)) return; // not over yet

        room.board   = Array(9).fill(null);
        room.xIsNext = true;
        broadcast(room, { type: 'GAME_START', board: room.board, xIsNext: room.xIsNext });
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!ws.roomCode) return;
    const room = rooms.get(ws.roomCode);
    if (!room) return;

    const other = ws.player === 'X' ? room.O : room.X;
    send(other, { type: 'OPPONENT_DISCONNECTED' });
    rooms.delete(ws.roomCode);
  });

  ws.on('error', () => { /* swallow; close fires after */ });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`[toon-time-ws] listening on port ${PORT}`);
});
