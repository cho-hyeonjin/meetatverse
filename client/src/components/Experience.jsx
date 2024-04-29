import { Environment, OrbitControls, useCursor } from "@react-three/drei";
import { BusinessMan } from "./BusinessMan";
import { useAtom } from "jotai";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import { useState } from "react";
import * as THREE from "three";
import { Item } from "./Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const { vector3ToGrid } = useGrid();

  const scene = useThree((state) => state.scene);
  const [user] = useAtom(userAtom);

  const onCharacterMove = (e) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }
    socket.emit(
      "move",
      vector3ToGrid(character.position),
      vector3ToGrid(e.point)
    );
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />

      {map.items.map((item, idx) => (
        <Item key={`${item.name}-${idx}`} item={item} />
      ))}
      {/* <Item name={"Couch"} />
      <Item name={"StepCubbyStorage"} />
      <Item name={"WoodTable"} /> */}

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onCharacterMove}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {characters.map((character) => (
        <BusinessMan
          key={character.id}
          id={character.id}
          position={
            new THREE.Vector3(
              character.position[0] + 1 / map.gridDivision / 2,
              0,
              character.position[1] + 1 / map.gridDivision / 2
            )
          }
          hairColor={character.hairColor}
          topColor={character.topColor}
          tieColor={character.tieColor}
          jacketColor={character.jacketColor}
          bottomColor={character.bottomColor}
          feetColor={character.feetColor}
        />
      ))}
    </>
  );
};
