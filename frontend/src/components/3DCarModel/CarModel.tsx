import { applyColorToMesh } from '@lib/applyColorToMesh';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState, forwardRef } from 'react';
import { Group, Mesh } from 'three';

interface CarModelProps {
  url: string;
  color?: string;
  finish?: 'glossy' | 'matte' | 'metallic';
  autoRotate?: boolean;
  rotationSpeed?: number;
  initialRotation?: number;
  position?: [number, number, number];
  scale?: number;
}

export interface CarModelHandle {
  changeColor: (color: string, finish?: 'glossy' | 'matte' | 'metallic') => void;
}

export const CarModel = forwardRef<CarModelHandle, CarModelProps>(({ 
  url, 
  color = '#FFFFFF',
  finish = 'glossy',
  initialRotation = -0.03,
  position = [0, 0, 0],
  scale = 1
}, ref) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<Group>(null!);
  const carBodyRef = useRef<Mesh | null>(null);
  const [carBodyFound, setCarBodyFound] = useState(false);

  useEffect(() => {
    scene.position.set(position[0], position[1], position[2]);
    scene.scale.set(scale, scale, scale);
    scene.rotation.y = initialRotation;
    
    setCarBodyFound(false);
    
    scene.traverse((object) => {
      if (object.name.includes('bodywork')) {
        
        // Only handle meshes
        if (object instanceof Mesh) {
          carBodyRef.current = object;
          setCarBodyFound(true);
          
          // Apply initial color immediately
          applyColorToMesh(object, color, finish === 'matte');
        }
      }
    });
    
    if (!carBodyFound) {
      console.warn('No car body found. Available objects:');
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          console.log(obj.name);
        }
      });
    }
    
  }, [scene, initialRotation, position, scale, color, finish]);

  // Apply color changes when color or finish prop changes
  useEffect(() => {
    if (carBodyRef.current && carBodyFound) {
      applyColorToMesh(carBodyRef.current, color, finish === 'matte');
    }
  }, [color, carBodyFound, finish]);

  // Return the entire scene as a primitive
  return <primitive ref={modelRef} object={scene} />;
});

export default CarModel;
