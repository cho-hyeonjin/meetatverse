import { Environment, OrbitControls } from "@react-three/drei";
import { BusinessMan } from "./BusinessMan";
import { useAtom } from "jotai";
import { charactersAtom } from "./SocketManager";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />

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
