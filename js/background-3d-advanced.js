// JAFFSTUDIO - Advanced 3D Background with Three.js
// Professional Blender-quality 3D animations

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('3D Background disabled: User prefers reduced motion');
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

  // Configuration
  const config = {
    particles: {
      count: window.innerWidth > 768 ? 10000 : 3000,
      size: 2,
      color: 0xffffff,
      spread: 1000
    },
    shapes: {
      count: window.innerWidth > 768 ? 6 : 3,
      types: ['sphere', 'torus', 'octahedron', 'tetrahedron']
    },
    camera: {
      fov: 75,
      near: 0.1,
      far: 3000,
      position: { x: 0, y: 0, z: 600 }
    },
    animation: {
      rotationSpeed: 0.001,
      cameraMovement: 0.05
    }
  };

  // Initialize Three.js scene
  function init() {
    console.log('🎨 Initializing Advanced 3D Background...');

    // Create container
    container = document.createElement('div');
    container.id = 'threejs-background';
    document.body.insertBefore(container, document.body.firstChild);

    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Create camera
    camera = new THREE.PerspectiveCamera(
      config.camera.fov,
      window.innerWidth / window.innerHeight,
      config.camera.near,
      config.camera.far
    );
    camera.position.set(
      config.camera.position.x,
      config.camera.position.y,
      config.camera.position.z
    );

    // Create renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 2000);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4444ff, 0.6, 2000);
    pointLight2.position.set(-500, -500, -500);
    scene.add(pointLight2);

    // Create all 3D elements
    createParticleGalaxy();
    createGeometricShapes();
    createWaveMesh();
    createStarfield();

    // Event listeners
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Hide loader
    hideLoader();

    // Start animation
    animate();

    console.log('✨ Advanced 3D Background initialized successfully!');
  }

  // Create particle galaxy
  function createParticleGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < config.particles.count; i++) {
      // Spiral galaxy shape
      const radius = Math.random() * config.particles.spread;
      const angle = Math.random() * Math.PI * 2;
      const spiral = angle + radius * 0.01;

      const x = Math.cos(spiral) * radius + (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 200;
      const z = Math.sin(spiral) * radius + (Math.random() - 0.5) * 100;

      positions.push(x, y, z);

      // Color gradient
      const color = new THREE.Color();
      color.setHSL(0.6, 0.2, 0.85 + Math.random() * 0.15);
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
      depthWrite: false,
      sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    console.log('✓ Particle galaxy created');
  }

  // Create animated geometric shapes
  function createGeometricShapes() {
    const geometries = {
      sphere: new THREE.SphereGeometry(50, 32, 32),
      torus: new THREE.TorusGeometry(40, 15, 16, 100),
      octahedron: new THREE.OctahedronGeometry(50, 0),
      tetrahedron: new THREE.TetrahedronGeometry(50, 0)
    };

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      shininess: 100
    });

    for (let i = 0; i < config.shapes.count; i++) {
      const shapeType = config.shapes.types[i % config.shapes.types.length];
      const geometry = geometries[shapeType];
      const mesh = new THREE.Mesh(geometry, material.clone());

      // Random position
      mesh.position.x = (Math.random() - 0.5) * 1500;
      mesh.position.y = (Math.random() - 0.5) * 1000;
      mesh.position.z = (Math.random() - 0.5) * 800 - 200;

      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      // Random scale
      const scale = 0.6 + Math.random() * 1.2;
      mesh.scale.set(scale, scale, scale);

      // Store animation properties
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015
        },
        floatSpeed: 0.0005 + Math.random() * 0.0015,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y
      };

      geometricShapes.push(mesh);
      scene.add(mesh);
    }
    console.log('✓ Geometric shapes created:', config.shapes.count);
  }

  // Create wave mesh
  function createWaveMesh() {
    const geometry = new THREE.PlaneGeometry(2500, 2500, 80, 80);
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

    // Store original positions
    const positions = waveMesh.geometry.attributes.position;
    waveMesh.userData.originalPositions = [];
    for (let i = 0; i < positions.count; i++) {
      waveMesh.userData.originalPositions.push(positions.getZ(i));
    }
    console.log('✓ Wave mesh created');
  }

  // Create starfield
  function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 3000;
      const y = (Math.random() - 0.5) * 3000;
      const z = (Math.random() - 0.5) * 3000;
      positions.push(x, y, z);

      // Slight color variation
      const brightness = 0.7 + Math.random() * 0.3;
      colors.push(brightness, brightness, brightness);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
    console.log('✓ Starfield created');
  }

  // Mouse move handler
  function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
  }

  // Window resize handler
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    time += 0.01;

    // Rotate particle galaxy
    if (particleSystem) {
      particleSystem.rotation.y += config.animation.rotationSpeed;
      particleSystem.rotation.x = Math.sin(time * 0.001) * 0.2;
    }

    // Animate geometric shapes
    geometricShapes.forEach((shape) => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.rotation.z += shape.userData.rotationSpeed.z;

      // Float up and down
      shape.position.y = shape.userData.initialY +
        Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 50;
    });

    // Animate wave mesh
    if (waveMesh) {
      const positions = waveMesh.geometry.attributes.position;
      const originalPositions = waveMesh.userData.originalPositions;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        const waveX = Math.sin(x * 0.01 + time * 0.5) * 15;
        const waveY = Math.cos(y * 0.01 + time * 0.5) * 15;

        positions.setZ(i, originalPositions[i] + waveX + waveY);
      }

      positions.needsUpdate = true;
    }

    // Smooth camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * config.animation.cameraMovement;
    camera.position.y += (-mouseY - camera.position.y) * config.animation.cameraMovement;
    camera.lookAt(scene.position);

    // Render
    renderer.render(scene, camera);
  }

  // Hide loader
  function hideLoader() {
    const loader = document.querySelector('.threejs-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, 800);
    }
  }

  // Wait for Three.js to load, then initialize
  function waitForThreeJS() {
    if (typeof THREE !== 'undefined') {
      try {
        init();
      } catch (error) {
        console.error('❌ Error initializing 3D background:', error);
        hideLoader();
      }
    } else {
      console.log('⏳ Waiting for Three.js to load...');
      setTimeout(waitForThreeJS, 100);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForThreeJS);
  } else {
    waitForThreeJS();
  }

})();
