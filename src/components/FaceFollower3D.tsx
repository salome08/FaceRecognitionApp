import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import CustomGeometryParticles from "./CustomGeometryParticles";

interface FaceFollowerProps {
  faceIndex: number;
  faceFollowers: THREE.Object3D<THREE.Event>[];
}

const FaceFollower: React.FC<FaceFollowerProps> = ({
  faceIndex,
  faceFollowers,
}) => {
  const objRef = useRef<THREE.Object3D>(null!);
  useEffect(() => {
    const threeObject3D = objRef.current;
    faceFollowers[faceIndex] = threeObject3D;
  });

  return (
    <object3D ref={objRef}>
      <ambientLight intensity={0.6} />
      <CustomGeometryParticles count={1000} />
    </object3D>
  );
};

export default FaceFollower;
