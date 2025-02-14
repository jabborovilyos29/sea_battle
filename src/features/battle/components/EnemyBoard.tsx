import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { Box } from "@mui/material";
import { playerAttack, switchTurn } from "../slice/battleSlice";

const EnemyBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gridSize, playerShots, phase, currentTurn } = useSelector(
    (state: RootState) => state.battle,
  );

  const board = [];
  for (let row = 0; row < gridSize; row++) {
    const rowCells = [];
    for (let col = 0; col < gridSize; col++) {
      const cellIndex = row * gridSize + col;
      const shot = playerShots[cellIndex];
      let bg = "white";
      if (shot) {
        bg = shot === "hit" ? "red" : "blue";
      }
      rowCells.push(
        <Box
          key={`${row}-${col}`}
          onClick={() => {
            if (
              phase === "battle" &&
              currentTurn === "player" &&
              !playerShots[cellIndex]
            ) {
              dispatch(playerAttack(cellIndex));
              dispatch(switchTurn());
            }
          }}
          sx={{
            width: 30,
            height: 30,
            border: "1px solid black",
            backgroundColor: bg,
            display: "inline-block",
            cursor:
              phase === "battle" &&
              currentTurn === "player" &&
              !playerShots[cellIndex]
                ? "pointer"
                : "default",
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
      <h3>Поле противника</h3>
      {board}
    </Box>
  );
};

export default EnemyBoard;
