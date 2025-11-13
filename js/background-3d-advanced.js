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

  // Three.js will be loaded from CDN
  let scene, camera, renderer, composer;
  let particleSystem, geometricShapes = [];
  let waveMesh, time = 0;
  let mouseX = 0, mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  // Configuration
  const config = {
    particles: {
      count: window.innerWidth > 768 ? 15000 : 5000,
      size: 2,
      color: 0xffffff,
      spread: 1000
    },
    shapes: {
      count: window.innerWidth > 768 ? 8 : 4,
      types: ['sphere', 'torus', 'octahedron', 'tetrahedron', 'torusknot']
    },
    camera: {
      fov: 75,
      near: 0.1,
      far: 3000,
      position: { x: 0, y: 0, z: 500 }
    },
    animation: {
      rotationSpeed: 0.001,
      waveSpeed: 0.0005,
      cameraMovement: 0.05
    }
  };

  // Initialize Three.js scene
  function init() {
    // Create container
    const container = document.createElement('div');
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
      antialias: window.innerWidth > 768,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1.5 ? 1.5 : window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8888ff, 0.5, 1000);
    pointLight2.position.set(-500, -500, -500);
    scene.add(pointLight2);

    // Create particle galaxy
    createParticleGalaxy();

    // Create animated geometric shapes
    createGeometricShapes();

    // Create wave mesh
    createWaveMesh();

    // Add stars in background
    createStarfield();

    // Mouse movement listener
    document.addEventListener('mousemove', onMouseMove);

    // Window resize listener
    window.addEventListener('resize', onWindowResize);

    // Hide loader
    hideLoader();

    // Start animation
    animate();

    console.log('✨ Advanced 3D Background initialized with Three.js');
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

      // Color gradient (white to light blue)
      const color = new THREE.Color();
      color.setHSL(0.6, 0.2, 0.9 + Math.random() * 0.1);
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
  }

  // Create animated geometric shapes
  function createGeometricShapes() {
    const geometries = {
      sphere: new THREE.SphereGeometry(50, 32, 32),
      torus: new THREE.TorusGeometry(40, 15, 16, 100),
      octahedron: new THREE.OctahedronGeometry(50, 0),
      tetrahedron: new THREE.TetrahedronGeometry(50, 0),
      torusknot: new THREE.TorusKnotGeometry(30, 10, 100, 16)
    };

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < config.shapes.count; i++) {
      const shapeType = config.shapes.types[Math.floor(Math.random() * config.shapes.types.length)];
      const geometry = geometries[shapeType];
      const mesh = new THREE.Mesh(geometry, material.clone());

      // Random position
      mesh.position.x = (Math.random() - 0.5) * 1500;
      mesh.position.y = (Math.random() - 0.5) * 1500;
      mesh.position.z = (Math.random() - 0.5) * 1000;

      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      // Random scale
      const scale = 0.5 + Math.random() * 1.5;
      mesh.scale.set(scale, scale, scale);

      // Store animation properties
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: 0.0005 + Math.random() * 0.001,
        floatOffset: Math.random() * Math.PI * 2
      };

      geometricShapes.push(mesh);
      scene.add(mesh);
    }
  }

  // Create wave mesh
  function createWaveMesh() {
    const geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide
    });

    waveMesh = new THREE.Mesh(geometry, material);
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.y = -300;
    scene.add(waveMesh);

    // Store original positions
    const positions = waveMesh.geometry.attributes.position;
    waveMesh.userData.originalPositions = [];
    for (let i = 0; i < positions.count; i++) {
      waveMesh.userData.originalPositions.push(positions.getZ(i));
    }
  }

  // Create starfield
  function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 3000;
      const y = (Math.random() - 0.5) * 3000;
      const z = (Math.random() - 0.5) * 3000;
      positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      transparent: true,
      opacity: 0.6
    });

    const starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
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
    geometricShapes.forEach((shape, index) => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.rotation.z += shape.userData.rotationSpeed.z;

      // Float up and down
      shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.5;
    });

    // Animate wave mesh
    if (waveMesh) {
      const positions = waveMesh.geometry.attributes.position;
      const originalPositions = waveMesh.userData.originalPositions;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        const waveX = Math.sin(x * 0.01 + time * 0.5) * 20;
        const waveY = Math.cos(y * 0.01 + time * 0.5) * 20;

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
      }, 1000);
    }
  }

  // Wait for Three.js to load, then initialize
  function waitForThreeJS() {
    if (typeof THREE !== 'undefined') {
      init();
    } else {
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
