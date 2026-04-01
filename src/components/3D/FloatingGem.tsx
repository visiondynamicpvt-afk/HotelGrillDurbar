import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingGem = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={1.5}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        resolution={512}
        transmission={0.9}
        roughness={0.1}
        thickness={0.5}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropicBlur={0.1}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0.5}
        color="#3FB89D"
      />
    </mesh>
  );
};

export default FloatingGem;
