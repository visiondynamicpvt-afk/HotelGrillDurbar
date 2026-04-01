import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import ParticleField from './ParticleField';
import FloatingGem from './FloatingGem';

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3FB89D" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9A86A" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#5FDCC2"
          />
          
          <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={1}
          >
            <FloatingGem />
          </Float>
          
          <ParticleField count={300} color="#3FB89D" />
          <ParticleField count={100} color="#C9A86A" />
          
          <Environment preset="night" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
