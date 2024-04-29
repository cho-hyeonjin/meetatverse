import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../hooks/useGrid";
import { userAtom } from "./SocketManager";

const MOVEMENT_SPEED = 0.032;

export function Avatar({
  hairColor = "#3b3025",
  topColor = "#ebebeb",
  tieColor = "#30364C",
  jacketColor = "#191970",
  bottomColor = "#ffffff",
  feetColor = "#1E1E24",
  id,
  avatarUrl = "https://models.readyplayer.me/662b9db756fac7283df7ec13.glb",
  ...props
}) {
  const position = useMemo(() => props.position, []);
  const avatar = useRef();
  const [path, setPath] = useState();
  const { gridToVector3 } = useGrid();

  useEffect(() => {
    const path = [];
    props.path?.forEach((gridPosition) => {
      path.push(gridToVector3(gridPosition));
    });
    setPath(path);
  }, [props.path]);

  const group = useRef();
  const { scene } = useGLTF(avatarUrl);
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone);

  const { animations: walkAnimation } = useGLTF("/animations/M_Walk_001.glb");
  const { animations: idleAnimation } = useGLTF(
    "/animations/M_Standing_Idle_001.glb"
  );

  const { actions } = useAnimations(
    [walkAnimation[0], idleAnimation[0]],
    avatar
  );
  const [animation, setAnimation] = useState("M_Standing_Idle_001");

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation]);

  const [user] = useAtom(userAtom);

  useFrame((state) => {
    const hips = avatar.current.getObjectByName("Hips");
    hips.position.set(0, hips.position.y, 0);
    if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(path[0])
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(path[0]);
      setAnimation("M_Walk_001");
    } else if (path?.length) {
      path.shift();
    } else {
      setAnimation("M_Standing_Idle_001");
    }
    if (id === user) {
      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }
  });

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
      name={`character-${id}`}
    >
      <primitive object={clone} ref={avatar} />
    </group>
  );
}

useGLTF.preload("/animations/M_Walk_001.glb");
useGLTF.preload("/animations/M_Standing_Idle_001.glb");
