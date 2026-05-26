import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function SpinningCard() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[3.4, 2.1, 0.04]} />
      <meshStandardMaterial
        color="#00FF94"
        emissive="#00FF94"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function ResumeCardScene() {
  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      camera={{ fov: 45, position: [0, 0, 6] }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#020208']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#00FF94" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#00D4FF" />
      <SpinningCard />
    </Canvas>
  )
}
