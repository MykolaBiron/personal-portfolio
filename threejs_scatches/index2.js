import * as THREE from 'three';

// --- CONFIGURATION ---
const SPHERE_RADIUS = 2.5; // Slightly larger sphere than before
const ICON_SIZE = 0.65;      // Size of each icon

// --- 1. SETUP THE SCENE ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  alpha: true, 
  antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. THE SKILL DATA ---
// Replace the 'path/to/icon.png' with your actual image paths.
const mySkills = [
  { name: 'React',      iconUrl: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'AWS',        iconUrl: 'https://cdn.simpleicons.org/aws/FF9900' },
  { name: 'JavaScript', iconUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'Node.js',    iconUrl: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Three.js',   iconUrl: 'https://cdn.simpleicons.org/threedotjs/ffffff' }, // Using white for visibility
  {name: 'Tensorflow', iconUrl: 'https://cdn.simpleicons.org/tensorflow/FF6F00'},
  { name: 'PyTorch',   iconUrl: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
  { name: 'Python',     iconUrl: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'Docker',     iconUrl: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Git',        iconUrl: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'Java',       iconUrl: 'https://cdn.simpleicons.org/java/007396' },
  { name: 'Pandas',     iconUrl: 'https://cdn.simpleicons.org/pandas/150458' },
  {name: 'PostgresQL', iconUrl: 'https://cdn.simpleicons.org/postgresql/336791'},
  {name: 'C++', iconUrl: 'https://cdn.simpleicons.org/cplusplus/00599C'},
  {name: 'linux', iconUrl: 'https://cdn.simpleicons.org/linux/000000'},
  {name: 'SpringBoot', iconUrl: 'https://cdn.simpleicons.org/springboot/6DB33F'},
];

// --- 3. CREATE THE CORE SPHERE GROUP ---
const sphereGroup = new THREE.Group();
scene.add(sphereGroup);

// Geometry (Icosahedron for clean triangular faces)
const geometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 1);

// The Solid Surface (Transparent Black)
const surfaceMaterial = new THREE.MeshPhongMaterial({ 
  color: 0x111111, 
  transparent: true, 
  opacity: 0.6,
  flatShading: true,
  side: THREE.DoubleSide,
  depthWrite: false, // Essential to see back-side lines
});
const sphereSurface = new THREE.Mesh(geometry, surfaceMaterial);
sphereGroup.add(sphereSurface);

// The Triangular Grid (Wireframe)
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({ 
  color: 0x442211, 
  transparent: true,
  opacity: 0.3
});
const sphereLines = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
sphereGroup.add(sphereLines);

// --- 4. POPULATE THE SKILL ICONS (SPRITES) ---

const textureLoader = new THREE.TextureLoader();

/**
 * Utility: Creates a Sprite from a image URL
 */
function createSprite(iconUrl) {
  const texture = textureLoader.load(iconUrl);
  // Optional: texture.anisotropy = 16; // for cleaner look at extreme angles
  
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(ICON_SIZE, ICON_SIZE, 1);
  return sprite;
}

// Group to hold all sprites
const iconsGroup = new THREE.Group();
scene.add(iconsGroup); // IMPORTANT: Add directly to scene so they don't 'lean' when the main sphere rotates

// Function to calculate and place sprites
function placeIconsOnSphere() {
  const N = mySkills.length;
  const GOLDEN_RATIO = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323

  for (let i = 0; i < N; i++) {
    // 1. Half-step offset keeps points away from the exact top/bottom poles.
    const y = 1 - (2 * (i + 0.5)) / N;
    const radius = Math.sqrt(1 - y * y);

    const theta = GOLDEN_RATIO * i; // Golden angle increment

    // 2. Map to 3D Cartesian coordinates (x,y,z) on the sphere's surface
    const x = Math.cos(theta) * radius * SPHERE_RADIUS;
    const z = Math.sin(theta) * radius * SPHERE_RADIUS;

    // 3. Create and position the Sprite
    const skill = mySkills[i];
    const sprite = createSprite(skill.iconUrl);
    
    // We add a slight offset so they 'float' just above the surface
    const FLOAT_OFFSET = 1.05; 
    sprite.position.set(x * FLOAT_OFFSET, y * SPHERE_RADIUS * FLOAT_OFFSET, z * FLOAT_OFFSET);
    
    // 4. Attach a name data field (for later interaction like hovering)
    sprite.userData = { skillName: skill.name };
    
    iconsGroup.add(sprite);
  }
}

placeIconsOnSphere();

// --- 5. LIGHTING ---
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// --- 6. ANIMATION LOOP ---
camera.position.z = 8; // Pull camera back to see the whole sphere

function animate() {
  requestAnimationFrame(animate);
  sphereGroup.rotation.z = 0.1; // Rotate the main sphere core
  iconsGroup.rotation.z = 0.1; // Also rotate the icons group so they follow the movement,

  iconsGroup.children.forEach((sprite) => {
    // 1. Get the sprite's position relative to the camera
    const vector = new THREE.Vector3();
    sprite.getWorldPosition(vector);
    
    // 2. Calculate distance or simply use the Z-value
    // Since camera is at Z=8, a sprite at Z=2.5 is 'front', Z=-2.5 is 'back'
    // Map Z-range [-2.5, 2.5] to Opacity range [0.1, 1.0]
    const minZ = -SPHERE_RADIUS;
    const maxZ = SPHERE_RADIUS;
    
    let opacity = (vector.z - minZ) / (maxZ - minZ);
    
    // 3. Clamp the value so it doesn't go below 0.1 or above 1.0
    opacity = Math.max(0.1, Math.min(1.0, opacity));
    
    // 4. Apply to material
    sprite.material.opacity = opacity;
  });
  
  // Rotate the main sphere core
  sphereGroup.rotation.y += 0.003;
  
  // Also rotate the icons group so they follow the movement,
  // but they will maintain their billboarding facing the camera.
  iconsGroup.rotation.y += 0.003;
  
  renderer.render(scene, camera);
}

// Window resizing handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.toneMapping = THREE.NoToneMapping;

animate();