import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function Model({ onProgress, ...props }) {
  const manager = new THREE.LoadingManager();
  
  // Set up progress tracking
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    if (onProgress) onProgress(progress);
  };

  const gltf = useLoader(GLTFLoader, "/models/helicopter.glb", (loader) => {
    loader.manager = manager; // Assign our custom manager to the loader
  });

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} scale ={[0.1,0.1,0.1]} {...props} />;
}

export default Model;