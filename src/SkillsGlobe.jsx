import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SPHERE_RADIUS = 2.5
const ICON_SIZE = 0.58
const FLOAT_OFFSET = 1.05

const mySkills = [
  { name: 'React', iconUrl: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'AWS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'JavaScript', iconUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'Node.js', iconUrl: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  {'name': 'Django', iconUrl: 'https://cdn.simpleicons.org/django/092E20'},
  { name: 'Three.js', iconUrl: 'https://cdn.simpleicons.org/threedotjs/FFFFFF' },
  { name: 'Tensorflow', iconUrl: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
  { name: 'PyTorch', iconUrl: 'https://cdn.simpleicons.org/pytorch/EE4C2C' },
  { name: 'Python', iconUrl: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'Docker', iconUrl: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Git', iconUrl: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'Java', iconUrl: 'https://cdn.simpleicons.org/openjdk/007396' },
  { name: 'Pandas', iconUrl: 'https://cdn.simpleicons.org/pandas/150458' },
  { name: 'PostgreSQL', iconUrl: 'https://cdn.simpleicons.org/postgresql/336791' },
  { name: 'C++', iconUrl: 'https://cdn.simpleicons.org/cplusplus/00599C' },
  { name: 'Linux', iconUrl: 'https://cdn.simpleicons.org/linux/FCC624' },
  { name: 'VS Code', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
]

export default function SkillsGlobe() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mountEl = mountRef.current
    if (!mountEl) {
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NoToneMapping

    mountEl.appendChild(renderer.domElement)

    const sphereGroup = new THREE.Group()
    scene.add(sphereGroup)

    const geometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 1)
    const surfaceMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.6,
      flatShading: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const sphereSurface = new THREE.Mesh(geometry, surfaceMaterial)
    sphereGroup.add(sphereSurface)

    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x442211,
      transparent: true,
      opacity: 0.3,
    })
    const sphereLines = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    sphereGroup.add(sphereLines)

    const iconsGroup = new THREE.Group()
    scene.add(iconsGroup)

    const textureLoader = new THREE.TextureLoader()
    const iconMaterials = []

    mySkills.forEach((skill) => {
      const texture = textureLoader.load(skill.iconUrl)
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(ICON_SIZE, ICON_SIZE, 1)
      iconMaterials.push(spriteMaterial)
      iconsGroup.add(sprite)
    })

    const total = mySkills.length
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    iconsGroup.children.forEach((sprite, i) => {
      // Half-step Fibonacci keeps icons away from both poles.
      const y = 1 - (2 * (i + 0.5)) / total
      const radius = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      const x = Math.cos(theta) * radius * SPHERE_RADIUS
      const z = Math.sin(theta) * radius * SPHERE_RADIUS

      sprite.position.set(x * FLOAT_OFFSET, y * SPHERE_RADIUS * FLOAT_OFFSET, z * FLOAT_OFFSET)
    })

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const worldPos = new THREE.Vector3()

    const resize = () => {
      const width = mountEl.clientWidth
      const height = mountEl.clientHeight
      if (!width || !height) {
        return
      }

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      camera.position.z = width < 560 ? 9 : 8
      renderer.setSize(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    let animationFrameId = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      sphereGroup.rotation.z = 0.1
      iconsGroup.rotation.z = 0.1

      iconsGroup.children.forEach((sprite) => {
        sprite.getWorldPosition(worldPos)
        const minZ = -SPHERE_RADIUS * FLOAT_OFFSET
        const maxZ = SPHERE_RADIUS * FLOAT_OFFSET
        let opacity = (worldPos.z - minZ) / (maxZ - minZ)
        opacity = Math.max(0.12, Math.min(1, opacity))
        sprite.material.opacity = opacity
      })

      sphereGroup.rotation.y += 0.003
      iconsGroup.rotation.y += 0.003

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)

      iconMaterials.forEach((material) => {
        if (material.map) {
          material.map.dispose()
        }
        material.dispose()
      })

      sphereSurface.geometry.dispose()
      surfaceMaterial.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      renderer.dispose()

      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="skills-globe-canvas" aria-label="3D skills globe animation" />
}
