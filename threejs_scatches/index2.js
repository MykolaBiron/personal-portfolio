import * as THREE from 'three'

const renderer = new THREE.WebGLRenderer({ antialias: true })
const w = window.innerWidth
const h = window.innerHeight
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
camera.position.set(0, 0, 8)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#050308')

// skills to show
const skillImages = [
  { label: 'Python', url: '../images/python-logo.png' },
  { label: 'Java', url: '../images/java.png' },
  { label: 'Docker', url: '../images/docker.png' },
  { label: 'JavaScript', url: '../images/js_logo.png' },
  { label: 'PyTorch', url: '../images/pytorch.png' },
]

const orbitRadiusX = 3
const orbitRadiusY = 2.2
const orbitRadiusZ = 3

// core sphere and wireframe network
const coreGroup = new THREE.Group()
scene.add(coreGroup)

const glowGeom = new THREE.SphereGeometry(2.4, 48, 48)
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xffb577,
  transparent: true,
  opacity: 0.08,
  blending: THREE.AdditiveBlending,
})
const glowMesh = new THREE.Mesh(glowGeom, glowMat)
coreGroup.add(glowMesh)

const solidGeom = new THREE.SphereGeometry(2.15, 64, 64)
const solidMat = new THREE.MeshStandardMaterial({
  color: 0x0f0c18,
  metalness: 0.1,
  roughness: 0.5,
  transparent: true,
  opacity: 0.8,
})
const solidMesh = new THREE.Mesh(solidGeom, solidMat)
coreGroup.add(solidMesh)

const wireGeom = new THREE.IcosahedronGeometry(2.1, 2)
const wireEdges = new THREE.EdgesGeometry(wireGeom)
const wireMat = new THREE.LineBasicMaterial({
  color: 0xff7448,
  transparent: true,
  opacity: 0.45,
})
const wireframe = new THREE.LineSegments(wireEdges, wireMat)
coreGroup.add(wireframe)

const connectLines = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.05, 3)),
  new THREE.LineBasicMaterial({
    color: 0x9c4c2f,
    transparent: true,
    opacity: 0.18,
  })
)
coreGroup.add(connectLines)

const ambient = new THREE.AmbientLight(0xffa46b, 0.4)
scene.add(ambient)

const keyLight = new THREE.PointLight(0xff7c3c, 1.2, 30)
keyLight.position.set(4, 5, 6)
scene.add(keyLight)

const rimLight = new THREE.PointLight(0x6ab0ff, 0.9, 25)
rimLight.position.set(-4, -3, -5)
scene.add(rimLight)

const loader = new THREE.TextureLoader()
skillImages.forEach((skill, index) => {
  const texture = loader.load(skill.url)
  texture.colorSpace = THREE.SRGBColorSpace

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(1.2, 1.2, 1.2) // controls icon size

  const angle = (index / skillImages.length) * Math.PI * 2
  const x = Math.cos(angle) * orbitRadiusX
  const y = Math.sin(angle) * orbitRadiusY
  const z = Math.sin(angle * 0.5) * 0.3 // slight depth wobble so they aren’t on a flat plane
  sprite.position.set(x, y, z)

  // face the camera (sprites do this automatically), but add subtle bobbing
  sprite.userData = { angle, speed: 0.002 + 0.0005 * index }
  scene.add(sprite)
})

// animate orbit
function animate() {
  requestAnimationFrame(animate)
  coreGroup.rotation.y += 0.0015
  coreGroup.rotation.x = Math.sin(Date.now() * 0.0002) * 0.08
  scene.traverse((obj) => {
    if (obj.isSprite && obj.userData) {
      const data = obj.userData
      data.angle += data.speed
      obj.position.x = Math.cos(data.angle) * orbitRadiusX
      obj.position.y = Math.sin(data.angle) * orbitRadiusY
      obj.position.z = Math.sin(data.angle * 0.6) * 0.35
    }
  })
  renderer.render(scene, camera)
}
animate()