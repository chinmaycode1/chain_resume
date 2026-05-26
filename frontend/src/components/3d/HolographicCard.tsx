import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useCardTexture, type CardTextureProps } from './CardTexture';

// Inline shaders
const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uFresnelPower;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - dot(vNormal, viewDir), uFresnelPower);
  
  float bands = sin(vUv.y * 20.0 + uTime * 2.0) * 0.5 + 0.5;
  vec3 rainbow = mix(uColor1, mix(uColor2, uColor3, bands), fresnel);
  
  float scanline = sin(vUv.y * 200.0) * 0.04;
  
  vec4 tex = texture2D(uTexture, vUv);
  vec3 finalColor = tex.rgb + rainbow * fresnel * 0.6 + scanline;
  
  float alpha = smoothstep(0.0, 0.02, vUv.x) *
                smoothstep(1.0, 0.98, vUv.x) *
                smoothstep(0.0, 0.02, vUv.y) *
                smoothstep(1.0, 0.98, vUv.y);
  
  gl_FragColor = vec4(finalColor, alpha * 0.97 + 0.03);
}
`;

export interface HolographicCardProps {
  resumeData: CardTextureProps;
  isFlipped: boolean;
  onFlip: () => void;
}

export const HolographicCard = ({ resumeData, isFlipped, onFlip }: HolographicCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const texture = useCardTexture(resumeData);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Flip animation
  const { rotationY } = useSpring({
    rotationY: isFlipped ? Math.PI : 0,
    config: { tension: 120, friction: 20 },
  });

  // Hover scale animation
  const { scale } = useSpring({
    scale: hovered ? 1.05 : 1.0,
    config: { tension: 300, friction: 20 },
  });

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Idle float
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.1;

    // Mouse parallax (only when not flipping)
    if (!isFlipped) {
      const targetRotY = mouseRef.current.x * 0.4;
      const targetRotX = -mouseRef.current.y * 0.25;

      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
    }

    // Update shader time uniform
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = time;
    }
  });

  // Create shader material with ref
  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uColor1: { value: new THREE.Color('#00FF94') },
        uColor2: { value: new THREE.Color('#00D4FF') },
        uColor3: { value: new THREE.Color('#7C3AED') },
        uFresnelPower: { value: 2.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.FrontSide,
    });

    // Store reference for animation updates
    (shaderRef as any).current = material;

    return material;
  }, [texture]);

  // Create materials array
  const materials = useMemo(() => {
    const edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: '#1a1a2e',
      metalness: 1.0,
      roughness: 0.05,
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: '#0A0A1A',
      metalness: 0.9,
      roughness: 0.1,
    });

    return [
      edgeMaterial, // right
      edgeMaterial, // left
      edgeMaterial, // top
      edgeMaterial, // bottom
      shaderMaterial, // front
      backMaterial, // back
    ];
  }, [shaderMaterial]);

  return (
    <animated.mesh
      ref={meshRef}
      rotation-y={rotationY}
      scale={scale}
      onClick={onFlip}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      material={materials}
    >
      <boxGeometry args={[3.4, 2.1, 0.04]} />
    </animated.mesh>
  );
};
