import { Canvas } from '@react-three/fiber';
import { Environment, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { CarModel } from './CarModel';
import { getImageUrl } from '@lib/getImageUrl';
import { useState, useRef, useEffect } from 'react';

interface VehicleViewerProps {
  modelPath: string;
  color: string;
  height?: string;
  width?: string;
}

const VehicleViewer = ({ 
  modelPath, 
  color, 
  height = '500px', 
  width = '100%' 
}: VehicleViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState(16/9);

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
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        style={{ background: 'black' }}
        shadows
        camera={{ 
          position: [0, 5, 10], 
          fov: 40,
          aspect: aspectRatio
        }}
      >
        {/* Environment and global lighting */}
        <Environment preset="warehouse" />
        <ambientLight intensity={0.8} />
        
        {/* Main directional light (sun) */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Additional lights for better details */}
        <pointLight position={[0, 5, 5]} intensity={2} />
        <pointLight position={[0, 2, -5]} intensity={1.5} />

        {/* Reflective floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={1024}  // Reduced for better performance
            mixBlur={0.8}
            mixStrength={60}
            roughness={1}
            depthScale={0.5}
            minDepthThreshold={0.2}
            color="#111111"
            metalness={1}
          />
        </mesh>

        {/* Controls for user interaction */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={14}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Car model */}
        {modelPath && <CarModel url={getImageUrl(modelPath)} />}
      </Canvas>
    </div>
  );
}

export default VehicleViewer;