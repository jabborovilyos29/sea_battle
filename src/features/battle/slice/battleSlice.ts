import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Ship {
  id: string;
  size: number;
  positions: number[];
  placed: boolean;
}

export interface BattleState {
  gridSize: number;
  playerShips: Ship[];
  enemyShips: Ship[];
  playerShots: Record<number, "hit" | "miss">;
  enemyShots: Record<number, "hit" | "miss">;
  phase: "placement" | "battle" | "gameover";
  currentTurn: "player" | "enemy";
  winner: "player" | "enemy" | null;
  placementHistory: string[];
}

const gridSize = 10;

const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const initialPlayerShips: Ship[] = shipSizes.map((size, index) => ({
  id: `ship-${index + 1}`,
  size,
  positions: [],
  placed: false,
}));

function generateEnemyShips(): Ship[] {
  const enemyShips: Ship[] = [];

  const isOverlap = (positions: number[]): boolean => {
    return enemyShips.some((ship) =>
      ship.positions.some((pos) => positions.includes(pos)),
    );
  };

  for (let i = 0; i < shipSizes.length; i++) {
    const size = shipSizes[i];
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 1000) {
      attempts++;
      const orientation: "horizontal" | "vertical" =
        Math.random() < 0.5 ? "horizontal" : "vertical";
      let row: number, col: number;
      if (orientation === "horizontal") {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - size + 1));
      } else {
        row = Math.floor(Math.random() * (gridSize - size + 1));
        col = Math.floor(Math.random() * gridSize);
      }
      const positions: number[] = [];
      for (let j = 0; j < size; j++) {
        const pos =
          orientation === "horizontal"
            ? row * gridSize + (col + j)
            : (row + j) * gridSize + col;
        positions.push(pos);
      }
      if (isOverlap(positions)) continue;
      enemyShips.push({
        id: `enemy-ship-${i + 1}`,
        size,
        positions,
        placed: true,
      });
      placed = true;
    }
    if (!placed) {
      throw new Error("Не удалось разместить корабли противника");
    }
  }
  return enemyShips;
}

const initialState: BattleState = {
  gridSize,
  playerShips: initialPlayerShips,
  enemyShips: [],
  playerShots: {},
  enemyShots: {},
  phase: "placement",
  currentTurn: "player",
  winner: null,
  placementHistory: [],
};

const battleSlice = createSlice({
  name: "battle",
  initialState,
  reducers: {
    setPlayerShipPosition: (
      state,
      action: PayloadAction<{ shipId: string; positions: number[] }>,
    ) => {
      const occupiedPositions = state.playerShips
        .filter((ship) => ship.placed)
        .flatMap((ship) => ship.positions);

      const newPositions = action.payload.positions;
      const isIntersecting = newPositions.some((pos) =>
        occupiedPositions.includes(pos),
      );
      if (isIntersecting) {
        alert("Невозможно разместить корабль – пересечение с другим кораблём.");
        return;
      }

      const ship = state.playerShips.find(
        (s) => s.id === action.payload.shipId,
      );
      if (ship) {
        ship.positions = newPositions;
        ship.placed = true;
        state.placementHistory.push(ship.id);
      }
    },

    resetAllPlacements: (state) => {
      state.playerShips = state.playerShips.map((ship) => ({
        ...ship,
        placed: false,
        positions: [],
      }));
      state.placementHistory = [];
    },

    cancelLastPlacement: (state) => {
      if (state.placementHistory.length === 0) return;
      const lastShipId = state.placementHistory.pop();
      const ship = state.playerShips.find((s) => s.id === lastShipId);
      if (ship) {
        ship.placed = false;
        ship.positions = [];
      }
    },

    startBattle: (state) => {
      const allPlaced = state.playerShips.every((ship) => ship.placed);
      if (!allPlaced) return;
      state.enemyShips = generateEnemyShips();
      state.phase = "battle";
      state.currentTurn = "player";
    },

    playerAttack: (state, action: PayloadAction<number>) => {
      const cellIndex = action.payload;
      if (state.playerShots[cellIndex]) return;
      const isHit = state.enemyShips.some((ship) =>
        ship.positions.includes(cellIndex),
      );
      state.playerShots[cellIndex] = isHit ? "hit" : "miss";
    },

    enemyAttack: (state, action: PayloadAction<number>) => {
      const cellIndex = action.payload;
      if (state.enemyShots[cellIndex]) return;
      const isHit = state.playerShips.some((ship) =>
        ship.positions.includes(cellIndex),
      );
      state.enemyShots[cellIndex] = isHit ? "hit" : "miss";
    },

    switchTurn: (state) => {
      state.currentTurn = state.currentTurn === "player" ? "enemy" : "player";
    },

    setGameOver: (state, action: PayloadAction<"player" | "enemy">) => {
      state.phase = "gameover";
      state.winner = action.payload;
    },

    resetBattle: (state) => {
      state.playerShips = initialPlayerShips.map((ship) => ({
        ...ship,
        positions: [],
        placed: false,
      }));
      state.enemyShips = [];
      state.playerShots = {};
      state.enemyShots = {};
      state.phase = "placement";
      state.currentTurn = "player";
      state.winner = null;
    },
  },
});

export const {
  setPlayerShipPosition,
  startBattle,
  playerAttack,
  enemyAttack,
  switchTurn,
  setGameOver,
  resetBattle,
  resetAllPlacements,
  cancelLastPlacement,
} = battleSlice.actions;

export default battleSlice.reducer;
