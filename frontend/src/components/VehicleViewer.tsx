import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshReflectorMaterial } from '@react-three/drei';
import { useState } from 'react';
import { CarModel } from './CarModel';
import { getImageUrl } from '@lib/getImageUrl';
import { Environment } from '@react-three/drei';

function VehicleViewer() {
  const [color, setColor] = useState('black');

  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        gl={{ alpha: true }}
        style={{ background: 'black' }}
        shadows
        camera={{ position: [0, 2, 10], fov: 50 }}
      >
        {/* Global ambient light (soft, everywhere) */}
        <ambientLight intensity={0.8} />

        <Environment preset="warehouse" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} /> {/* <-- Bigger */}
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={2048}
            mixBlur={0.8}
            mixStrength={60}
            roughness={0.2}
            depthScale={0.5}
            minDepthThreshold={0.2}
            color="#111111"
            metalness={0.8}
          />
        </mesh>

        {/* Fake sun */}
        <directionalLight
          position={[5, 10, 5]}
          intensity={3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={3} />
        <pointLight position={[0, 5, 5]} intensity={2} />
        <pointLight position={[0, 2, -5]} intensity={1.5} />

        {/* Front spotLight */}
        <spotLight
          position={[0, -15, 5]}
          angle={0.7}
          penumbra={0.7}
          intensity={2000}
          color={'#ffffff'}
          castShadow
        />

        {/* Back spotLight */}
        <spotLight
          position={[0, 5, 5]}
          angle={0.9}
          penumbra={0.7}
          intensity={1500}
          color={'#ffffff'}
          castShadow
        />

        {/* Your car model */}
        <CarModel url={getImageUrl("/public/models/uploads-files-4940163-Studio+V1-+Textures+Packed.glb")} />
      </Canvas>


      {/* Color change buttons */}
      <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <button onClick={() => setColor('red')}>Red</button>
        <button onClick={() => setColor('white')}>White</button>
        <button onClick={() => setColor('blue')}>Blue</button>
      </div>
    </div>
  );
}

export default VehicleViewer;