import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { CarModel } from './CarModel';
import { getImageUrl } from '@lib/getImageUrl';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

// Turntable component that rotates with the car
interface TurntableProps {
  autoRotate: boolean;
  autoRotateSpeed: number;
  children: React.ReactNode;
}

function Turntable({ autoRotate, autoRotateSpeed, children }: TurntableProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += autoRotateSpeed * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, -0.065, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.1, 64]} />
        <meshPhysicalMaterial
          color="#333"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {children}
    </group>
  );
}

interface VehicleViewerProps {
  modelPath: string;
  color: string;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

const VehicleViewer = ({
  modelPath,
  color,
  height = '100%',
  width = '100%',
  autoRotate = true,
  autoRotateSpeed = 0.5
}: VehicleViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  useEffect(() => {
    const updateAspectRatio = () => {
      if (containerRef.current) {
        setAspectRatio(
          containerRef.current.clientWidth / containerRef.current.clientHeight
        );
      }
    };

    updateAspectRatio();
    window.addEventListener('resize', updateAspectRatio);

    return () => {
      window.removeEventListener('resize', updateAspectRatio);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: height,
        width: width,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        shadows="soft"
        camera={{
          position: [-5, 2.5, 7],
          fov: 35,
          aspect: aspectRatio
        }}
      >
        <Environment
          preset="city"
          background={false}
        />
        <ambientLight intensity={0.3} />

        <directionalLight
          position={[10, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />

        <ambientLight intensity={0.6} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />

        <hemisphereLight
          color="#ffffff"
          groundColor="#666666"
          intensity={0.8}
        />

        <spotLight
          position={[0, 5, -5]}
          intensity={0.8}
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.7}
          width={20}
          height={20}
          blur={2}
          far={10}
          resolution={1024}
          color="#000000"
        />

        <OrbitControls
          enableRotate={true}
          enablePan={false}
          enableZoom={true}
          minDistance={1}
          maxDistance={5}
          target={[0, 0.4, 0]}
          minPolarAngle={Math.PI / 2.3 - 0.1}
          maxPolarAngle={Math.PI / 2.3 + 0.1}
        />

        <Turntable autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed}>
          <group position={[0, 0, 0]}>
            {modelPath && (
              <CarModel
                url={getImageUrl(modelPath)}
                color={color}
                position={[0.5, 0, 8.4]}
                scale={0.8}
                initialRotation={Math.PI}
              />
            )}
          </group>
        </Turntable>
      </Canvas>
    </div>
  );
}

export default VehicleViewer;