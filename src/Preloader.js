import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Preloader() {
  const cubeRef = useRef();

  // Animate the cube by rotating it
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.05;
      cubeRef.current.rotation.y += 0.05;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} /> {/* Size of the cube */}
      <meshStandardMaterial color="orange" /> {/* Color of the cube */}
    </mesh>
  );
}

export default Preloader;