import { Mesh, MeshStandardMaterial } from "three";

// Helper function to apply color to a mesh
export const applyColorToMesh = (mesh: Mesh, color: string, isMatte: boolean = false) => {
  if (!mesh.material) return;
  
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(mat => {
      if (mat instanceof MeshStandardMaterial) {
        mat.color.set(color);
        
        // Adjust material properties based on finish
        if ('metalness' in mat) mat.metalness = isMatte ? 0.1 : 0.7;
        if ('roughness' in mat) mat.roughness = isMatte ? 0.8 : 0.2;
      }
    });
  } else if (mesh.material instanceof MeshStandardMaterial) {
    mesh.material.color.set(color);
    
    // Adjust material properties based on finish
    if ('metalness' in mesh.material) mesh.material.metalness = isMatte ? 0.1 : 0.7;
    if ('roughness' in mesh.material) mesh.material.roughness = isMatte ? 0.8 : 0.2;
  }
};