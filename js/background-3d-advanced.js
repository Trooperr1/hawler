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

  // Configuration
  const config = {
    particles: {
      count: window.innerWidth > 768 ? 8000 : 2000,
      size: 2.5,
      spread: 1000
    },
    shapes: {
      count: window.innerWidth > 768 ? 5 : 2
    },
    camera: {
      fov: 75,
      near: 1,
      far: 3000,
      posZ: 700
    }
  };

  // Initialize Three.js scene
  function init() {
    console.log('🔧 init() called');

    try {
      // Check if THREE is available
      if (typeof THREE === 'undefined') {
        console.error('❌ THREE is undefined - library not loaded');
        hideLoader();
        return false;
      }

      console.log('✅ THREE.js available, version:', THREE.REVISION);

      // Create container
      container = document.createElement('div');
      container.id = 'threejs-background';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '0';
      container.style.pointerEvents = 'none';
      document.body.insertBefore(container, document.body.firstChild);
      console.log('✅ Container created');

      // Create scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.0007);
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
        antialias: true,
        alpha: false
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000);
      container.appendChild(renderer.domElement);
      console.log('✅ Renderer created and added to container');

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xffffff, 1, 2000);
      pointLight1.position.set(500, 500, 500);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x6666ff, 0.7, 2000);
      pointLight2.position.set(-500, -500, -500);
      scene.add(pointLight2);
      console.log('✅ Lights added');

      // Create 3D elements
      createParticles();
      createShapes();
      createWave();
      createStars();

      // Event listeners
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onResize);

      // Hide loader and start
      hideLoader();
      animate();

      console.log('✨ 3D Background initialized successfully!');
      return true;

    } catch (error) {
      console.error('❌ Error in init():', error);
      console.error('Error stack:', error.stack);
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
        // Spiral galaxy
        const radius = Math.random() * config.particles.spread;
        const angle = Math.random() * Math.PI * 2;
        const spiral = angle + radius * 0.01;

        const x = Math.cos(spiral) * radius + (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 250;
        const z = Math.sin(spiral) * radius + (Math.random() - 0.5) * 100;

        positions.push(x, y, z);

        // Color
        const color = new THREE.Color();
        color.setHSL(0.6, 0.2, 0.8 + Math.random() * 0.2);
        colors.push(color.r, color.g, color.b);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: config.particles.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);
      console.log('✅ Particles created:', config.particles.count);
    } catch (error) {
      console.error('❌ Error creating particles:', error);
    }
  }

  // Create geometric shapes
  function createShapes() {
    try {
      const geometries = [
        new THREE.SphereGeometry(50, 32, 32),
        new THREE.TorusGeometry(40, 15, 16, 100),
        new THREE.OctahedronGeometry(50),
        new THREE.TetrahedronGeometry(50),
        new THREE.IcosahedronGeometry(45)
      ];

      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });

      for (let i = 0; i < config.shapes.count; i++) {
        const mesh = new THREE.Mesh(geometries[i % geometries.length], material.clone());

        mesh.position.x = (Math.random() - 0.5) * 1500;
        mesh.position.y = (Math.random() - 0.5) * 800;
        mesh.position.z = (Math.random() - 0.5) * 800 - 300;

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = 0.7 + Math.random();
        mesh.scale.set(scale, scale, scale);

        mesh.userData = {
          rotX: (Math.random() - 0.5) * 0.01,
          rotY: (Math.random() - 0.5) * 0.01,
          rotZ: (Math.random() - 0.5) * 0.01,
          floatSpeed: 0.0005 + Math.random() * 0.001,
          floatOffset: Math.random() * Math.PI * 2,
          initY: mesh.position.y
        };

        geometricShapes.push(mesh);
        scene.add(mesh);
      }
      console.log('✅ Shapes created:', config.shapes.count);
    } catch (error) {
      console.error('❌ Error creating shapes:', error);
    }
  }

  // Create wave mesh
  function createWave() {
    try {
      const geometry = new THREE.PlaneGeometry(2500, 2500, 60, 60);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      });

      waveMesh = new THREE.Mesh(geometry, material);
      waveMesh.rotation.x = -Math.PI / 2;
      waveMesh.position.y = -400;
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
    }
  }

  // Create stars
  function createStars() {
    try {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let i = 0; i < 1500; i++) {
        const x = (Math.random() - 0.5) * 3000;
        const y = (Math.random() - 0.5) * 3000;
        const z = (Math.random() - 0.5) * 3000;
        positions.push(x, y, z);

        const brightness = 0.7 + Math.random() * 0.3;
        colors.push(brightness, brightness, brightness);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
      });

      starfield = new THREE.Points(geometry, material);
      scene.add(starfield);
      console.log('✅ Stars created');
    } catch (error) {
      console.error('❌ Error creating stars:', error);
    }
  }

  // Mouse handler
  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.3;
    mouseY = (event.clientY - windowHalfY) * 0.3;
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
    animationId = requestAnimationFrame(animate);

    try {
      time += 0.01;

      // Rotate particles
      if (particleSystem) {
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x = Math.sin(time * 0.0005) * 0.1;
      }

      // Animate shapes
      geometricShapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotX;
        shape.rotation.y += shape.userData.rotY;
        shape.rotation.z += shape.userData.rotZ;
        shape.position.y = shape.userData.initY +
          Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 40;
      });

      // Animate wave
      if (waveMesh) {
        const positions = waveMesh.geometry.attributes.position;
        const originalZ = waveMesh.userData.originalZ;

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const wave = Math.sin(x * 0.01 + time * 0.5) * 12 +
                      Math.cos(y * 0.01 + time * 0.5) * 12;
          positions.setZ(i, originalZ[i] + wave);
        }
        positions.needsUpdate = true;
      }

      // Camera follow mouse
      if (camera) {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }

      // Render
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

    } catch (error) {
      console.error('❌ Error in animate():', error);
      cancelAnimationFrame(animationId);
    }
  }

  // Hide loader
  function hideLoader() {
    const loader = document.querySelector('.threejs-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }, 800);
    }
  }

  // Wait for Three.js and initialize
  function start() {
    if (typeof THREE !== 'undefined') {
      console.log('✅ THREE.js detected, starting initialization...');
      init();
    } else {
      console.log('⏳ Waiting for THREE.js...');
      setTimeout(start, 50);
    }
  }

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    setTimeout(start, 100);
  }

})();
