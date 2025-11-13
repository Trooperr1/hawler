// JAFFSTUDIO - Advanced 3D Background with Three.js
// Professional Blender-quality 3D animations

(function() {
  'use strict';

  console.log('🎨 Background 3D Script loaded');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('⏭️  3D Background disabled: User prefers reduced motion');
    hideLoader();
    return;
  }

  // Three.js variables
  let scene, camera, renderer;
  let particleSystem, geometricShapes = [];
  let waveMesh, starfield, time = 0;
  let mouseX = 0, mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let container;
  let animationId;
  let initialized = false;

  // Configuration
  const config = {
    particles: {
      count: window.innerWidth > 768 ? 5000 : 1500,
      size: 3,
      spread: 800
    },
    shapes: {
      count: window.innerWidth > 768 ? 3 : 1
    },
    camera: {
      fov: 75,
      near: 1,
      far: 3000,
      posZ: 600
    }
  };

  // Show error message on page
  function showError(message) {
    console.error('❌ 3D Background Error:', message);

    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 14px;
      z-index: 99999;
      max-width: 400px;
    `;
    errorDiv.innerHTML = `<strong>3D Background Error:</strong><br>${message}`;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => errorDiv.remove(), 500);
      }
    }, 5000);
  }

  // Initialize Three.js scene
  function init() {
    console.log('🔧 init() called');

    try {
      // Check if THREE is available
      if (typeof THREE === 'undefined') {
        const msg = 'THREE.js library not loaded. Please check your internet connection.';
        console.error('❌', msg);
        showError(msg);
        hideLoader();
        return false;
      }

      console.log('✅ THREE.js available, version:', THREE.REVISION);

      // Test WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        const msg = 'WebGL not supported by your browser.';
        console.error('❌', msg);
        showError(msg);
        hideLoader();
        return false;
      }
      console.log('✅ WebGL supported');

      // Create container
      container = document.createElement('div');
      container.id = 'threejs-background';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background: #000000;
        pointer-events: none;
      `;
      document.body.insertBefore(container, document.body.firstChild);
      console.log('✅ Container created and inserted');

      // Create scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.0008);
      console.log('✅ Scene created');

      // Create camera
      camera = new THREE.PerspectiveCamera(
        config.camera.fov,
        window.innerWidth / window.innerHeight,
        config.camera.near,
        config.camera.far
      );
      camera.position.z = config.camera.posZ;
      console.log('✅ Camera created at z:', config.camera.posZ);

      // Create renderer
      renderer = new THREE.WebGLRenderer({
        antialias: window.innerWidth > 768,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 1);
      container.appendChild(renderer.domElement);
      console.log('✅ Renderer created and canvas added');

      // Verify renderer element is visible
      const canvas2 = renderer.domElement;
      console.log('Canvas dimensions:', canvas2.width, 'x', canvas2.height);
      console.log('Canvas in DOM:', document.body.contains(canvas2));

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xffffff, 1.2, 2000);
      pointLight1.position.set(500, 500, 500);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x6666ff, 0.8, 2000);
      pointLight2.position.set(-500, -500, -500);
      scene.add(pointLight2);
      console.log('✅ Lights added');

      // Create 3D elements
      createParticles();
      createShapes();
      createWave();
      createStars();

      // Event listeners
      document.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('resize', onResize);

      // Mark as initialized
      initialized = true;

      // Hide loader and start
      hideLoader();
      animate();

      console.log('✨ 3D Background initialized successfully!');

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 255, 0, 0.9);
        color: black;
        padding: 15px 20px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        z-index: 99999;
        font-weight: bold;
      `;
      successDiv.textContent = '✅ 3D Background Active';
      document.body.appendChild(successDiv);
      setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => successDiv.remove(), 500);
      }, 3000);

      return true;

    } catch (error) {
      console.error('❌ Error in init():', error);
      console.error('Error stack:', error.stack);
      showError(`Initialization failed: ${error.message}`);
      hideLoader();
      return false;
    }
  }

  // Create particle system
  function createParticles() {
    try {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let i = 0; i < config.particles.count; i++) {
        // Spiral galaxy pattern
        const radius = Math.random() * config.particles.spread;
        const angle = Math.random() * Math.PI * 2;
        const spiral = angle + radius * 0.01;

        const x = Math.cos(spiral) * radius + (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 300;
        const z = Math.sin(spiral) * radius + (Math.random() - 0.5) * 100;

        positions.push(x, y, z);

        // Color gradient from white to light blue
        const color = new THREE.Color();
        const hue = 0.6 + Math.random() * 0.1;
        const saturation = 0.1 + Math.random() * 0.2;
        const lightness = 0.7 + Math.random() * 0.3;
        color.setHSL(hue, saturation, lightness);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: config.particles.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);
      console.log('✅ Particles created:', config.particles.count);
    } catch (error) {
      console.error('❌ Error creating particles:', error);
      showError(`Particle creation failed: ${error.message}`);
    }
  }

  // Create geometric shapes
  function createShapes() {
    try {
      const geometries = [
        new THREE.OctahedronGeometry(60, 0),
        new THREE.TorusGeometry(50, 20, 16, 100),
        new THREE.IcosahedronGeometry(55, 0)
      ];

      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        shininess: 100
      });

      for (let i = 0; i < config.shapes.count; i++) {
        const mesh = new THREE.Mesh(geometries[i % geometries.length], material.clone());

        mesh.position.x = (Math.random() - 0.5) * 1200;
        mesh.position.y = (Math.random() - 0.5) * 600;
        mesh.position.z = (Math.random() - 0.5) * 600 - 200;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = 0.8 + Math.random() * 0.6;
        mesh.scale.set(scale, scale, scale);

        mesh.userData = {
          rotX: (Math.random() - 0.5) * 0.008,
          rotY: (Math.random() - 0.5) * 0.008,
          rotZ: (Math.random() - 0.5) * 0.008,
          floatSpeed: 0.0003 + Math.random() * 0.0007,
          floatOffset: Math.random() * Math.PI * 2,
          initY: mesh.position.y
        };

        geometricShapes.push(mesh);
        scene.add(mesh);
      }
      console.log('✅ Shapes created:', config.shapes.count);
    } catch (error) {
      console.error('❌ Error creating shapes:', error);
      showError(`Shape creation failed: ${error.message}`);
    }
  }

  // Create wave mesh
  function createWave() {
    try {
      const geometry = new THREE.PlaneGeometry(2000, 2000, 50, 50);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        shininess: 50
      });

      waveMesh = new THREE.Mesh(geometry, material);
      waveMesh.rotation.x = -Math.PI / 2;
      waveMesh.position.y = -350;
      scene.add(waveMesh);

      // Store original Z positions
      const positions = waveMesh.geometry.attributes.position;
      waveMesh.userData.originalZ = [];
      for (let i = 0; i < positions.count; i++) {
        waveMesh.userData.originalZ.push(positions.getZ(i));
      }
      console.log('✅ Wave created');
    } catch (error) {
      console.error('❌ Error creating wave:', error);
      showError(`Wave creation failed: ${error.message}`);
    }
  }

  // Create stars
  function createStars() {
    try {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2500;
        const y = (Math.random() - 0.5) * 2500;
        const z = (Math.random() - 0.5) * 2500;
        positions.push(x, y, z);

        const brightness = 0.6 + Math.random() * 0.4;
        colors.push(brightness, brightness, brightness);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
      });

      starfield = new THREE.Points(geometry, material);
      scene.add(starfield);
      console.log('✅ Stars created: 2000');
    } catch (error) {
      console.error('❌ Error creating stars:', error);
      showError(`Star creation failed: ${error.message}`);
    }
  }

  // Mouse handler
  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.2;
    mouseY = (event.clientY - windowHalfY) * 0.2;
  }

  // Resize handler
  function onResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  // Animation loop
  function animate() {
    if (!initialized) return;

    animationId = requestAnimationFrame(animate);

    try {
      time += 0.008;

      // Rotate particles
      if (particleSystem) {
        particleSystem.rotation.y += 0.0003;
        particleSystem.rotation.x = Math.sin(time * 0.0003) * 0.08;
      }

      // Animate shapes
      geometricShapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotX;
        shape.rotation.y += shape.userData.rotY;
        shape.rotation.z += shape.userData.rotZ;
        shape.position.y = shape.userData.initY +
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 30;
      });

      // Animate wave
      if (waveMesh) {
        const positions = waveMesh.geometry.attributes.position;
        const originalZ = waveMesh.userData.originalZ;

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const wave = Math.sin(x * 0.008 + time * 0.4) * 10 +
                      Math.cos(y * 0.008 + time * 0.4) * 10;
          positions.setZ(i, originalZ[i] + wave);
        }
        positions.needsUpdate = true;
      }

      // Camera follow mouse with smooth damping
      if (camera) {
        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
      }

      // Render scene
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

    } catch (error) {
      console.error('❌ Error in animate():', error);
      showError(`Animation error: ${error.message}`);
      cancelAnimationFrame(animationId);
    }
  }

  // Hide loader
  function hideLoader() {
    const loader = document.querySelector('.threejs-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 800);
    }
  }

  // Wait for Three.js and initialize
  let attempts = 0;
  const maxAttempts = 100; // 5 seconds

  function start() {
    attempts++;

    if (typeof THREE !== 'undefined') {
      console.log('✅ THREE.js detected, starting initialization...');
      init();
    } else if (attempts < maxAttempts) {
      console.log(`⏳ Waiting for THREE.js... (attempt ${attempts}/${maxAttempts})`);
      setTimeout(start, 50);
    } else {
      const msg = 'THREE.js failed to load after 5 seconds. Check your internet connection.';
      console.error('❌', msg);
      showError(msg);
      hideLoader();
    }
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM loaded, starting 3D background...');
      setTimeout(start, 100);
    });
  } else {
    console.log('📄 DOM already loaded, starting 3D background...');
    setTimeout(start, 100);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    if (scene) {
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  });

})();
