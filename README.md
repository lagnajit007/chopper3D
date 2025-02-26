# 3D Model Viewer with React Three Fiber

This project uses React Three Fiber to render a 3D Helicopter model in the browser. It includes a loading percentage preloader, soft contact shadows, and interactive orbit controls, all set against a night environment.

## What You’ll Need
- **Node.js**: Install from [nodejs.org](https://nodejs.org/). Check with:
  ```bash
  node -v
  npm -v
  ```
- **A Code Editor**: Like [VS Code](https://code.visualstudio.com/).
- **Your 3D Model**: A `helicopter.glb` file (exported from Blender or similar).

## Setup Steps

### 1. Create the Project
Open your terminal and run:
```bash
npx create-react-app chopper
cd chopper
```

### 2. Install 3D Libraries
In the `chopper` folder, install these packages:
```bash
npm install three @react-three/fiber @react-three/drei
```

### 3. Add Your 3D Model
- Make a `models` folder in `public`:
  ```bash
  mkdir public/models
  ```
- Copy your `helicopter.glb` file to `public/models/helicopter.glb`.  
  (If you don’t have one, export a simple model from Blender as a `.glb` file.)

### 4. Replace Code Files
Update these files in the `src` folder:

#### `src/App.js`
```jsx
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
      <rectAreaLight width={15} height={100} position={[30, 30, -10]} intensity={5} onUpdate={(self) => self.lookAt(0, 0, 0)} />
    </group>
  );
}

function Rig() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, mouse } = useThree();
  useFrame(() => camera.position.lerp(vec.set(mouse.x * 2, 20, 60), 0.05));
  return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4} />;
}

function App() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (progress >= 100) setIsLoaded(true);
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
          <h1 style={{ color: "white", fontFamily: "Arial" }}>Loading: {Math.round(progress)}%</h1>
        </div>
      )}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 160], fov: 20 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Model position={[0, 0, 0]} rotation={[0, -0.5, 0]} onProgress={(progress) => setProgress(progress)} />
          <spotLight position={[50, 50, -30]} castShadow intensity={2} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[-50, 10, -30]} color="red" intensity={10000} />
          <directionalLight position={[0, 10, 0]} color="white" intensity={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <Light />
          <ContactShadows position={[0, 0, 0]} scale={40} blur={0.9} opacity={0.6} far={10} />
          <Environment preset="night" />
          <Rig />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

export default App;
```

#### `src/Model.js`
```jsx
import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function Model({ onProgress, ...props }) {
  const manager = new THREE.LoadingManager();
  
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    if (onProgress) onProgress(progress);
  };

  const gltf = useLoader(GLTFLoader, "/models/helicopter.glb", (loader) => {
    loader.manager = manager;
  });

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} {...props} />;
}

export default Model;
```

### 5. Start the App
Run this command in the `chopper` folder:
```bash
npm start
```
- Your browser should open to `http://localhost:3000`.
- You’ll see a “Loading: X%” screen, then the 3D helicopter model once it loads.

## How It Works
- **Preloader**: Shows a percentage while `helicopter.glb` loads.
- **Model**: Displays the helicopter with shadows enabled.
- **Controls**: Rotate with left-click, zoom with scroll, pan with right-click.

## If Something Goes Wrong
- **Model Not Showing**: Check `public/models/helicopter.glb` exists.
- **Percentage Stuck**: Clear your browser cache or test with a slow network (DevTools > Network > Slow 3G).
- **No Shadows**: Increase light `intensity` (e.g., `spotLight intensity={2000}`).

## Want to Change It?
- Swap `helicopter.glb` with your own GLB file in `public/models/`.
- Edit `preset="night"` in `<Environment>` to `"sunset"`, `"city"`, etc.
- Adjust `ContactShadows` `blur` or `opacity` for shadow style.

Enjoy your 3D helicopter viewer!

---

