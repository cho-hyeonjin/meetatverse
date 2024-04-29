import { useAtom } from "jotai";
import { itemsAtom } from "./SocketManager";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

export const Shop = () => {
  const [items] = useAtom(itemsAtom);

  const maxX = useRef(0);

  const shopItems = useMemo(() => {
    let x = 0;
    return Object.values(items).map((item, idx) => {
      const xPos = x;
      x += 1.5;
      maxX.current = x;

      return (
        <mesh key={idx} position-x={xPos}>
          <boxGeometry />
          <meshStandardMaterial color="pink" />
        </mesh>
      );
    });
  }, [items]);

  const shopContainer = useRef();
  const scrollData = useScroll();
  useFrame(() => {
    shopContainer.current.position.x = -scrollData.offset * maxX.current;
  });
  return <group ref={shopContainer}>{shopItems}</group>;
};
