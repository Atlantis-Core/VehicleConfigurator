export function generateRadialGradient(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    
    gradient.addColorStop(0, 'rgba(48, 96, 160, 0.3)');
    gradient.addColorStop(0.7, 'rgba(48, 96, 160, 0.1)');
    gradient.addColorStop(1, 'rgba(48, 96, 160, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  
  return canvas;
}