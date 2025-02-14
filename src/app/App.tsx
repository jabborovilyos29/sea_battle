import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { DndContext, DragEndEvent, DragMoveEvent } from "@dnd-kit/core";
import { Box, Button } from "@mui/material";
import ShipsList from "../features/battle/components/ShipsList";
import Battlefield from "../features/battle/components/Battlefield";
import {
  setPlayerShipPosition,
  resetAllPlacements,
  cancelLastPlacement,
} from "../features/battle/slice/battleSlice";

export default function App() {
  const dispatch = useDispatch();
  const phase =
    useSelector((state: RootState) => state.battle.phase) || "placement";
  const gridSize =
    useSelector((state: RootState) => state.battle.gridSize) || 10;

  const [hoveredPositions, setHoveredPositions] = useState<number[]>([]);

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
              <Button variant="contained" color="primary">
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
      </Box>
    </DndContext>
  );
}
