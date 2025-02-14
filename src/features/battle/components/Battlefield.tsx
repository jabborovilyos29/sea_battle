import { Box, Typography } from "@mui/material";
import Cell from "./Cell";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface BattlefieldProps {
  hoveredPositions: number[];
}

const Battlefield = ({ hoveredPositions }: BattlefieldProps) => {
  const gridSize =
    useSelector((state: RootState) => state.battle.gridSize) || 10;
  const rows = [];

  for (let row = 0; row < gridSize; row++) {
    const cells = [];
    for (let col = 0; col < gridSize; col++) {
      cells.push(
        <Cell
          key={`${row}-${col}`}
          row={row}
          col={col}
          hoveredPositions={hoveredPositions}
        />,
      );
    }
    rows.push(
      <Box key={row} sx={{ display: "flex", lineHeight: 0 }}>
        {cells}
      </Box>,
    );
  }

  return (
    <Box sx={{ border: "2px solid green", padding: 1 }}>
      <Typography variant="h6">Поле для размещения</Typography>
      {rows.length > 0 ? (
        rows
      ) : (
        <Typography>Нет данных для отображения поля</Typography>
      )}
    </Box>
  );
};

export default Battlefield;
