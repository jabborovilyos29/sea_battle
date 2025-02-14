import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { IconButton } from "@mui/material";
import RotateRightIcon from "@mui/icons-material/RotateRight";

interface DraggableShipProps {
  id: string;
  size: number;
}

const DraggableShip = ({ id, size }: DraggableShipProps) => {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { orientation, size },
  });

  const toggleOrientation = () => {
    setOrientation((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal",
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
      <div
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          gap: "2px",
          cursor: "grab",
        }}
        {...listeners}
        {...attributes}
      >
        {Array.from({ length: size }).map((_, index) => (
          <div
            key={index}
            style={{
              width: 30,
              height: 30,
              backgroundColor: "gray",
              border: "1px solid #000",
            }}
          />
        ))}
      </div>
      <IconButton
        onClick={toggleOrientation}
        size="small"
        title="Повернуть корабль"
      >
        <RotateRightIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default DraggableShip;
