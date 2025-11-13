// Generate placeholder images dynamically
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    const src = img.getAttribute('src');

    // Only create placeholder if image doesn't exist or path is relative
    if (src && src.startsWith('images/')) {
      const placeholder = createPlaceholder(img.alt || 'Image', img.width || 800, img.height || 600);
      img.src = placeholder;
      img.style.backgroundColor = '#0a0a0a';
    }
  });
});

function createPlaceholder(text, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Text
  ctx.fillStyle = '#cccccc';
  ctx.font = '20px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Dimensions
  ctx.font = '14px Montserrat, sans-serif';
  ctx.fillText(`${width} × ${height}`, width / 2, height / 2 + 30);

  return canvas.toDataURL();
}
