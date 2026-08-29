"use client";

import { type MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type SceneProps = { progressRef: MutableRefObject<number> };

const buildings = [
  [-5.5, 1.7, -1.5, 1.25, 3.4, 1.45, -0.08],
  [-4.25, 2.6, -4.1, 1.5, 5.2, 1.8, 0.1],
  [-5.9, 1.35, -7.3, 1.1, 2.7, 1.2, -0.12],
  [-3.45, 2.05, -8.7, 1.1, 4.1, 1.35, 0.13],
  [-4.8, 1.2, -11.2, 0.9, 2.4, 1.05, -0.08],
  [5.2, 2.2, -2.2, 1.35, 4.4, 1.6, 0.08],
  [4.05, 1.55, -5.2, 1.5, 3.1, 1.75, -0.1],
  [5.65, 2.65, -7.1, 1.2, 5.3, 1.4, 0.12],
  [3.35, 1.6, -9.1, 1.05, 3.2, 1.25, -0.14],
  [4.65, 1.1, -11.5, 0.85, 2.2, 1, 0.09],
] as const;

const panels = [
  [-3.05, 2.3, -2.7, 1.6, .75, .08, 0.16],
  [-3.1, 3.7, -6.7, 1.35, 1.7, .06, -0.14],
  [-2.5, 1.4, -10, 1.2, .72, .05, 0.09],
  [3, 2.8, -3.8, 1.55, 1.05, .07, -0.18],
  [2.55, 1.7, -7.6, 1.3, .78, .05, 0.14],
  [2.25, 3.1, -10.2, 1.1, 1.45, .05, -0.08],
] as const;

function range(progress: number, start: number, end: number) {
  const value = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  return value * value * (3 - 2 * value);
}

function GlassMaterial({ opacity = .62 }: { opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color="#252a29"
      roughness={.12}
      metalness={.22}
      transmission={.7}
      thickness={.9}
      ior={1.28}
      clearcoat={1}
      clearcoatRoughness={.16}
      transparent
      opacity={opacity}
      depthWrite={false}
    />
  );
}

function City({ progressRef }: SceneProps) {
  const { size } = useThree();
  const buildingRefs = useRef<Array<THREE.Mesh | null>>([]);
  const panelRefs = useRef<Array<THREE.Mesh | null>>([]);
  const railRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pathMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const horizonMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const horizonLight = useRef<THREE.PointLight>(null);

  const riverGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([
      -2.8, 0, 5.5, 2.8, 0, 5.5, .42, 0, -14, -.42, 0, -14,
    ], 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const railCurves = useMemo(() => [
    new THREE.CubicBezierCurve3(new THREE.Vector3(-6, .08, 5), new THREE.Vector3(-4.8, .45, -1), new THREE.Vector3(-2.7, 1.1, -8), new THREE.Vector3(-.8, .65, -13)),
    new THREE.CubicBezierCurve3(new THREE.Vector3(6, .08, 5), new THREE.Vector3(4.9, .4, -1.8), new THREE.Vector3(2.6, 1, -8.5), new THREE.Vector3(.8, .65, -13)),
  ], []);

  useFrame(({ camera, clock }) => {
    const progress = progressRef.current;
    const mobile = size.width < 768;
    camera.position.set(0, 2.8 - progress * (mobile ? .3 : .5), 12.2 - progress * (mobile ? 2.35 : 3.7));
    camera.lookAt(0, 1.15, -8.5 - progress * 1.5);

    buildingRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const local = range(progress, .08 + index * .025, .7 + index * .018);
      const height = buildings[index][4];
      mesh.scale.y = .04 + local * .96;
      mesh.position.y = (height * mesh.scale.y) / 2 - .04;
      mesh.rotation.y = buildings[index][6] + (index < 5 ? -.3 : .3) * (1 - local);
      (mesh.material as THREE.MeshPhysicalMaterial).opacity = .08 + local * .56;
    });

    panelRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const local = range(progress, .2 + index * .045, .72 + index * .025);
      mesh.position.y = panels[index][1] - (1 - local) * 1.6;
      mesh.position.z = panels[index][2] + (1 - local) * 2.2;
      mesh.rotation.x = (1 - local) * .7;
      mesh.rotation.y = panels[index][6] + (index < 3 ? .55 : -.55) * (1 - local);
      mesh.scale.setScalar(.45 + local * .55);
      (mesh.material as THREE.MeshPhysicalMaterial).opacity = local * .48;
    });

    railRefs.current.forEach((mesh, index) => {
      const local = range(progress, .02 + index * .04, .75);
      if (mesh) mesh.scale.set(local, local, local);
    });

    if (pathMaterial.current) {
      pathMaterial.current.opacity = .12 + progress * .35;
      pathMaterial.current.clearcoatRoughness = .2 + Math.sin(clock.elapsedTime * .35) * .025;
    }
    if (horizonMaterial.current) horizonMaterial.current.opacity = .12 + progress * .62;
    if (horizonLight.current) horizonLight.current.intensity = .35 + progress * 2.1;
  });

  return (
    <>
      <fog attach="fog" args={["#080908", 8, 28]} />
      <ambientLight intensity={.45} color="#b7bab4" />
      <directionalLight position={[0, 8, 5]} intensity={1.2} color="#e9e6da" />
      <pointLight ref={horizonLight} position={[0, 1, -13]} intensity={.35} color="#eeeadd" distance={18} decay={2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.05, -4]}>
        <planeGeometry args={[30, 34]} />
        <meshStandardMaterial color="#090a09" roughness={.72} metalness={.15} />
      </mesh>
      <mesh geometry={riverGeometry} position={[0, .02, 0]}>
        <meshPhysicalMaterial ref={pathMaterial} color="#606562" roughness={.08} metalness={.7} transmission={.4} thickness={.35} clearcoat={1} transparent opacity={.12} depthWrite={false} />
      </mesh>

      {railCurves.map((curve, index) => (
        <mesh key={index} ref={node => { railRefs.current[index] = node; }}>
          <tubeGeometry args={[curve, 36, .035, 8, false]} />
          <GlassMaterial opacity={.46} />
        </mesh>
      ))}

      {buildings.map((building, index) => (
        <group key={index} position={[building[0], 0, building[2]]}>
          <mesh ref={node => { buildingRefs.current[index] = node; }}>
            <boxGeometry args={[building[3], building[4], building[5]]} />
            <GlassMaterial />
            <mesh position={[0, 0, building[5] * .505]}>
              <planeGeometry args={[building[3] * .72, building[4] * .68, 3, 5]} />
              <meshBasicMaterial color="#d8d9d3" wireframe transparent opacity={.045} depthWrite={false} />
            </mesh>
          </mesh>
        </group>
      ))}

      {panels.map((panel, index) => (
        <mesh key={index} ref={node => { panelRefs.current[index] = node; }} position={[panel[0], panel[1], panel[2]]} rotation={[0, panel[6], 0]}>
          <boxGeometry args={[panel[3], panel[4], panel[5]]} />
          <GlassMaterial opacity={.1} />
        </mesh>
      ))}

      <mesh position={[0, 1.05, -14]}>
        <planeGeometry args={[6.8, .045]} />
        <meshBasicMaterial ref={horizonMaterial} color="#f3efe2" transparent opacity={.12} depthWrite={false} />
      </mesh>
      <mesh position={[0, .16, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 8]} />
        <meshBasicMaterial color="#c8cbc5" transparent opacity={.026} depthWrite={false} />
      </mesh>
    </>
  );
}

export default function GlassCityScene({ progressRef }: SceneProps) {
  return (
    <Canvas
      className="glass-city-canvas"
      camera={{ position: [0, 2.8, 12.2], fov: 44, near: .1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = .82; }}
    >
      <City progressRef={progressRef} />
    </Canvas>
  );
}
