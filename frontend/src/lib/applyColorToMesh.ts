import { Mesh } from "three";

// Helper function to apply color to a mesh
export const applyColorToMesh = (mesh: Mesh, colorHex: string, isMatte = false) => {
  if (!mesh.material) return;
  
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(mat => {
      if (mat.isMaterial) {
        // Apply to any material with a color property
        if ('color' in mat) {
          (mat as any).color.set(colorHex);
          
          // Apply matte properties if requested
          if (isMatte && 'roughness' in mat) {
            (mat as any).roughness = 0.9;  // High roughness for matte look
          }
          if (isMatte && 'metalness' in mat) {
            (mat as any).metalness = 0.1;  // Low metalness for matte look
          }
          if (isMatte && 'clearcoat' in mat) {
            (mat as any).clearcoat = 0.0;  // No clearcoat for matte
          }
          
          // Force material update
          (mat as any).needsUpdate = true;
        }
      }
    });
  } else if (mesh.material.isMaterial) {
    // Apply to any material with a color property
    if ('color' in mesh.material) {
      (mesh.material as any).color.set(colorHex);
      
      // Apply matte properties if requested
      if (isMatte && 'roughness' in mesh.material) {
        (mesh.material as any).roughness = 0.9;  // High roughness for matte look
      }
      if (isMatte && 'metalness' in mesh.material) {
        (mesh.material as any).metalness = 0.1;  // Low metalness for matte look
      }
      if (isMatte && 'clearcoat' in mesh.material) {
        (mesh.material as any).clearcoat = 0.0;  // No clearcoat for matte
      }
      
      mesh.material.needsUpdate = true;
    }
  }
};