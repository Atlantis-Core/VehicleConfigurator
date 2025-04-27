import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Mesh, PerspectiveCamera } from 'three';
import { Light, Object3D } from 'three';

export function CarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<Mesh>(null!);
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;
  const carObject = scene.getObjectByName('Car_Model');

  useEffect(() => {
    console.log('Scene graph:', scene);
    if (carObject) {
    }
  }, [scene]);

  useEffect(() => {
    console.log('Scene graph:', scene);
  
    scene.traverse((child) => {
      if ((child as any).isCamera) {
        console.log('Found camera:', child.name);
      }
    });

    const importedCamera = scene.getObjectByName('Camera') as PerspectiveCamera;
  
    if (importedCamera) {
      console.log('Found imported camera:', importedCamera);
  
      perspectiveCamera.position.copy(importedCamera.position);
      perspectiveCamera.rotation.copy(importedCamera.rotation);
  
      perspectiveCamera.updateProjectionMatrix();
    } else {
      console.warn('No imported camera found');
    }
  }, [scene, perspectiveCamera]);

  return <primitive ref={modelRef} object={scene} scale={1} />;
}