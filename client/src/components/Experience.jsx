import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";

import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useGrid } from "../hooks/useGrid";
import { BusinessMan } from "./BusinessMan";
import { Item } from "./Item";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import {
  buildModeAtom,
  draggedItemAtom,
  draggedItemRotationAtom,
  shopModeAtom,
} from "./UI";
import { Shop } from "./Shop";
export const Experience = () => {
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [characters] = useAtom(charactersAtom);
  const [map] = useAtom(mapAtom);
  const [items, setItems] = useState(map.items);
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
        if (canDrop) {
          setItems((prev) => {
            const newItems = [...prev];
            newItems[draggedItem].gridPosition = vector3ToGrid(e.point);
            newItems[draggedItem].rotation = draggedItemRotation;
            return newItems;
          });
        }
        setDraggedItem(null);
      }
    }
  };

  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );
  const [dragPosition, setDragPosition] = useState(null);
  const [canDrop, setCanDrop] = useState(false);

  useEffect(() => {
    if (!draggedItem) {
      return;
    }
    const item = items[draggedItem];
    const width =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[1]
        : item.size[0];
    const height =
      draggedItemRotation === 1 || draggedItemRotation === 3
        ? item.size[0]
        : item.size[1];

    let droppable = true;

    /** item 이 bounds를 벗어나면 drop이 불가능하도록 */
    if (
      dragPosition[0] < 0 ||
      dragPosition[0] + width > map.size[0] * map.gridDivision
    ) {
      droppable = false;
    }
    if (
      dragPosition[1] < 0 ||
      dragPosition[1] + height > map.size[1] * map.gridDivision
    ) {
      droppable = false;
    }

    /** item이 다른 item과 충돌(겹치는 부분)하는 경우 drop이 불가능하도록 */
    if (!item.walkable && !item.wall) {
      items.forEach((otherItem, idx) => {
        // 자기 자신은 감지하지 않도록 예외처리
        if (idx === draggedItem) {
          return;
        }

        // 벽과 바닥은 감지하지 않도록 예외처리
        if (otherItem.walkable || otherItem.wall) {
          return;
        }

        // 너비&높이 겹침 여부 확인
        const otherWidth =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[1]
            : otherItem.size[0];
        const otherHeight =
          otherItem.rotation === 1 || otherItem.rotation === 3
            ? otherItem.size[0]
            : otherItem.size[1];
        if (
          dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
          dragPosition[0] + width > otherItem.gridPosition[0] &&
          dragPosition[1] < otherItem.gridPosition[1] + otherHeight &&
          dragPosition[1] + height > otherItem.gridPosition[1]
        ) {
          droppable = false;
        }
      });
    }

    setCanDrop(droppable);
  }, [dragPosition, draggedItem, items, draggedItemRotation]);
  const controls = useRef();
  const state = useThree((state) => state);

  useEffect(() => {
    if (buildMode) {
      setItems(map?.items || []);
      state.camera.position.set(8, 8, 8);
      controls.current.target.set(0, 0, 0);
    } else {
      socket.emit("itemsUpdate", items);
    }
  }, [buildMode]);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[-4, 4, -4]}
        castShadow
        intensity={0.35}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach={"shadow-camera"}
          args={[-map.size[0], map.size[1], 10, -10]}
          far={map.size[0] + map.size[1]}
        />
      </directionalLight>
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        screenSpacePanning={false}
      />

      {shopMode && <Shop />}

      {!shopMode &&
        (buildMode ? items : map.items).map((item, idx) => (
          <Item
            key={`${item.name}-${idx}`}
            item={item}
            onClick={() => {
              if (buildMode) {
                setDraggedItem((prev) => (prev === null ? idx : prev));
                setDraggedItemRotation(item.rotation || 0);
              }
            }}
            isDragging={draggedItem === idx}
            dragPosition={dragPosition}
            dragRotation={draggedItemRotation}
            canDrop={canDrop}
          />
        ))}
      {!shopMode && (
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
          receiveShadow
        >
          <planeGeometry args={map.size} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      )}
      {buildMode && !shopMode && (
        <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      )}
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
