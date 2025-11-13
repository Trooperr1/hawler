// Simple test to verify Three.js loads
console.log('=== THREE.JS TEST ===');
console.log('Script loaded at:', new Date().toISOString());

function testThreeJS() {
  if (typeof THREE !== 'undefined') {
    console.log('✅ THREE.js is loaded!');
    console.log('THREE version:', THREE.REVISION);

    // Create a simple test scene
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();

      console.log('✅ Basic Three.js objects created successfully');
      console.log('Renderer:', renderer);

      // Clean up
      renderer.dispose();

      return true;
    } catch (error) {
      console.error('❌ Error creating Three.js objects:', error);
      return false;
    }
  } else {
    console.log('❌ THREE.js is NOT loaded');
    return false;
  }
}

// Test immediately
setTimeout(() => {
  console.log('Testing Three.js after 100ms...');
  testThreeJS();
}, 100);

// Test after 1 second
setTimeout(() => {
  console.log('Testing Three.js after 1 second...');
  testThreeJS();
}, 1000);

// Test after 3 seconds
setTimeout(() => {
  console.log('Testing Three.js after 3 seconds...');
  if (testThreeJS()) {
    console.log('✅ THREE.js is ready to use!');
  } else {
    console.error('❌ THREE.js failed to load after 3 seconds');
  }
}, 3000);
