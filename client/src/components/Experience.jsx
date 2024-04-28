import { Environment, OrbitControls, useCursor } from "@react-three/drei";
import { BusinessMan } from "./BusinessMan";
import { useAtom } from "jotai";
import { charactersAtom, socket } from "./SocketManager";
import { useState } from "react";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerEnter={() => setOnFloor(true)}
        onPointLeave={() => setOnFloor(false)}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial />
      </mesh>
      {characters.map((character) => (
        <BusinessMan
          key={character.id}
          position={character.position}
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
