import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import DraggableShip from "./DraggableShip";

const ShipsList: React.FC = () => {
  const ships = useSelector((state: RootState) => state.battle.playerShips);
  const notPlacedShips = ships.filter((ship) => !ship.placed);

  return (
    <div>
      {notPlacedShips.map((ship) => (
        <DraggableShip key={ship.id} id={ship.id} size={ship.size} />
      ))}
    </div>
  );
};

export default ShipsList;
