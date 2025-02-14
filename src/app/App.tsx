import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { DndContext, DragEndEvent, DragMoveEvent } from "@dnd-kit/core";
import { Box, Button } from "@mui/material";
import ShipsList from "../features/battle/components/ShipsList";
import Battlefield from "../features/battle/components/Battlefield";
import {
  setPlayerShipPosition,
  resetAllPlacements,
  cancelLastPlacement,
  startBattle,
  resetBattle,
  switchTurn,
  enemyAttack,
  setGameOver,
} from "../features/battle/slice/battleSlice";
import EnemyBoard from "../features/battle/components/EnemyBoard";
import PlayerBoard from "../features/battle/components/PlayerBoard";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  const [hoveredPositions, setHoveredPositions] = useState<number[]>([]);
  const {
    phase,
    currentTurn,
    playerShots,
    enemyShots,
    playerShips,
    enemyShips,
    winner,
    gridSize,
  } = useSelector((state: RootState) => state.battle);

  const checkWinCondition = () => {
    const enemyAllSunk =
      enemyShips.length > 0 &&
      enemyShips.every((ship) =>
        ship.positions.every((pos) => playerShots[pos] === "hit"),
      );

    const playerAllSunk = playerShips.every((ship) =>
      ship.positions.every((pos) => enemyShots[pos] === "hit"),
    );
    if (enemyAllSunk) {
      dispatch(setGameOver("player"));
    } else if (playerAllSunk) {
      dispatch(setGameOver("enemy"));
    }
  };

  useEffect(() => {
    if (phase === "battle") {
      checkWinCondition();
    }
  }, [playerShots, enemyShots, phase]);

  useEffect(() => {
    if (phase === "battle" && currentTurn === "enemy") {
      const timer = setTimeout(() => {
        const totalCells = 100;
        const availableCells: number[] = [];
        for (let i = 0; i < totalCells; i++) {
          if (!enemyShots[i]) {
            availableCells.push(i);
          }
        }
        if (availableCells.length === 0) return;
        const cellIndex =
          availableCells[Math.floor(Math.random() * availableCells.length)];
        dispatch(enemyAttack(cellIndex));
        dispatch(switchTurn());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, phase, enemyShots, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setHoveredPositions([]);

    if (
      over &&
      over.id &&
      typeof over.id === "string" &&
      over.id.startsWith("cell-")
    ) {
      const parts = over.id.split("-");
      const row = parseInt(parts[1], 10);
      const col = parseInt(parts[2], 10);
      const shipId = active.id as string;
      const data = active.data.current as
        | { orientation: "horizontal" | "vertical"; size: number }
        | undefined;
      if (!data) return;
      const { orientation, size } = data;

      let positions: number[] = [];
      if (orientation === "horizontal") {
        if (col + size > gridSize) return;
        for (let i = 0; i < size; i++) {
          positions.push(row * gridSize + (col + i));
        }
      } else {
        if (row + size > gridSize) return;
        for (let i = 0; i < size; i++) {
          positions.push((row + i) * gridSize + col);
        }
      }
      dispatch(setPlayerShipPosition({ shipId, positions }));
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (
      over &&
      over.id &&
      typeof over.id === "string" &&
      over.id.startsWith("cell-")
    ) {
      const parts = over.id.split("-");
      const row = parseInt(parts[1], 10);
      const col = parseInt(parts[2], 10);
      const data = active.data.current as
        | { orientation: "horizontal" | "vertical"; size: number }
        | undefined;
      if (!data) {
        setHoveredPositions([]);
        return;
      }
      const { orientation, size } = data;
      let positions: number[] = [];
      if (orientation === "horizontal") {
        if (col + size > gridSize) {
          setHoveredPositions([]);
          return;
        }
        for (let i = 0; i < size; i++) {
          positions.push(row * gridSize + (col + i));
        }
      } else {
        if (row + size > gridSize) {
          setHoveredPositions([]);
          return;
        }
        for (let i = 0; i < size; i++) {
          positions.push((row + i) * gridSize + col);
        }
      }
      setHoveredPositions(positions);
    } else {
      setHoveredPositions([]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
      <Box sx={{ p: 2 }}>
        {phase === "placement" && (
          <Box>
            <h2>Размещение ваших кораблей</h2>
            <ShipsList />
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                onClick={() => dispatch(startBattle())}
                disabled={!playerShips.every((ship) => ship.placed)}
                variant="contained"
                color="primary"
              >
                Начать бой
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(resetAllPlacements())}
              >
                Сбросить все
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(cancelLastPlacement())}
              >
                Назад
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Battlefield hoveredPositions={hoveredPositions} />
            </Box>
          </Box>
        )}
        {phase === "battle" && (
          <Box>
            <h2>Бой</h2>
            <Box sx={{ display: "flex", gap: 4 }}>
              <EnemyBoard />
              <PlayerBoard />
            </Box>
            <Box sx={{ mt: 2 }}>
              <div>Ход: {currentTurn === "player" ? "Ваш" : "Противника"}</div>
            </Box>
          </Box>
        )}
        {phase === "gameover" && (
          <Box>
            <h2>Игра окончена</h2>
            <div>Победитель: {winner === "player" ? "Вы" : "Противник"}</div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(resetBattle())}
              sx={{ mt: 2 }}
            >
              Новая игра
            </Button>
          </Box>
        )}
      </Box>
    </DndContext>
  );
}
