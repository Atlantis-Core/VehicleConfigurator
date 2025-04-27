import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Group, Mesh, PerspectiveCamera } from 'three';

interface CarModelProps {
  url: string;
}

export function CarModel({ url }: CarModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<Group>(null!);
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  useEffect(() => {
    // Find camera in loaded model
    const importedCamera = scene.getObjectByName('Camera') as PerspectiveCamera;
  
    if (importedCamera) {
      console.log('Using camera from Blender model');
      
      // Copy camera position and rotation from the model
      perspectiveCamera.position.copy(importedCamera.position);
      perspectiveCamera.rotation.copy(importedCamera.rotation);
      
      // Make sure to update the projection matrix
      perspectiveCamera.updateProjectionMatrix();
    }
  }, [scene, perspectiveCamera]);

  // Return the entire scene as a primitive
  return <primitive ref={modelRef} object={scene} scale={1} />;
}
