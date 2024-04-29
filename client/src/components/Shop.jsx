import { useAtom } from "jotai";
import { itemsAtom } from "./SocketManager";
import { useMemo } from "react";

export const Shop = () => {
  const [items] = useAtom(itemsAtom);

  const shopItems = useMemo(() => {
    let x = 0;
    return Object.values(items).map((item, idx) => {
      const xPos = x;
      x += 1.5;

      return (
        <mesh key={idx} position-x={xPos}>
          <boxGeometry />
          <meshStandardMaterial color="pink" />
        </mesh>
      );
    });
  }, [items]);

  return <group>{shopItems}</group>;
};
