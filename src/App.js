import * as THREE from "three";
import { Suspense, useRef, useState, useEffect } from "react";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, CameraShake, Environment, ContactShadows } from "@react-three/drei";
import Model from "./Model";

RectAreaLightUniformsLib.init();

function Light() {
  const ref = useRef();
  useFrame((_) => (ref.current.rotation.x = _.clock.elapsedTime));
  return (
    <group ref={ref}>
      <rectAreaLight
        width={15}
        height={100}
        position={[30, 30, -10]}
        intensity={5}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </group>
  );
}

function Rig() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, mouse } = useThree();
  useFrame(() => camera.position.lerp(vec.set(mouse.x * 2, 20, 60), 0.05));
  return (
    <CameraShake
      maxYaw={0.01}
      maxPitch={0.01}
      maxRoll={0.01}
      yawFrequency={0.5}
      pitchFrequency={0.5}
      rollFrequency={0.4}
    />
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsLoaded(true);
    }
  }, [progress]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <h1 style={{ color: "white", fontFamily: "Arial" }}>
            Loading: {Math.round(progress)}%
          </h1>
        </div>
      )}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 160], fov: 20 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Model
            position={[0, 0, 0]}
            rotation={[0, -0.5, 0]}
            onProgress={(progress) => setProgress(progress)}
          />
          <spotLight
            position={[50, 50, -30]}
            castShadow
            intensity={2}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-50, 10, -30]} color="red" intensity={10000} />
          <directionalLight
            position={[0, 10, 0]}
            color="white"
            intensity={2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Light />
          <ContactShadows
            position={[0, 0, 0]}
            scale={40}
            blur={0.9}
            opacity={0.6}
            far={10}
          />
          <Environment preset="night" />
          <Rig />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

export default App;