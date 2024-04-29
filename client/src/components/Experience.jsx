import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";

import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState } from "react";
import { useGrid } from "../hooks/useGrid";
import { BusinessMan } from "./BusinessMan";
import { Item } from "./Item";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
export const Experience = () => {
  const [buildMode, setBuildMode] = useState(true);

  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [items, setItems] = useState(map.items); // [name, position, rotation]
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const { vector3ToGrid, gridToVector3 } = useGrid();

  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);

  const onPlaneClicked = (e) => {
    if (!buildMode) {
      const character = scene.getObjectByName(`character-${user}`);
      if (!character) {
        return;
      }
      socket.emit(
        "move",
        vector3ToGrid(character.position),
        vector3ToGrid(e.point)
      );
    } else {
      if (draggedItem !== null) {
        setItems((prev) => {
          const newItems = [...prev];
          newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
          return newItems;
        });
      }
      setDraggedItem(null);
    }
  };

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  // console.log(dragPosition);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />

      {(buildMode ? items : map.items).map((item, idx) => (
        <Item
          key={`${item.name}-${idx}`}
          item={item}
          onClick={() => {
            if (buildMode) {
              setDraggedItem((prev) => (prev === null ? idx : prev));
            }
          }}
          isDragging={draggedItem === idx}
          dragPosition={dragPosition}
        />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onPlaneClicked}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        onPointerMove={(e) => {
          if (!buildMode) {
            return;
          }
          const newPosition = vector3ToGrid(e.point);
          if (
            !dragPosition ||
            newPosition[0] !== dragPosition[0] ||
            newPosition[1] !== dragPosition[1]
          ) {
            setDragPosition(newPosition);
          }
        }}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      {!buildMode &&
        characters.map((character) => (
          <BusinessMan
            key={character.id}
            id={character.id}
            path={character.path}
            position={gridToVector3(character.position)}
            hairColor={character.hairColor}
            topColor={character.topColor}
            bottomColor={character.bottomColor}
          />
        ))}
    </>
  );
};
