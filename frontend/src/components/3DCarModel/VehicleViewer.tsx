import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { CarModel } from './CarModel';
import { getImageUrl } from '@lib/getImageUrl';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { IoRefreshOutline, IoPauseOutline, IoHandRightOutline } from "react-icons/io5";
import styles from './VehicleViewer.module.css';
import { Color } from '../../types/types';
import { generateRadialGradient } from './helpers/generateRadialGradient';

// Types
interface TurntableProps {
  autoRotate: boolean;
  autoRotateSpeed: number;
  children: React.ReactNode;
}

interface VehicleViewerProps {
  modelPath: string;
  color?: Color;
  height?: string;
  width?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

// Turntable Component for Vehicle Rotation
function Turntable({ autoRotate, autoRotateSpeed, children }: TurntableProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Set initial rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = 2.440;
    }
  }, []);

  // Handle auto-rotation
  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += autoRotateSpeed * 0.01;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Main VehicleViewer Component
const VehicleViewer = ({
  modelPath,
  color,
  height = '100%',
  width = '100%',
  autoRotate: initialAutoRotate = false,
  autoRotateSpeed = 0.5,
}: VehicleViewerProps) => {
  // State and refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [showTutorial, setShowTutorial] = useState(true);
  const [interacted, setInteracted] = useState(false);

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
    setInteracted(true);
    setShowTutorial(false);
  };

  // Handle user interaction
  const handleInteraction = () => {
    if (!interacted) {
      setInteracted(true);
      // Hide tutorial after interaction
      setTimeout(() => setShowTutorial(false), 2000);
    }
  };

  // Handle aspect ratio and tutorial timing
  useEffect(() => {
    const updateAspectRatio = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setAspectRatio(clientWidth / clientHeight);
      }
    };

    // Initial aspect ratio calculation
    updateAspectRatio();

    // Set up event listeners
    window.addEventListener('resize', updateAspectRatio);

    // Auto-hide tutorial after timeout
    const tutorialTimer = setTimeout(() => setShowTutorial(false), 4000);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateAspectRatio);
      clearTimeout(tutorialTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width,
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* 3D Canvas */}
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        style={{ background: 'rgb(245, 245, 245)' }}
        shadows="soft"
        camera={{
          position: [-3.5, 2.2, 5.5],
          fov: 35,
          aspect: aspectRatio,
          near: 0.1,
          far: 100
        }}
      >
        {/* Environment & Background */}
        <Environment
          files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_08_2k.hdr"
          background={false}
        />
        <color attach="background" args={["rgb(245, 245, 245)"]} />
        <fogExp2 attach="fog" args={["rgb(245, 245, 245)", 0.05]} />

        {/* Professional Studio Lighting */}
        <directionalLight
          position={[5, 6, 8]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
          color="#ffffff"
        />
        <directionalLight position={[-5, 4, 2]} intensity={0.6} color="#f0f8ff" />
        <directionalLight position={[0, 3, -10]} intensity={0.5} color="#f5f5ff" />
        <spotLight position={[0, -2, 0]} angle={0.7} penumbra={1} intensity={0.3} distance={10} color="#f0f0f0" />
        <spotLight
          position={[0, 8, 4]}
          angle={0.3}
          penumbra={0.7}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          distance={15}
          decay={2}
        />
        <spotLight position={[-4, 2, -2]} angle={0.5} penumbra={0.5} intensity={0.3} distance={20} color="#e0f0ff" />
        <ambientLight intensity={0.2} />

        {/* Studio Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} envMapIntensity={0.7} />
        </mesh>

        {/* Circular Rotation Indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.009, 0]}>
          <ringGeometry args={[3.2, 3.3, 64]} />
          <meshBasicMaterial color={autoRotate ? "#4a90e2" : "#9cb3d8"} transparent opacity={0.7} />
        </mesh>

        {/* Shadows */}
        <ContactShadows
          position={[0, -0.005, 0]}
          opacity={0.6}
          width={15}
          height={15}
          blur={3}
          far={10}
          resolution={1024}
          color="#000000"
          frames={1}
          scale={10}
        />

        {/* Floor Gradient */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.009, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            transparent
            opacity={0.2}
            color="#3060a0"
            toneMapped={false}
            depthWrite={false}
          >
            <canvasTexture attach="map" args={[generateRadialGradient(1024)]} />
          </meshBasicMaterial>
        </mesh>

        {/* Controls */}
        <OrbitControls
          enableRotate={true}
          enableZoom={true}
          enablePan={false}
          zoomSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={2.5}
          maxDistance={4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3 + 0.4}
          target={[0, 0.4, 0]}
        />

        {/* Vehicle */}
        <Turntable autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed}>
          {modelPath && (
            <CarModel
              url={getImageUrl(modelPath)}
              color={color?.hexCode || '#000000'}
              finish={color?.type || 'matte'}
              position={[0.5, 0.1, 8.4]}
              scale={0.8}
              initialRotation={Math.PI}
            />
          )}
        </Turntable>
      </Canvas>

      {/* UI Controls */}
      <div
        className={styles.controlsContainer}
      >
        <button
          className={styles.rotateToggle}
          onClick={toggleAutoRotate}
          aria-label={autoRotate ? "Pause rotation" : "Start rotation"}
          type="button"
        >
          {autoRotate
            ? <IoPauseOutline className={styles.rotateIcon} />
            : <IoRefreshOutline className={styles.rotateIcon} />
          }
        </button>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className={styles.tutorialOverlay}>
          <div className={styles.tutorialBox}>
            <IoHandRightOutline className={styles.tutorialIcon} />
            <p>Drag to rotate | Scroll to zoom</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleViewer;