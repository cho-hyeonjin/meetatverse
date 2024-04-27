import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attatch="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
