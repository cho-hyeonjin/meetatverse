import { Environment, OrbitControls } from "@react-three/drei";
import { BusinessMan } from "./BusinessMan";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      <BusinessMan />
    </>
  );
};
