import { Box } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface CellProps {
  row: number;
  col: number;
  hoveredPositions: number[];
}

const Cell = ({ row, col, hoveredPositions }: CellProps) => {
  const droppableId = `cell-${row}-${col}`;
  const { setNodeRef } = useDroppable({ id: droppableId });

  const gridSize =
    useSelector((state: RootState) => state.battle.gridSize) || 10;
  const cellIndex = row * gridSize + col;

  const playerShips = useSelector(
    (state: RootState) => state.battle.playerShips,
  );
  const isOccupied = playerShips.some(
    (ship) => ship.placed && ship.positions.includes(cellIndex),
  );

  let bgColor = "white";
  if (hoveredPositions.includes(cellIndex)) {
    bgColor = "lightblue";
  }
  if (isOccupied) {
    bgColor = "gray";
  }

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 30,
        height: 30,
        border: "1px solid black",
        backgroundColor: bgColor,
      }}
    />
  );
};

export default Cell;
