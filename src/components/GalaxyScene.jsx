import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = ['#ffffff', '#4cc9f0', '#9b5de5', '#ffd166'];

function getParticleCount(isMobile) {
  return isMobile ? 950 : 2400;
}

function createSpiralGeometry(isMobile) {
  const particleCount = getParticleCount(isMobile);
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const coreColor = new THREE.Color('#fff9ea');
  const blueColor = new THREE.Color('#4cc9f0');
  const purpleColor = new THREE.Color('#9b5de5');
  const goldColor = new THREE.Color('#ffd166');

  for (let index = 0; index < particleCount; index += 1) {
    const progress = index / particleCount;
    const armIndex = index % 4;
    const radius = 0.4 + progress * 11.4;
    const armSpread = 0.35 + (1 - progress) * 0.95;
    const spin = progress * 11.2 + armIndex * (Math.PI / 2) + (Math.random() - 0.5) * 0.8;
    const radialJitter = (Math.random() - 0.5) * armSpread;

    const x = Math.cos(spin) * (radius + radialJitter);
    const z = Math.sin(spin) * (radius + radialJitter) * 0.65;
    const y = (Math.random() - 0.5) * (1.8 - progress * 0.8) + Math.sin(progress * Math.PI * 5 + armIndex) * 0.12;

    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;

    const mixColor = new THREE.Color();
    if (progress < 0.22) {
      mixColor.copy(coreColor).lerp(goldColor, progress / 0.22);
    } else if (progress < 0.5) {
      mixColor.copy(goldColor).lerp(blueColor, (progress - 0.22) / 0.28);
    } else {
      mixColor.copy(blueColor).lerp(purpleColor, (progress - 0.5) / 0.5);
    }

    const brightness = 1 - progress * 0.55;
    colors[index * 3] = mixColor.r * brightness;
    colors[index * 3 + 1] = mixColor.g * brightness;
    colors[index * 3 + 2] = mixColor.b * brightness;
  }

  return { positions, colors };
}

function createDustGeometry(isMobile) {
  const count = isMobile ? 700 : 1300;
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const progress = index / count;
    const arm = index % 3;
    const radius = 1 + progress * 12;
    const angle = progress * 10.2 + arm * 2.1 + (Math.random() - 0.5) * 0.6;

    positions[index * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.2;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 2.8;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.72 + (Math.random() - 0.5) * 1.2;
  }

  return positions;
}

function SpiralGalaxy({ isMobile }) {
  const cloud = useMemo(() => createSpiralGeometry(isMobile), [isMobile]);
  const dust = useMemo(() => createDustGeometry(isMobile), [isMobile]);
  const cloudRef = useRef(null);
  const dustRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloudRef.current) {
      cloudRef.current.rotation.y = Math.sin(t * 0.03) * 0.08;
      cloudRef.current.rotation.z = -0.38 + Math.sin(t * 0.04) * 0.03;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = -t * 0.015;
      dustRef.current.rotation.x = Math.sin(t * 0.03) * 0.02;
    }
  });

  return (
    <group>
      <group ref={cloudRef} rotation={[0.2, -0.55, 0.08]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[cloud.colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={isMobile ? 0.03 : 0.04}
            sizeAttenuation
            transparent
            opacity={0.96}
            vertexColors
            depthWrite={false}
          />
        </points>
      </group>

      <group ref={dustRef} rotation={[-0.16, 0.42, -0.08]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dust, 3]} />
          </bufferGeometry>
          <pointsMaterial size={isMobile ? 0.012 : 0.015} sizeAttenuation transparent opacity={0.42} color="#f8fbff" depthWrite={false} />
        </points>
      </group>
    </group>
  );
}

function OrbitRing({ radiusX, radiusZ, rotation, opacity, color, speed }) {
  const ringRef = useRef(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += speed * delta;
    }
  });

  return (
    <mesh ref={ringRef} rotation={rotation} scale={[radiusX / 8, 1, radiusZ / 8]}>
      <torusGeometry args={[8, 0.035, 10, 240]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function GlowCore() {
  const coreRef = useRef(null);
  const haloRef = useRef(null);
  const auraRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.z = t * 0.08;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + Math.sin(t * 1.1) * 0.03);
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={auraRef}>
        <sphereGeometry args={[5.7, 48, 48]} />
        <meshBasicMaterial color="#4cc9f0" transparent opacity={0.05} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[3.7, 40, 40]} />
        <meshBasicMaterial color="#ffd166" transparent opacity={0.1} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.45, 40, 40]} />
        <meshStandardMaterial color="#fffbe8" emissive="#fff2b8" emissiveIntensity={2.8} roughness={0.22} metalness={0.12} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3.1} color="#fff0bb" distance={40} />
      <pointLight position={[2.8, 1.2, 1.4]} intensity={1.35} color="#4cc9f0" distance={28} />
      <pointLight position={[-2.3, -1.1, -1.8]} intensity={1.1} color="#9b5de5" distance={26} />
    </group>
  );
}

function Planet({ radius, size, speed, color, phase, orbitTilt }) {
  const planetRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (planetRef.current) {
      planetRef.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 0.7) * orbitTilt,
        Math.sin(t) * radius * 0.72,
      );
      planetRef.current.rotation.x = t * 0.5;
      planetRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group ref={planetRef}>
      <mesh>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.35} metalness={0.08} />
      </mesh>
      <mesh scale={[2.2, 2.2, 2.2]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function MessageStar({ message, index, onSelect, isMobile }) {
  const starRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const radius = 5.8 + index * 1.8;
  const speed = 0.11 + (index % 5) * 0.018;
  const incline = 0.4 + (index % 3) * 0.22;
  const accent = COLORS[index % COLORS.length];

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.body.style.cursor = hovered ? 'pointer' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const angle = t * speed + index * 0.9;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.72;
    const y = Math.sin(angle * 0.6 + index) * incline;

    if (starRef.current) {
      starRef.current.position.set(x, y, z);
      starRef.current.rotation.x += delta * 0.2;
      starRef.current.rotation.y += delta * 0.25;
      const target = hovered ? 1.18 : 1;
      starRef.current.scale.setScalar(THREE.MathUtils.lerp(starRef.current.scale.x, target, 0.14));
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2.1 + index) * 0.08);
    }
  });

  return (
    <group
      ref={starRef}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(message);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <icosahedronGeometry args={[isMobile ? 0.16 : 0.22, 0]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.35} roughness={0.18} metalness={0.12} />
      </mesh>
      <mesh ref={glowRef} scale={[2.4, 2.4, 2.4]}>
        <sphereGeometry args={[0.2, 18, 18]} />
        <meshBasicMaterial color={accent} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function SceneEffects({ isMobile }) {
  return (
    <>
      <color attach="background" args={['#03050d']} />
      <fog attach="fog" args={['#03050d', 13, 52]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[8, 10, 10]} intensity={0.5} color="#dfefff" />
      <Stars radius={120} depth={65} count={isMobile ? 1100 : 2200} factor={3} saturation={0} fade speed={0.35} />
    </>
  );
}

export default function GalaxyScene({ messages, onSelectMessage }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function updateQuality() {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(window.innerWidth < 768 || reducedMotion);
    }

    updateQuality();
    window.addEventListener('resize', updateQuality);
    return () => window.removeEventListener('resize', updateQuality);
  }, []);

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, isMobile ? 1.15 : 1.75]}
      camera={{ position: [0, 4.8, 18.8], fov: 40, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <SceneEffects isMobile={isMobile} />

      <SpiralGalaxy isMobile={isMobile} />
      <GlowCore />

      <OrbitRing radiusX={9.2} radiusZ={6.4} rotation={[-0.1, 0.18, 0.1]} opacity={0.11} color="#4cc9f0" speed={0.03} />
      <OrbitRing radiusX={11.8} radiusZ={8.2} rotation={[0.14, -0.22, -0.08]} opacity={0.08} color="#ffd166" speed={-0.022} />
      <OrbitRing radiusX={14.2} radiusZ={10.1} rotation={[-0.18, 0.4, 0.06]} opacity={0.07} color="#9b5de5" speed={0.018} />
      <OrbitRing radiusX={16.6} radiusZ={11.4} rotation={[0.06, -0.1, 0.12]} opacity={0.05} color="#ffffff" speed={-0.012} />

      <Planet radius={7.4} size={0.38} speed={0.22} color="#ffd166" phase={0.3} orbitTilt={0.34} />
      <Planet radius={10.5} size={0.28} speed={0.16} color="#4cc9f0" phase={2.2} orbitTilt={0.42} />
      <Planet radius={13.3} size={0.22} speed={0.12} color="#9b5de5" phase={4.1} orbitTilt={0.3} />

      {messages.map((message, index) => (
        <MessageStar key={message.id} message={message} index={index} onSelect={onSelectMessage} isMobile={isMobile} />
      ))}
    </Canvas>
  );
}
