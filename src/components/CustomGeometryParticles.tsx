import React, { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as colors from "../shared/colors";

interface CustomGeometryParticlesProps {
  count: number;
}

const CustomGeometryParticles = (props: CustomGeometryParticlesProps) => {
  const { count } = props;

  // This reference gives us direct access to our points
  const points = useRef() as MutableRefObject<any>;

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const distance = 1;

    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi) * 1;
      let y = distance * Math.sin(theta) * Math.sin(phi) * 1;
      let z = distance * Math.cos(theta) * 1;

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  useFrame((state) => {
    const { clock } = state;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      points.current.geometry.attributes.position.array[i3] +=
        Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
      points.current.geometry.attributes.position.array[i3 + 1] +=
        Math.cos(clock.elapsedTime + Math.random() * 10) * 0.01;
      points.current.geometry.attributes.position.array[i3 + 2] +=
        Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={colors.primaryColor}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default CustomGeometryParticles;
