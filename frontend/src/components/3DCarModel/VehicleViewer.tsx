import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { CarModel } from './CarModel';
import { getImageUrl } from '@lib/getImageUrl';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { IoRefreshOutline, IoPauseOutline } from "react-icons/io5";
import styles from './VehicleViewer.module.css';

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
  autoRotate: initialAutoRotate = true,
  autoRotateSpeed = 0.5,
}: VehicleViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);

  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };

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
        position: 'relative',
      }}
    >
      <Canvas
        gl={{ antialias: true }}
        style={{ background: '#ffffff' }}
        shadows="soft"
        camera={{
          position: [-3.5, 2.2, 5.5],
          fov: 35,
          aspect: aspectRatio,
        }}
      >
        <Environment preset="apartment" background={false} />
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
        <ambientLight intensity={0.1} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          width={10}
          height={10}
          blur={2}
          far={10}
          resolution={1024}
          color="#000000"
        />
        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={false}
          zoomSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={2.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3 + 0.4}
          target={[0, 0.4, 0]}
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
      <button
        className={styles.rotateToggle}
        onClick={toggleAutoRotate}
        aria-label={autoRotate ? "Pause rotation" : "Start rotation"}
      >
        {autoRotate
          ? <IoPauseOutline className={styles.rotateIcon} />
          : <IoRefreshOutline className={styles.rotateIcon} />
        }
      </button>
    </div>
  );
};

export default VehicleViewer;