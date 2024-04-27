import { Environment, OrbitControls } from "@react-three/drei";
import { BusinessMan } from "./BusinessMan";
import { AnimatedWoman } from "./AnimatedWoman";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      {/* <AnimatedWoman />
      <AnimatedWoman
        position-x={1}
        hairColor="green"
        topColor="tomato"
        bottomColor="orangered"
        feetColor="yellow"
      /> */}
      <BusinessMan />
      <BusinessMan
        position-x={1}
        hairColor="#545454"
        topColor="#c3b091"
        jacketColor="#2b2a29"
        bottmColor="#171614"
      />
    </>
  );
};
