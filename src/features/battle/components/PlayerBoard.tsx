import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Box } from "@mui/material";

const PlayerBoard = () => {
  const { gridSize, playerShips, enemyShots } = useSelector(
    (state: RootState) => state.battle,
  );

  const board = [];
  for (let row = 0; row < gridSize; row++) {
    const rowCells = [];
    for (let col = 0; col < gridSize; col++) {
      const cellIndex = row * gridSize + col;
      const hasShip = playerShips.some((ship) =>
        ship.positions.includes(cellIndex),
      );
      const shot = enemyShots[cellIndex];
      let bg = hasShip ? "#ccc" : "white";
      if (shot) {
        bg = shot === "hit" ? "red" : "blue";
      }
      rowCells.push(
        <Box
          key={`${row}-${col}`}
          sx={{
            width: 30,
            height: 30,
            border: "1px solid black",
            backgroundColor: bg,
            display: "inline-block",
          }}
        />,
      );
    }
    board.push(
      <Box key={row} sx={{ lineHeight: 0 }}>
        {rowCells}
      </Box>,
    );
  }

  return (
    <Box>
      <h3>Ваше поле</h3>
      {board}
    </Box>
  );
};

export default PlayerBoard;
