import { applyColorToMesh } from '@lib/applyColorToMesh';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, forwardRef } from 'react';
import { Group, Mesh, Object3D, MeshStandardMaterial } from 'three';

interface CarModelProps {
  url: string;
  color?: string;
  finish?: 'glossy' | 'matte' | 'metallic';
  autoRotate?: boolean;
  rotationSpeed?: number;
  initialRotation?: number;
  position?: [number, number, number];
  scale?: number;
  headlightsOn?: boolean;
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
  scale = 1,
  headlightsOn = true
}) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<Group>(null!);

  const shouldColorObject = (name: string) => {
    name = name.toLowerCase();
    
    // Specifically exclude the top-level "car" object
    if (name === "car" || name === "car_body") {
      return false;
    }

    return (
      name.includes('body')
    );
  };

  const isHeadlight = (name: string) => {
    name = name.toLowerCase();
    return name.includes('light') || 
           name.includes('lamp') || 
           name.includes('bulb')
  };

  useEffect(() => {
    scene.position.set(position[0], position[1], position[2]);
    scene.scale.set(scale, scale, scale);
    scene.rotation.y = initialRotation;
    
    // Create an array to store all body parts
    const bodyParts: Mesh[] = [];
    
    const processObject = (object: Object3D) => {
      let foundAny = false;
      
      // Process the object if it's a mesh, OR process its children if the name matches
      if (shouldColorObject(object.name)) {
        // If it's a mesh, color it directly
        if (object instanceof Mesh) {
          bodyParts.push(object);
          applyColorToMesh(object, color, finish === 'matte');
          foundAny = true;
        }
        
        // Always check its children
        object.children.forEach(child => {
          if (child instanceof Mesh) {
            bodyParts.push(child);
            applyColorToMesh(child, color, finish === 'matte');
            foundAny = true;
          } else {
            // Process deeper for non-mesh children
            if (processObject(child)) {
              foundAny = true;
            }
          }
        });
      } else {
        // If name doesn't match, still process children as normal
        object.children.forEach(child => {
          if (processObject(child)) {
            foundAny = true;
          }
        });
      }
      
      return foundAny;
    };
    
    // Start processing from the scene root
    processObject(scene);

    // Handle headlights separately
    const processHeadlights = (object: Object3D) => {
      if (isHeadlight(object.name)) {
        if (object instanceof Mesh) {
          applyHeadlightMaterial(object, headlightsOn);
        }
      }
      
      // Always check children regardless of name
      object.children.forEach(child => processHeadlights(child));
    };
    
    processHeadlights(scene);
  }, [scene, initialRotation, position, scale, color, finish, headlightsOn]);

  // Apply color changes when color or finish props change
  useEffect(() => {
    // Recursive coloring function
    const colorObject = (object: Object3D) => {
      if (shouldColorObject(object.name)) {
        // If it's a mesh, color it directly
        if (object instanceof Mesh) {
          applyColorToMesh(object, color, finish === 'matte');
        }
        
        // Also process its children (they might be meshes)
        object.children.forEach(child => {
          if (child instanceof Mesh) {
            applyColorToMesh(child, color, finish === 'matte');
          } else {
            colorObject(child);
          }
        });
      } else {
        // Always process children
        object.children.forEach(colorObject);
      }
    };
    
    // Start coloring from scene root
    colorObject(scene);
  }, [color, finish, scene]);

  // Function to apply headlight material
  const applyHeadlightMaterial = (mesh: Mesh, isOn: boolean) => {
    if (mesh.material instanceof MeshStandardMaterial || Array.isArray(mesh.material)) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      
      materials.forEach(material => {
        if (material instanceof MeshStandardMaterial) {
          // Make headlights much brighter with higher intensity
          if (isOn) {
            // Preserve original color but make it emissive
            const baseColor = material.color.clone();
            material.emissive.copy(baseColor);
            material.emissiveIntensity = 2.5; // Much higher intensity
            
            // Make sure the material is visible
            material.transparent = true;
            material.opacity = 1;
            material.metalness = 0.4; // Less metallic to allow more light emission
            material.roughness = 0.2; // Smoother surface for better light reflection
          } else {
            material.emissive.set(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      });
    }
  };

  // Return the entire scene as a primitive
  return <primitive ref={modelRef} object={scene} />;
});

export default CarModel;
